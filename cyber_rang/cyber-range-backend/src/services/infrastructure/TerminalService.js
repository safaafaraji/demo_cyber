const DockerService = require('../infrastructure/DockerService');
const { logAction } = require('../../controllers/history.controller');

class TerminalService {
    async executeCommand(userId, sessionId, containerId, command) {
        try {
            const container = DockerService.docker.getContainer(containerId);

            // Create exec instance
            const exec = await container.exec({
                Cmd: ['/bin/sh', '-c', command],
                AttachStdout: true,
                AttachStderr: true,
                Tty: true
            });

            const stream = await exec.start({ hijack: true, stdin: true });

            // Log command to history
            await logAction(userId, 'TERMINAL_CMD', command, { sessionId });

            return new Promise((resolve, reject) => {
                let output = '';
                stream.on('data', (chunk) => {
                    output += chunk.toString();
                });

                stream.on('end', () => {
                    resolve(output);
                });

                stream.on('error', (err) => {
                    reject(err);
                });

                // Timeout safe
                setTimeout(() => { resolve(output + '\n[Command Timeout]'); }, 10000);
            });
        } catch (error) {
            console.error('Terminal Exec Error:', error);
            throw error;
        }
    }
}

module.exports = new TerminalService();
