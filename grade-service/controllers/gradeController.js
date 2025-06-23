const Grade = require('../models/Grade');
const mongoose = require('mongoose');

getCourseGradesDistributions = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Match "course" ending in (3205) with optional whitespace
        const regex = new RegExp(`\\(${courseId}\\)`);
        const db = mongoose.connection;
        const records = await db.collection('grades').find({ course: { $regex: regex } }).toArray();

        if (records.length === 0) {
            return res.status(404).json({ message: 'No records found for given courseId', courseId });
        }

        // Final score distribution
        const finalScoreDistMap = new Map();
        for (let i = 0; i <= 10; i++) finalScoreDistMap.set(i, 0);

        // Dynamically get all Q keys
        const breakdownKeys = Object.keys(records[0].breakdown || {});
        const breakdownDists = {};

        breakdownKeys.forEach(q => {
            breakdownDists[q] = new Map();
            for (let i = 0; i <= 10; i++) breakdownDists[q].set(i, 0);
        });

            // Process each student's record
            records.forEach(doc => {
                const final = Math.round(doc.finalScore);
                if (final >= 0 && final <= 10) {
                    finalScoreDistMap.set(final, finalScoreDistMap.get(final) + 1);
                }

                for (const q of breakdownKeys) {
                    const val = doc.breakdown?.[q];
                    if (typeof val === 'number' && val >= 0 && val <= 10) {
                        breakdownDists[q].set(val, breakdownDists[q].get(val) + 1);
                    }
                }
            });

            // Convert maps to arrays
            const finalScoreDistribution = Array.from(finalScoreDistMap.entries());
            const questionDistributions = {};
            for (const key of breakdownKeys) {
                questionDistributions[key] = Array.from(breakdownDists[key].entries());
            }

            res.json({
                courseId,
                totalStudents: records.length,
                finalScoreDistribution,
                questionDistributions
            });
    } catch (err) {
        console.error('❌ Error generating distribution:', err);
        res.status(500).json({ message: 'Error generating distribution' });
    }
};

