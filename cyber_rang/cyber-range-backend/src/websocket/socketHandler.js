const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/security.config');
const logger = require('../utils/logger');
const labNamespace = require('./namespaces/lab.namespace');
const adminNamespace = require('./namespaces/admin.namespace');

let io;

const initialize = (server) => {
    io = socketIo(server, {
        cors: {
            origin: '*', // Should be more restrictive in production
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        if (socket.handshake.auth && socket.handshake.auth.token) {
            jwt.verify(socket.handshake.auth.token, jwtConfig.secret, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.user = decoded;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`New socket connection: ${socket.id}`);
        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    labNamespace(io);
    adminNamespace(io);

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = {
    initialize,
    getIo,
};
