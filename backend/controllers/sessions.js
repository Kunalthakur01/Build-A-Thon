const { StatusCodes } = require('http-status-codes');
const Session = require('../models/sessions');
const { BadRequestError } = require('../errors');
const mongoose = require('mongoose');

// Create a new session
const createSession = async (req, res) => {
    req.body.patientId = req.user.id; // Set from auth middleware
    const session = await Session.create(req.body);
    res.status(StatusCodes.CREATED).json({ session });
};

// Get all sessions for a patient
const getPatientSessions = async (req, res) => {
    const sessions = await Session.find({ patientId: req.params.patientId })
        .sort('-createdAt');
    res.status(StatusCodes.OK).json({ sessions, count: sessions.length });
};

// Get specific session details
const getSession = async (req, res) => {
    const session = await Session.findOne({
        _id: req.params.id,
        patientId: req.params.patientId
    });
    if (!session) {
        throw new BadRequestError('Session not found');
    }
    res.status(StatusCodes.OK).json({ session });
};

// Get session statistics for a patient
const getPatientStats = async (req, res) => {
    const stats = await Session.aggregate([
        { $match: { patientId: mongoose.Types.ObjectId(req.params.patientId) } },
        {
            $group: {
                _id: null,
                averageAccuracy: { $avg: '$overallAccuracy' },
                totalSessions: { $sum: 1 },
                // Get stats per pose
                poses: {
                    $push: {
                        poses: '$poses',
                        date: '$date'
                    }
                }
            }
        }
    ]);

    if (stats.length === 0) {
        return res.status(StatusCodes.OK).json({
            averageAccuracy: 0,
            totalSessions: 0,
            poseStats: []
        });
    }

    // Process pose statistics
    const poseStats = {};
    stats[0].poses.forEach(session => {
        session.poses.forEach(pose => {
            if (!poseStats[pose.poseName]) {
                poseStats[pose.poseName] = {
                    totalAttempts: 0,
                    averageAccuracy: 0,
                    completedCount: 0
                };
            }
            poseStats[pose.poseName].totalAttempts++;
            poseStats[pose.poseName].averageAccuracy += pose.accuracy;
            if (pose.completed) {
                poseStats[pose.poseName].completedCount++;
            }
        });
    });

    // Calculate averages
    Object.keys(poseStats).forEach(poseName => {
        poseStats[poseName].averageAccuracy /= poseStats[poseName].totalAttempts;
    });

    res.status(StatusCodes.OK).json({
        averageAccuracy: stats[0].averageAccuracy,
        totalSessions: stats[0].totalSessions,
        poseStats
    });
};

module.exports = {
    createSession,
    getPatientSessions,
    getSession,
    getPatientStats
};