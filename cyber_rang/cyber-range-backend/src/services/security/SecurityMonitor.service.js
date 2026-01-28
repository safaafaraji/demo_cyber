const SecurityEvent = require('../../models/SecurityEvent.model');
const logger = require('../../utils/logger');

class SecurityMonitorService {
    async monitorEvent(eventData) {
        try {
            const event = await SecurityEvent.create({
                sessionId: eventData.sessionId,
                eventType: eventData.type,
                severity: eventData.severity || 'low',
                sourceIP: eventData.sourceIP || '0.0.0.0',
                targetIP: eventData.targetIP || '0.0.0.0',
                details: eventData.details || {},
                timestamp: new Date()
            });

            logger.info(`Security Event Logged: ${eventData.type} for session ${eventData.sessionId}`);

            // Trigger basic pattern analysis
            await this.analyzePattern(eventData.sessionId);

            return event;
        } catch (error) {
            logger.error(`Failed to log security event: ${error.message}`);
        }
    }

    async analyzePattern(sessionId) {
        // Simple logic: if more than 5 events of same type in 1 minute, escalate
        const oneMinuteAgo = new Date(Date.now() - 60000);
        const events = await SecurityEvent.find({
            sessionId,
            timestamp: { $gte: oneMinuteAgo }
        });

        const counts = events.reduce((acc, curr) => {
            acc[curr.eventType] = (acc[curr.eventType] || 0) + 1;
            return acc;
        }, {});

        for (const [type, count] of Object.entries(counts)) {
            if (count > 5) {
                logger.warn(`Potential attack detected: ${type} frequency is high (${count})`);
                await this.createAlert(sessionId, type, count);
            }
        }
    }

    async createAlert(sessionId, type, count) {
        const socketHandler = require('../../websocket/socketHandler');
        try {
            const io = socketHandler.getIo();
            // Emit to a specific room for this session/user
            io.to(`session_${sessionId}`).emit('security-alert', {
                type,
                count,
                message: `Suspicious behavior detected: ${type}`,
                timestamp: new Date()
            });

            // Also notify admins
            io.of('/admin').emit('admin-alert', {
                sessionId,
                type,
                count,
                timestamp: new Date()
            });
        } catch (e) {
            logger.error(`Could not emit socket alert: ${e.message}`);
        }

        logger.error(`ALERT: Session ${sessionId} exhibiting suspicious behavior: ${type} x${count}`);
    }
}


module.exports = new SecurityMonitorService();

