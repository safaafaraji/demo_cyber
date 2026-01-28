const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/security.config');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        jwtConfig.refreshSecret,
        { expiresIn: jwtConfig.refreshExpiresIn }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtConfig.secret);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, jwtConfig.refreshSecret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken,
};
