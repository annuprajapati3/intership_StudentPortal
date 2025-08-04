// routes/marks.js

const express = require('express');
const router = express.Router();
const StudentMarks = require('../model/mark');
const Student= require('../model/Student')
router.get('/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    console.log(rollNo)
    try {
        const student = await Student.findOne({ rollNumber: rollNo });
        const marks = await StudentMarks.findOne({ rollNo });
        console.log(student)
        if (!student || !marks) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.json({
            name: student.name,
            department: student.department,
            course: student.course,
            semester: student.semester,
            rollNo: student.rollNumber,
            marks: Object.fromEntries(marks.marks)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/add', async (req, res) => {
    try {
        const { rollNo, marks } = req.body;

        const existing = await StudentMarks.findOne({ rollNo });
        if (existing) {
            return res.status(400).json({ message: "Marks already exist for this roll number" });
        }

        const newMarks = new StudentMarks({ rollNo, marks });
        await newMarks.save();

        res.status(201).json({ message: "Marks saved", data: newMarks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
