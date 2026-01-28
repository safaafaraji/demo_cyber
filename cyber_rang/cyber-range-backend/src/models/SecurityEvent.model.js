const mongoose = require('mongoose');

const securityEventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true,
    },
    description: String,
    sourceIp: String,
    metadata: Object,
}, { timestamps: true });

module.exports = mongoose.model('SecurityEvent', securityEventSchema);
