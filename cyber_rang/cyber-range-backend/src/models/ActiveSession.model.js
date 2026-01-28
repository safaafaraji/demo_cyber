const mongoose = require('mongoose');
const { SESSION_STATUS } = require('../utils/constants');

const activeSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab',
        required: true,
    },
    containerId: {
        type: String,
        required: true,
    },
    portMapping: {
        type: Object, // e.g. { 80: 30001 }
    },
    status: {
        type: String,
        enum: Object.values(SESSION_STATUS),
        default: SESSION_STATUS.ACTIVE,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('ActiveSession', activeSessionSchema);
