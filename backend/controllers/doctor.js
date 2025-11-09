const { StatusCodes } = require('http-status-codes');
const User = require('../models/users');
const Session = require('../models/sessions');
const { BadRequestError } = require('../errors');
const mongoose = require('mongoose');

// Get all patients for a doctor
const getAllPatients = async (req, res) => {
    const patients = await User.find({ role: 'patient' })
        .select('-password');
    res.status(StatusCodes.OK).json({ patients, count: patients.length });
};

// Get overall statistics
const getDashboardStats = async (req, res) => {
    // Get total patients
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // Get total sessions and average accuracy
    const sessionStats = await Session.aggregate([
        {
            $group: {
                _id: null,
                totalSessions: { $sum: 1 },
                averageAccuracy: { $avg: '$overallAccuracy' }
            }
        }
    ]);

    // Get today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionsToday = await Session.countDocuments({
        createdAt: { $gte: today }
    });

    res.status(StatusCodes.OK).json({
        totalPatients,
        totalSessions: sessionStats[0]?.totalSessions || 0,
        averageAccuracy: sessionStats[0]?.averageAccuracy || 0,
        sessionsToday
    });
};

// Get patient statistics for timeframe
const getPatientStats = async (req, res) => {
    const { timeframe } = req.query;
    let dateFilter = {};
    const now = new Date();

    switch(timeframe) {
        case 'week':
            dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
            break;
        case 'month':
            dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
            break;
        case 'year':
            dateFilter = { createdAt: { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) } };
            break;
        default:
            dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    }

    const patientStats = await Session.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: '$patientId',
                completedSessions: { $sum: 1 },
                averageAccuracy: { $avg: '$overallAccuracy' },
                lastActive: { $max: '$createdAt' }
            }
        }
    ]);

    res.status(StatusCodes.OK).json({ patientStats });
};

module.exports = {
    getAllPatients,
    getDashboardStats,
    getPatientStats
};