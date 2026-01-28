require('dotenv').config();

module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-for-dev-only',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
    bcrypt: {
        saltRounds: 10,
    },
};
