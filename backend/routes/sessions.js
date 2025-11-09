const express = require('express');
const router = express.Router();
const { createSession, getPatientSessions, getSession, getPatientStats } = require('../controllers/sessions');

// Authentication middleware
const { authMiddleware } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/authroles');

// Create new session (for patients)
router.post('/', authMiddleware, authorizeRoles('patient'), createSession);

// Get all sessions for a specific patient (accessible by both patient and doctor)
router.get('/patient/:patientId', authMiddleware, authorizeRoles('doctor', 'patient'), getPatientSessions);

// Get specific session details
router.get('/patient/:patientId/session/:id', authMiddleware, authorizeRoles('doctor', 'patient'), getSession);

// Get patient statistics
router.get('/patient/:patientId/stats', authMiddleware, authorizeRoles('doctor', 'patient'), getPatientStats);

module.exports = router;