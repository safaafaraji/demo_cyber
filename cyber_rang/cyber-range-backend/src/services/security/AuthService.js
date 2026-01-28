const { generateAccessToken, generateRefreshToken } = require('../../utils/tokenHelper.util');
const { hashPassword, comparePassword } = require('../../utils/hashHelper.util');
const User = require('../../models/User.model');

class AuthService {
    async register(userData) {
        const hashedPassword = await hashPassword(userData.password);
        const isVerified = userData.role === 'admin';
        const verificationCode = isVerified ? undefined : Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            ...userData,
            password: hashedPassword,
            isVerified,
            verificationCode
        });

        if (!isVerified) {
            const EmailService = require('../infrastructure/EmailService');
            await EmailService.sendVerificationCode(user.email, verificationCode);
        }

        return user;
    }

    async verifyEmail(email, code) {
        const User = require('../../models/User.model');
        const user = await User.findOne({ email }).select('+verificationCode');

        if (!user || user.verificationCode !== code) {
            const error = new Error('Invalid verification code');
            error.status = 400;
            throw error;
        }

        user.isVerified = true;
        user.verificationCode = undefined; // Clear code
        await user.save();

        return user;
    }

    async login(email, password) {
        const { logAction } = require('../../controllers/history.controller');
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await comparePassword(password, user.password))) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await logAction(user._id, 'LOGIN', 'System');
        return { user, accessToken, refreshToken };
    }

    async googleLogin(idToken) {
        const { logAction } = require('../controllers/history.controller');
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const { sub: googleId, email, name, picture } = payload;

            let user = await User.findOne({
                $or: [{ googleId }, { email }]
            });

            if (!user) {
                user = await User.create({
                    username: name || email.split('@')[0],
                    email,
                    googleId,
                    isVerified: true, // Google accounts are verified
                    password: Math.random().toString(36).slice(-10), // Random password for OAuth users
                });
            } else if (!user.googleId) {
                user.googleId = googleId;
                user.isVerified = true;
                await user.save();
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            await logAction(user._id, 'LOGIN_GOOGLE', 'Google SSO');
            return { user, accessToken, refreshToken };
        } catch (error) {
            logger.error(`Google Auth Error: ${error.message}`);
            throw new Error('Google authentication failed');
        }
    }
}

module.exports = new AuthService();
