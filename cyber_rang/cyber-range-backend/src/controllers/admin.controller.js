const User = require('../models/User.model');
const Lab = require('../models/Lab.model');
const ActiveSession = require('../models/ActiveSession.model');
const SessionManager = require('../services/core/SessionManager.service');

const adminController = {
    getDashboardStats: async (req, res, next) => {
        try {
            const usersCount = await User.countDocuments();
            const labsCount = await Lab.countDocuments();
            const activeSessionsCount = await ActiveSession.countDocuments({ status: 'active' });

            res.json({
                users: usersCount,
                labs: labsCount,
                activeSessions: activeSessionsCount,
                systemHealth: 'Good'
            });
        } catch (error) {
            next(error);
        }
    },

    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            next(error);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: 'User deleted' });
        } catch (error) {
            next(error);
        }
    },

    getAllSessions: async (req, res, next) => {
        try {
            const sessions = await ActiveSession.find({ status: 'active' })
                .populate('user', 'username email')
                .populate('lab', 'name');
            res.json(sessions);
        } catch (error) {
            next(error);
        }
    },

    emergencyStopAll: async (req, res, next) => {
        try {
            const result = await SessionManager.stopAllSessions();
            res.json({ message: 'Emergency stop executed', result });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = adminController;
