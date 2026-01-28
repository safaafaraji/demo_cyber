const AuditLog = require('../models/AuditLog.model');

const logAction = async (actorId, action, target, details = {}) => {
    try {
        await AuditLog.create({
            actor: actorId,
            action,
            target,
            details
        });
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

const getUserHistory = async (req, res, next) => {
    try {
        const history = await AuditLog.find({ actor: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(history);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    logAction,
    getUserHistory
};