const getCourses = async (req, res) => {
  try {
    const db = mongoose.connection;

    const records = await db.collection('grades').find({}, {
      projection: {
        instructorId: 1,
        course: 1,
        period: 1,
        initialDate: 1,
        finalDate: 1,
        status: 1,
      }
    }).toArray();

    const grouped = new Map();

    for (const doc of records) {
      const instructorId = doc.instructorId?.trim();
      const course = doc.course?.trim();
      const period = doc.period?.trim();
      const initialDateRaw = doc.initialDate;
      const finalDateRaw = doc.finalDate;
      const status = doc.status || 'open';

      if (!course || !period || !initialDateRaw) continue;

      const initialDate = new Date(initialDateRaw).toISOString().split('T')[0];
      const finalDate = finalDateRaw ? new Date(finalDateRaw).toISOString().split('T')[0] : null;

      const key = `${course}__${period}__${initialDate}`;

      if (!grouped.has(key)) {
        const courseIdMatch = course.match(/\((\d+)\)/);
        const courseId = courseIdMatch ? courseIdMatch[1] : null;

        grouped.set(key, {
          instructorId,
          course,
          period,
          initialDate,
          finalDate,
          courseId,
          status
        });
      }
    }

    res.json(Array.from(grouped.values()));
  } catch (err) {
    console.error('❌ Error fetching courses:', err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

const uploadGrades = async (req, res) => {
    if (!req.user || req.user.role === 'Student') {
        return res.status(403).json({ error: 'Access denied' });
    }
    const instructorId = String(req.user.id);
    const { grades } = req.body;
    if (!grades || !Array.isArray(grades)) {
        return res.status(400).json({ message: "Invalid or missing grades array" });
    }

    // Validate input grades like before...
    const invalidGrades = grades.filter(g => {
        return (
            !g.studentId || !g.fullName || !g.email || !g.period ||
            !g.course || !g.scale || g.finalScore === undefined || !g.status || !g.date
        );
    });

    if (invalidGrades.length > 0) {
        invalidGrades.forEach((grade, index) => {
            const missingFields = [];
            if (!grade.studentId) missingFields.push('studentId');
            if (!grade.fullName) missingFields.push('fullName');
            if (!grade.email) missingFields.push('email');
            if (!grade.period) missingFields.push('period');
            if (!grade.course) missingFields.push('course');
            if (!grade.scale) missingFields.push('scale');
            if (grade.finalScore === undefined) missingFields.push('finalScore');
            if (!grade.status) missingFields.push('status');
            if (!grade.date) missingFields.push('date');

            console.warn(`Grade #${index} missing fields: ${missingFields.join(', ')}`, grade);
        });

        return res.status(400).json({ message: "Some grade entries are missing required fields." });
    }

    try {
        for (const grade of grades) {
            const filter = { studentId: grade.studentId, course: grade.course };
            const existing = await Grade.findOne(filter);

            if (existing) {
                if(existing.status === "closed"){continue;}
                // Update logic for existing
                let initialDate = existing.initialDate;
                let finalDate = existing.finalDate || "";

                if (grade.status === "closed") {
                    // status closed => finalDate = grade.date, keep initialDate
                    finalDate = grade.date;
                } else if (grade.status === "open") {
                    // status open => keep finalDate as is
                    // initialDate unchanged
                }

                await Grade.updateOne(filter, {
                    $set: {
                        fullName: grade.fullName,
                        email: grade.email,
                        period: grade.period,
                        scale: grade.scale,
                        finalScore: grade.finalScore,
                        breakdown: grade.breakdown || {},
                        status: grade.status,
                        date: grade.date,
                        initialDate: initialDate,
                        finalDate: finalDate
                    }
                });

            } else {
                // Insert logic for new
                let initialDate = "";
                let finalDate = "";

                if (grade.status === "closed") {
                    initialDate = grade.date;
                    finalDate = grade.date;
                } else if (grade.status === "open") {
                    initialDate = grade.date;
                    finalDate = "";
                }

                const newGrade = new Grade({
                    studentId: grade.studentId,
                    instructorId: instructorId,
                    fullName: grade.fullName,
                    email: grade.email,
                    period: grade.period,
                    course: grade.course,
                    scale: grade.scale,
                    finalScore: grade.finalScore,
                    breakdown: grade.breakdown || {},
                    status: grade.status,
                    date: grade.date,
                    initialDate: initialDate,
                    finalDate: finalDate
                });

                await newGrade.save();
            }
        }

        res.status(201).json({ message: "Grades uploaded successfully" });
    } catch (err) {
        console.error("Error uploading grades:", err);
        res.status(500).json({ message: "Failed to upload grades" });
    }
};


const getGradesByStudentId = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const studentId = req.user.id;
        const grades = await Grade.find({ studentId });
        res.json(grades);
    } catch (err) {
        console.error("Error fetching grades by student ID:", err);
        res.status(500).json({ message: "Error retrieving grades" });
    }
};



const getGradesByCourse = async (req, res) => {
    if (!req.user || req.user.role === 'Student') {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const courseId = req.params.courseId;

        // Match (courseId) anywhere in the course string
        const grades = await Grade.find({
            course: { $regex: `\\(${courseId}\\)`, $options: "i" }
        });

        res.json(grades);
    } catch (err) {
        console.error("Error fetching grades by course ID:", err);
        res.status(500).json({ message: "Error retrieving grades" });
    }
};

const getGradesForStudentInCourse = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const { courseId } = req.params;
        const studentId = String(req.user.id);

        const grades = await Grade.find({
            studentId,
            course: { $regex: `\\(${courseId}\\)`, $options: "i" }
        });

        if (grades.length === 0) {
            return res.status(404).json({ message: "No grades found for this course and student" });
        }

        res.json(grades);
    } catch (err) {
        console.error("Error fetching student grades for course:", err);
        res.status(500).json({ message: "Error retrieving grades" });
    }
};

const getStudentCoursesSummary = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
    }

    try {
        const db = mongoose.connection;
        const user = req.user;
        // Only find grades where studentId matches logged-in user
        const records = await db.collection('grades').find(
            { studentId: String(user.id) },
            {
                projection: {
                    course: 1,
                    period: 1,
                    status: 1
                }
            }
        ).toArray();

        const grouped = new Map();

        for (const doc of records) {
            const course = doc.course?.trim();
            const period = doc.period?.trim();
            const status = doc.status || 'open';

            if (!course || !period) continue;

            const key = `${course}__${period}`;

            if (!grouped.has(key)) {
                const courseIdMatch = course.match(/\((\d+)\)/);
                const courseId = courseIdMatch ? courseIdMatch[1] : null;

                grouped.set(key, {
                    course,
                    period,
                    courseId,
                    status
                });
            }
        }

        res.json(Array.from(grouped.values()));
    } catch (err) {
        console.error('❌ Error fetching courses:', err);
        res.status(500).json({ message: 'Error fetching courses' });
    }
};




module.exports = {
    uploadGrades,
    getGradesByStudentId,
    getGradesByCourse,
    getCourses,
    getCourseGradesDistributions,
    getGradesForStudentInCourse,
    getStudentCoursesSummary
};

