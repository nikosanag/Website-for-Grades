const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    instructorId: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    scale: {
        type: String,
        required: true
    },
    finalScore: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],  // Updated enum values
        required: false
    },
    breakdown: {
        type: Map,
        of: Number,  // e.g., { Q01: 8, Q02: 4, ... }
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    initialDate: {
        type: Date,
        required: false
    },
    finalDate: {
        type: Date,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Optional: Hide internal Mongo fields
gradeSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Grade', gradeSchema);
