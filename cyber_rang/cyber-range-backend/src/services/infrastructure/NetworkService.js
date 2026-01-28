class NetworkService {
    async createNetwork(networkName) {
        // Mock logic
        return { id: 'mock_net_id', name: networkName };
    }

    async removeNetwork(networkId) {
        // Mock logic
    }
}

module.exports = new NetworkService();
