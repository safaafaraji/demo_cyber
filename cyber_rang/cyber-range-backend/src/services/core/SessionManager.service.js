const ActiveSession = require('../../models/ActiveSession.model');
const DockerService = require('../infrastructure/DockerService');
const NetworkService = require('../infrastructure/NetworkService');
const SecurityMonitor = require('../security/SecurityMonitor.service');
const Lab = require('../../models/Lab.model');
const logger = require('../../utils/logger');
const { SESSION_STATUS } = require('../../utils/constants');

const { logAction } = require('../../controllers/history.controller');

class SessionManagerService {
    async startSession(userId, labId) {
        const lab = await Lab.findById(labId);
        if (!lab) throw new Error('Lab not found');

        // Check resource availability (mock limit of 10 concurrent sessions for now)
        const totalActive = await ActiveSession.countDocuments({
            status: { $in: [SESSION_STATUS.RUNNING, SESSION_STATUS.INITIALIZING] }
        });
        if (totalActive >= 10) throw new Error('Maximum lab capacity reached. Please try again later.');

        // Check if user already has an active session
        const existingSession = await ActiveSession.findOne({
            user: userId,
            status: { $in: [SESSION_STATUS.RUNNING, SESSION_STATUS.INITIALIZING, SESSION_STATUS.PAUSED] }
        });
        if (existingSession) throw new Error('You already have an active lab session.');

        // Create initial session record (State: INITIALIZING)
        const session = await ActiveSession.create({
            user: userId,
            lab: labId,
            status: SESSION_STATUS.INITIALIZING,
            startTime: new Date(),
            expiresAt: new Date(Date.now() + 3600000), // 1 hour default
        });

        try {
            // 1. Create isolated network
            const networkName = `net_${userId}_${labId}_${Date.now()}`;
            const network = await NetworkService.createNetwork(networkName);
            session.networkId = network.id;
            await session.save();

            // 2. Create and start container
            const containerName = `lab_${userId}_${labId}_${Date.now()}`;
            const container = await DockerService.createContainer(lab.dockerImage, {
                name: containerName,
                HostConfig: {
                    NetworkMode: networkName,
                    PortBindings: {
                        '80/tcp': [{ HostPort: '0' }] // Auto-assign a free host port
                    }
                }
            });

            session.containerId = container.id;
            await session.save();

            await DockerService.startContainer(container.id);

            // 3. Get connection info
            const containerInfo = await (await DockerService.docker.getContainer(container.id)).inspect();
            const hostPort = containerInfo.NetworkSettings.Ports['80/tcp'][0].HostPort;
            const ipAddress = containerInfo.NetworkSettings.IPAddress || '127.0.0.1';

            session.portMapping = { '80': hostPort };
            session.ipAddress = ipAddress;
            session.portAssigned = parseInt(hostPort);
            session.status = SESSION_STATUS.RUNNING;
            await session.save();

            // 4. Start Monitoring
            SecurityMonitor.monitorEvent({
                type: 'SESSION_START',
                userId,
                labId,
                sessionId: session._id,
                details: { containerId: container.id, networkId: network.id }
            });

            await logAction(userId, 'SESSION_START', lab.name, { sessionId: session._id, port: hostPort });

            return session;
        } catch (error) {
            logger.error(`Failed to start session: ${error.message}`);
            session.status = SESSION_STATUS.FAILED;
            await session.save();

            // Cleanup on failure
            await this.cleanupSessionResources(session);
            throw error;
        }
    }

    async stopSession(sessionId, reason = SESSION_STATUS.TERMINATED) {
        const session = await ActiveSession.findById(sessionId).populate('lab');
        if (!session || [SESSION_STATUS.TERMINATED, SESSION_STATUS.COMPLETED, SESSION_STATUS.TIMEOUT].includes(session.status)) {
            return;
        }

        session.status = SESSION_STATUS.STOPPING;
        await session.save();

        try {
            await this.cleanupSessionResources(session);

            session.status = reason;
            session.endTime = new Date();
            await session.save();

            await logAction(session.user, 'SESSION_STOP', session.lab?.name || 'Unknown Lab', {
                sessionId: session._id,
                reason
            });
        } catch (error) {
            logger.error(`Error stopping session ${sessionId}: ${error.message}`);
            session.status = SESSION_STATUS.FAILED;
            await session.save();
        }
    }

    async cleanupSessionResources(session) {
        if (session.containerId) {
            try {
                await DockerService.stopContainer(session.containerId);
                await DockerService.removeContainer(session.containerId);
            } catch (e) {
                logger.warn(`Could not remove container ${session.containerId}: ${e.message}`);
            }
        }

        if (session.networkId) {
            try {
                // Docker expects names or IDs
                const network = DockerService.docker.getNetwork(session.networkId);
                await network.remove();
            } catch (e) {
                logger.warn(`Could not remove network ${session.networkId}: ${e.message}`);
            }
        }
    }

    async pauseSession(sessionId) {
        const session = await ActiveSession.findById(sessionId);
        if (session && session.status === SESSION_STATUS.RUNNING) {
            const container = DockerService.docker.getContainer(session.containerId);
            await container.pause();
            session.status = SESSION_STATUS.PAUSED;
            await session.save();
            await logAction(session.user, 'SESSION_PAUSE', 'Lab', { sessionId });
        }
    }

    async resumeSession(sessionId) {
        const session = await ActiveSession.findById(sessionId);
        if (session && session.status === SESSION_STATUS.PAUSED) {
            const container = DockerService.docker.getContainer(session.containerId);
            await container.unpause();
            session.status = SESSION_STATUS.RUNNING;
            await session.save();
            await logAction(session.user, 'SESSION_RESUME', 'Lab', { sessionId });
        }
    }

    async stopAllSessions() {
        const activeSessions = await ActiveSession.find({
            status: { $in: [SESSION_STATUS.RUNNING, SESSION_STATUS.PAUSED, SESSION_STATUS.INITIALIZING] }
        });
        const results = { success: 0, failed: 0 };

        for (const session of activeSessions) {
            try {
                await this.stopSession(session._id, SESSION_STATUS.TERMINATED);
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

