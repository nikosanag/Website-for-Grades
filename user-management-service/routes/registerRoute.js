const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Register user with manual ID
router.post('/api/register', authenticateToken, registerController.register);

// Register user with random ID
router.post('/api/register/random', authenticateToken, registerController.registerWithRandomId);

// Update existing user's password
router.post('/api/register/update-password', authenticateToken, registerController.updateUserPassword);

module.exports = router;
