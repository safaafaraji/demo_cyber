const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const serverConfig = require('./config/server.config');
const dbConfig = require('./config/database.config');
const logger = require('./utils/logger');
const socketHandler = require('./websocket/socketHandler');

const server = http.createServer(app);

// Initialize Socket.io
socketHandler.initialize(server);

// Database Connection
mongoose.connect(dbConfig.uri, dbConfig.options)
    .then(() => {
        logger.info('Connected to MongoDB');
        startServer();
    })
    .catch((err) => {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    });

function startServer() {
    server.listen(serverConfig.port, () => {
        logger.info(`Server running in ${serverConfig.env} mode on port ${serverConfig.port}`);
    });
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
