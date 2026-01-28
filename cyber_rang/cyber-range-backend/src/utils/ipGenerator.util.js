const generateUniqueIP = () => {
    // Mock logic for IP generation
    // In a real scenario, this would check a pool of available IPs
    const r = () => Math.floor(Math.random() * 256);
    return `10.0.${r()}.${r()}`;
};

module.exports = {
    generateUniqueIP,
};
