const { ADMIN_STATS_UPDATE } = require('../events');

module.exports = (io) => {
    const adminNs = io.of('/admin');

    adminNs.on('connection', (socket) => {
        if (socket.user.role !== 'admin') {
            socket.disconnect(true);
            return;
        }
        // Send live stats
    });
};
