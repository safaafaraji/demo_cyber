const SessionManager = require('../services/core/SessionManager.service');
const ActiveSession = require('../models/ActiveSession.model');

const startSession = async (req, res, next) => {
    try {
        const session = await SessionManager.startSession(req.user._id, req.body.labId);
        res.status(201).json(session);
    } catch (error) {
        next(error);
    }
};

const stopSession = async (req, res, next) => {
    try {
        await SessionManager.stopSession(req.params.id);
        res.json({ message: 'Session stopped successfully' });
    } catch (error) {
        next(error);
    }
};

const getActiveSession = async (req, res, next) => {
    try {
        // Find active session for user
        const session = await ActiveSession.findOne({
            user: req.user._id,
            status: 'active'
        }).populate('lab');
        res.json(session);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startSession,
    stopSession,
    getActiveSession
};
