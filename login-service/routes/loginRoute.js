// routes/loginRoute.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/test/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, user ${req.user.id}!`, role: req.user.role });
});

// POST /login route
router.post('/api/login', loginController.login);

module.exports = router;
