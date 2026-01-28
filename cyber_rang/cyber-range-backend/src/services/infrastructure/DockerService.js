const Docker = require('dockerode');
const dockerConfig = require('../../config/docker.config');
const logger = require('../../utils/logger');

class DockerService {
    constructor() {
        this.docker = new Docker({ socketPath: dockerConfig.socketPath });
    }

    async createContainer(image, options = {}) {
        try {
            logger.info(`Creating container from image ${image}`);
            // Ensure image exists or pull it
            const container = await this.docker.createContainer({
                Image: image,
                ...options,
            });
            return container;
        } catch (error) {
            logger.error(`Error creating container: ${error.message}`);
            throw error;
        }
    }

    async startContainer(containerId) {
        try {
            const container = this.docker.getContainer(containerId);
            await container.start();
            logger.info(`Container ${containerId} started`);
        } catch (error) {
            logger.error(`Error starting container: ${error.message}`);
            throw error;
        }
    }

    async stopContainer(containerId) {
        try {
            const container = this.docker.getContainer(containerId);
            await container.stop();
            logger.info(`Container ${containerId} stopped`);
        } catch (error) {
            logger.error(`Error stopping container: ${error.message}`);
            throw error;
        }
    }

    async removeContainer(containerId) {
        try {
            const container = this.docker.getContainer(containerId);
            await container.remove({ force: true });
            logger.info(`Container ${containerId} removed`);
        } catch (error) {
            logger.error(`Error removing container: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new DockerService();
