// routes/logoutRoute.js
const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /logout route
router.post('/api/logout', authenticateToken, logoutController.logout);

module.exports = router;
