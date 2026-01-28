const sanitize = (req, res, next) => {
    // Simple mock sanitize logic
    // Real logic would use xss-clean or mongo-sanitize
    if (req.body) {
        // iterate and clean
    }
    next();
};

module.exports = sanitize;
