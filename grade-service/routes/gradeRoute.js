const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradeController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/api/grades/upload', authenticateToken, gradesController.uploadGrades);
router.get('/api/grades/student', authenticateToken, gradesController.getGradesByStudentId);
router.get('/api/grades/course/:courseId', authenticateToken, gradesController.getGradesByCourse);
router.get('/api/grades/distribution/:courseId', gradesController.getCourseGradesDistributions);
router.get('/api/courses', gradesController.getCourses);
router.get('/api/grades/student/:courseId', authenticateToken, gradesController.getGradesForStudentInCourse);
router.get('/api/student/courses', authenticateToken, gradesController.getStudentCoursesSummary);
module.exports = router;
