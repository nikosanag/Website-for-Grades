const Review = require('../models/Review');

const createOrUpdateReview = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const {
            professorName,
            professorId,
            studentName,
            studentId,
            period,
            classSection,
            gradingScale,
            originalGrade,
            newGrade,
            reviewStatus,
            comment
        } = req.body;

        // 🛑 Validate all required fields
        const missingFields = [];
        if (!professorName) missingFields.push('professorName');
        if (!professorId) missingFields.push('professorId');
        if (!studentName) missingFields.push('studentName');
        if (!studentId) missingFields.push('studentId');
        if (!period) missingFields.push('period');
        if (!classSection) missingFields.push('classSection');
        if (!gradingScale) missingFields.push('gradingScale');
        if (originalGrade === undefined) missingFields.push('originalGrade');
        if (newGrade === undefined) missingFields.push('newGrade');
        if (!reviewStatus) missingFields.push('reviewStatus');
        if (!comment) missingFields.push('comment');

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missing: missingFields
            });
        }

        // ⬇️ Add role tag to the comment
        const roleTaggedComment = `${user.role === 'Instructor' ? '[Instructor]' : '[Student]'} ${comment}`;

        // 🔍 Check for existing review by student + class
        let review = await Review.findOne({ studentId, classSection });

        if (review) {
            // 🔄 Update existing review
            review.professorName = professorName;
            review.professorId = professorId;
            review.studentName = studentName;
            review.period = period;
            review.gradingScale = gradingScale;
            review.originalGrade = originalGrade;
            review.newGrade = newGrade;
            review.reviewStatus = reviewStatus;
            review.comments.push(roleTaggedComment);

            await review.save();
            return res.status(200).json({ message: 'Review updated', review });
        } else {
            // ➕ Create new review
            const newReview = new Review({
                professorName,
                professorId,
                studentName,
                studentId,
                period,
                classSection,
                gradingScale,
                originalGrade,
                newGrade,
                reviewStatus,
                comments: [roleTaggedComment]
            });

            await newReview.save();
            return res.status(201).json({ message: 'Review created', review: newReview });
        }

    } catch (err) {
        console.error('❌ Error in createReview:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getReviewsByStudent = async (req, res) => {
    try {
        const user = req.user;

        // Ensure user is authenticated
        if (!user) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Only allow students to access this endpoint
        if (user.role !== 'Student') {
            return res.status(403).json({ error: 'Only students can access their reviews' });
        }

        const studentId = user.id;

        // Find all reviews associated with this student ID
        const reviews = await Review.find({ studentId });

        return res.status(200).json({ reviews });

    } catch (err) {
        console.error('❌ Error in getReviewsByStudent:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getReviewsByProfessor = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Only instructors can access this endpoint
        if (user.role !== 'Instructor') {
            return res.status(403).json({ error: 'Only instructors can access their reviews' });
        }

        const professorId = user.id;

        const reviews = await Review.find({ professorId });

        return res.status(200).json({ reviews });

    } catch (err) {
        console.error('❌ Error in getReviewsByProfessor:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createOrUpdateReview,
    getReviewsByStudent,
    getReviewsByProfessor
};

