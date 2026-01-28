const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    target: String,
    details: Object,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
