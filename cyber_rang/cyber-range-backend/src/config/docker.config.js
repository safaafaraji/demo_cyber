require('dotenv').config();

module.exports = {
    socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
    defaultImages: {
        linux: 'alpine:latest',
    },
    limits: {
        memory: 512 * 1024 * 1024, // 512MB
        cpu: 1, // 1 CPU
    },
};
