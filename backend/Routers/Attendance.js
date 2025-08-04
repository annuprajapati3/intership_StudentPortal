const express = require('express');
const router = express.Router();
const Attendance = require('../model/Attendance');
const Student = require('../model/Student');
const DailyAttendance = require('../model/Attendance');
// ✅ Get all approved students
router.get('/approved-students', async (req, res) => {
  try {
    const students = await Student.find({ approved: true });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/mark', async (req, res) => {
  try {
    const { records, date } = req.body;

    if (!records || records.length === 0 || !date) {
      return res.status(400).json({ error: 'Date and records are required' });
    }

    const existing = await DailyAttendance.findOne({ date: new Date(date) });
    if (existing) {
      return res.status(409).json({ error: 'Attendance already marked for this date' });
    }

    const entry = await DailyAttendance.create({
      date: new Date(date),
      records,
    });

    res.json({ message: 'Attendance saved as a single document', entry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// ✅ Get attendance for a specific date (optional)
router.get('/by-date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const record = await DailyAttendance.findOne({
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    }).populate('records.studentId');

    if (!record) return res.status(404).json({ message: 'No record found for this date' });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Get all attendance records
router.get('/all', async (req, res) => {
  try {
    const all = await Attendance.find().populate('records.studentId', 'name');
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
