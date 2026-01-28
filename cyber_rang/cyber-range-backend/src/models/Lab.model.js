const mongoose = require('mongoose');
require('./LabCategory.model'); // Register LabCategory model

const labSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabCategory',
        required: true,
    },
    dockerImage: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    flag: {
        type: String,
        required: true, // In production, this should be hashed
        select: false, // Don't return by default
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Lab', labSchema);
