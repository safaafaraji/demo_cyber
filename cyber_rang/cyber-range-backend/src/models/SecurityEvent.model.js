const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActiveSession',
        required: true,
    },
    eventType: {
        type: String,
        enum: ['bruteforce', 'sqli', 'xss', 'scan', 'SESSION_START', 'SESSION_STOP'],
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true,
    },
    sourceIP: String,
    targetIP: String,
    details: Object,
    blocked: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });


module.exports = mongoose.model('SecurityEvent', securityEventSchema);
