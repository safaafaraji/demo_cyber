const winston = require('winston');
const loggerConfig = require('../config/logger.config');

const logger = winston.createLogger({
    levels: loggerConfig.levels,
    format: loggerConfig.format,
    transports: loggerConfig.transports,
});

module.exports = logger;
