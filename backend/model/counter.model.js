const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String, // e.g., "rollNumber-2025"
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;

