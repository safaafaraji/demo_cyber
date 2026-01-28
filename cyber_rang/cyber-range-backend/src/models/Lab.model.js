const mongoose = require('mongoose');
require('./LabCategory.model'); // Register LabCategory model

const labSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabCategory',
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        required: true,
    },
    dockerImageName: {
        type: String,
        required: true,
    },
    vulnerabilityType: {
        type: String,
    },
    points: {
        type: Number,
        required: true,
    },
    flag: {
        type: String,
        required: true,
        select: false,
    },
    isVisible: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });


module.exports = mongoose.model('Lab', labSchema);
