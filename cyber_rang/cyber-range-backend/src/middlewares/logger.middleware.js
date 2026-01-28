const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
};

module.exports = requestLogger;
