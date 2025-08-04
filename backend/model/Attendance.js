const mongoose = require('mongoose');

const StudentAttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  rollNumber: String,
  status: String, // Present / Absent
});

const DailyAttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  markedAt: { type: Date, default: Date.now },
  records: [StudentAttendanceSchema]
});

module.exports = mongoose.model('DailyAttendance', DailyAttendanceSchema);
