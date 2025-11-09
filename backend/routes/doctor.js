const express = require('express');
const router = express.Router();
const { getAllPatients, getDashboardStats, getPatientStats } = require('../controllers/doctor');

// Authentication middleware
const { authMiddleware } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/authroles');

// All routes require doctor authentication
router.use(authMiddleware, authorizeRoles('doctor'));

// Get all patients
router.get('/patients', getAllPatients);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get patient statistics based on timeframe
router.get('/patient-stats', getPatientStats);

module.exports = router;