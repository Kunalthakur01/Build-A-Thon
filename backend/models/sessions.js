const mongoose = require('mongoose');

// Schema for tracking pose performance in a session
const PosePerformanceSchema = new mongoose.Schema({
    poseName: {
        type: String,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// Schema for tracking yoga sessions
const SessionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    poses: [PosePerformanceSchema],
    overallAccuracy: {
        type: Number,
        required: true
    },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);