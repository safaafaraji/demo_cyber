const { verifyToken } = require('../utils/tokenHelper.util');
const logger = require('../utils/logger');
const User = require('../models/User.model');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;
