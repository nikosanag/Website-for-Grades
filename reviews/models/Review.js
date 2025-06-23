const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    professorName: String,
    professorId: String,
    studentName: String,
    studentId: String,
    period: String,
    classSection: String,
    gradingScale: String,
    originalGrade: Number,
    reviewStatus: {
        type: String,
        enum: ['Δημιουργήθηκε αίτηση', 'Απαντήθηκε από διδάσκοντα', 'Απαντήθηκε από μαθητή', 'Ολοκληρώθηκε'],
        default: 'Δημιουργήθηκε αίτηση'
    },
    newGrade: Number,
    comments: [String]
});

module.exports = mongoose.model('Review', reviewSchema);
