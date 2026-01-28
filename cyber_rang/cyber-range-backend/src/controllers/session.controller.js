const SessionManager = require('../services/core/SessionManager.service');
const ActiveSession = require('../models/ActiveSession.model');
const DockerService = require('../services/infrastructure/DockerService');
const { SESSION_STATUS } = require('../utils/constants');

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
        await SessionManager.stopSession(req.params.id, SESSION_STATUS.TERMINATED);
        res.json({ message: 'Session stopped successfully' });
    } catch (error) {
        next(error);
    }
};

const pauseSession = async (req, res, next) => {
    try {
        await SessionManager.pauseSession(req.params.id);
        res.json({ message: 'Session paused' });
    } catch (error) {
        next(error);
    }
};

const resumeSession = async (req, res, next) => {
    try {
        await SessionManager.resumeSession(req.params.id);
        res.json({ message: 'Session resumed' });
    } catch (error) {
        next(error);
    }
};

const getLogs = async (req, res, next) => {
    try {
        const session = await ActiveSession.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        const logs = await DockerService.getContainerLogs(session.containerId);
        res.json({ logs });
    } catch (error) {
        next(error);
    }
};

const emergencyStop = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can perform emergency stop' });
        }
        const results = await SessionManager.stopAllSessions();
        res.json(results);
    } catch (error) {
        next(error);
    }
};

const getActiveSession = async (req, res, next) => {
    try {
        // Find active session for user (Running, Initializing, or Paused)
        const session = await ActiveSession.findOne({
            user: req.user._id,
            status: { $in: [SESSION_STATUS.RUNNING, SESSION_STATUS.INITIALIZING, SESSION_STATUS.PAUSED] }
        }).populate('lab');
        res.json(session);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    startSession,
    stopSession,
    pauseSession,
    resumeSession,
    getLogs,
    emergencyStop,
    getActiveSession
};

