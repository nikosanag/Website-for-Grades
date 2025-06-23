const express = require('express');
const router = express.Router();
const {
    createOrUpdateReview,
    getReviewsByStudent,
    getReviewsByProfessor
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/postReview', authenticateToken, createOrUpdateReview);

// Get reviews for a student (based on token)
router.get('/viewStudentReviews', authenticateToken, getReviewsByStudent);

// Get reviews for a professor (based on token)
router.get('/viewInstructorReviews', authenticateToken, getReviewsByProfessor);

module.exports = router;

// No changes needed for ESLint errors in this file.
// ESLint errors are in your frontend TypeScript files, not in this Express route file.
