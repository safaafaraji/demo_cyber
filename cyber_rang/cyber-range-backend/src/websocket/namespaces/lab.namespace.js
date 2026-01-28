const { TERMINAL_OUTPUT } = require('../events');
const TerminalService = require('../../services/infrastructure/TerminalService');
const ActiveSession = require('../../models/ActiveSession.model');

module.exports = (io) => {
    const labNs = io.of('/labs');

    labNs.on('connection', (socket) => {
        socket.on('join_lab', (sessionId) => {
            socket.join(sessionId);
        });

        socket.on('terminal_input', async (data) => {
            const { sessionId, command } = data;
            try {
                const session = await ActiveSession.findById(sessionId);
                if (!session || session.status !== 'active') {
                    return socket.emit(TERMINAL_OUTPUT, { data: 'No active session found.' });
                }

                const output = await TerminalService.executeCommand(socket.user.id, sessionId, session.containerId, command);
                socket.emit(TERMINAL_OUTPUT, { data: output });
            } catch (error) {
                socket.emit(TERMINAL_OUTPUT, { data: 'Command Error: ' + error.message });
            }
        });
    });
};
