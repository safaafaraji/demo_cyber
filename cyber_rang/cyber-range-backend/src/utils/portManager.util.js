const allocatePort = async () => {
    // Mock logic for port allocation
    // In strict mode, use net library to check availability
    return Math.floor(Math.random() * (65535 - 10000) + 10000);
};

module.exports = {
    allocatePort,
};
