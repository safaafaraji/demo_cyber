const mongoose = require('mongoose');
const { ROLES } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(ROLES),
        default: ROLES.STUDENT,
    },
    lastLogin: {
        type: Date,
    },
    stats: {
        labsCompleted: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
    },

    completedLabs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lab'
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        select: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    githubProfile: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
