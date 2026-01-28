const AuthService = require('../services/security/AuthService');

const register = async (req, res, next) => {
    try {
        const user = await AuthService.register(req.body);
        res.status(201).json({ message: 'User created successfully', user: { id: user._id, email: user.email } });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await AuthService.login(email, password);
        res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role, isVerified: user.isVerified } });
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        await AuthService.verifyEmail(email, code);
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

const googleLogin = async (req, res, next) => {
    try {
        const { idToken } = req.body;
        const { user, accessToken, refreshToken } = await AuthService.googleLogin(idToken);
        res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, role: user.role, isVerified: user.isVerified } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    googleLogin,
};
