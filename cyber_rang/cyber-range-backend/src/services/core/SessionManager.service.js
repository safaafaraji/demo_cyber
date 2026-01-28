const ActiveSession = require('../../models/ActiveSession.model');
const DockerService = require('../infrastructure/DockerService');
const Lab = require('../../models/Lab.model');
const logger = require('../../utils/logger');

const { logAction } = require('../../controllers/history.controller');

class SessionManagerService {
    async startSession(userId, labId) {
        const lab = await Lab.findById(labId);
        if (!lab) throw new Error('Lab not found');

        // Check if user already has a session
        const existingSession = await ActiveSession.findOne({ user: userId, status: 'active' });
        if (existingSession) throw new Error('User already has an active session');

        const container = await DockerService.createContainer(lab.dockerImage);
        await DockerService.startContainer(container.id);

        const session = await ActiveSession.create({
            user: userId,
            lab: labId,
            containerId: container.id,
            expiresAt: new Date(Date.now() + 3600000), // 1 hour
        });

        await logAction(userId, 'SESSION_START', lab.name, { sessionId: session._id });

        return session;
    }

    async stopSession(sessionId) {
        const session = await ActiveSession.findById(sessionId).populate('lab');
        if (session && session.status === 'active') {
            try {
                await DockerService.stopContainer(session.containerId);
                await DockerService.removeContainer(session.containerId);
            } catch (e) {
                logger.error(`Failed to stop container ${session.containerId}: ${e.message}`);
            }
            session.status = 'closed';
            await session.save();
            await logAction(session.user, 'SESSION_STOP', session.lab?.name || 'Unknown Lab', { sessionId: session._id });
        }
    }

    async stopAllSessions() {
        const activeSessions = await ActiveSession.find({ status: 'active' });
        const results = { success: 0, failed: 0 };

        for (const session of activeSessions) {
            try {
                await this.stopSession(session._id);
                results.success++;
            } catch (e) {
                results.failed++;
                logger.error(`Failed to emergency stop session ${session._id}: ${e.message}`);
            }
        }
        return results;
    }
}

module.exports = new SessionManagerService();
