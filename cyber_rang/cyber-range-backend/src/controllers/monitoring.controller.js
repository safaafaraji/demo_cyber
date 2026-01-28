const getHealth = (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
};

module.exports = {
    getHealth,
};
