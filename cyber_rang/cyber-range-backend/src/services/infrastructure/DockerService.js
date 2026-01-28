const Docker = require('dockerode');
const dockerConfig = require('../../config/docker.config');
const logger = require('../../utils/logger');

class DockerService {
    constructor() {
        this.docker = new Docker({ socketPath: dockerConfig.socketPath || '/var/run/docker.sock' });
    }

    async pullImage(image) {
        return new Promise((resolve, reject) => {
            logger.info(`Pulling image: ${image}`);
            this.docker.pull(image, (err, stream) => {
                if (err) return reject(err);
                this.docker.modem.followProgress(stream, onFinished, onProgress);

                function onFinished(err, output) {
                    if (err) return reject(err);
                    resolve(output);
                }

                function onProgress(event) {
                    // Pull progress can be logged if needed
                }
            });
        });
    }

    async createContainer(image, options = {}) {
        try {
            logger.info(`Creating container from image ${image}`);

            // Check if image exists locally, if not pull it
            const images = await this.docker.listImages({ filters: `{"reference": ["${image}"]}` });
            if (images.length === 0) {
                await this.pullImage(image);
            }

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

    async getContainerLogs(containerId) {
        try {
            const container = this.docker.getContainer(containerId);
            const logs = await container.logs({
                stdout: true,
                stderr: true,
                tail: 100
            });
            return logs.toString('utf8');
        } catch (error) {
            logger.error(`Error getting logs for container ${containerId}: ${error.message}`);
            throw error;
        }
    }

    async getContainerStats(containerId) {
        try {
            const container = this.docker.getContainer(containerId);
            const stats = await container.stats({ stream: false });
            return stats;
        } catch (error) {
            logger.error(`Error getting stats for container ${containerId}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new DockerService();

