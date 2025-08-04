const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: String,
  phone: String,
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  address: String,
  hostelRequested: { type: Boolean, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rollNumber: { type: String },
  assignedHostel: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
