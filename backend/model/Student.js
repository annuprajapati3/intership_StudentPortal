const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: {
  type: String,
  unique: true,
  sparse: true,
},

  name: { type: String, required: true },
  department: { type: String, required: true },
  course: {
    type: String,
    enum: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'PhD'],
    required: true,
  },
  semester: { type: Number, required: true },
  email: { type: String },
  phone: { type: String },
  dob: { type: Date, required: true },
  address: { type: String },
  hostelRequested: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  tenthMarksheet: {
  type: String,
  required: true,
},
twelfthMarksheet: {
  type: String,
  required: true,
},
photo: {
  type: String,
  required: true,
},

}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
