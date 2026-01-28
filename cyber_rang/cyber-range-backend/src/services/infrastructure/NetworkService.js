const Docker = require('dockerode');
const dockerConfig = require('../../config/docker.config');
const logger = require('../../utils/logger');

class NetworkService {
    constructor() {
        this.docker = new Docker({ socketPath: dockerConfig.socketPath || '/var/run/docker.sock' });
    }

    async createNetwork(networkName, subnet = '172.20.0.0/24') {
        try {
            logger.info(`Creating isolated network: ${networkName}`);
            const network = await this.docker.createNetwork({
                Name: networkName,
                Driver: 'bridge',
                IPAM: {
                    Config: [{ Subnet: subnet }]
                },
                Internal: true, // Isolated from outside
                CheckDuplicate: true
            });
            return network;
        } catch (error) {
            logger.error(`Error creating network: ${error.message}`);
            throw error;
        }
    }

    async removeNetwork(networkId) {
        try {
            const network = this.docker.getNetwork(networkId);
            await network.remove();
            logger.info(`Network ${networkId} removed`);
        } catch (error) {
            logger.error(`Error removing network: ${error.message}`);
            throw error;
        }
    }

    async connectContainer(networkId, containerId, ipAddress) {
        try {
            const network = this.docker.getNetwork(networkId);
            await network.connect({
                Container: containerId,
                EndpointConfig: {
                    IPAMConfig: {
                        IPv4Address: ipAddress
                    }
                }
            });
            logger.info(`Connected container ${containerId} to network ${networkId} with IP ${ipAddress}`);
        } catch (error) {
            logger.error(`Error connecting container to network: ${error.message}`);
            throw error;
        }
    }

    async isolateNetwork(networkId) {
        // In a bridge network with Internal: true, it's already isolated.
        // We could add extra iptables rules here if needed.
        logger.info(`Network ${networkId} is marked as isolated`);
    }
}

module.exports = new NetworkService();

