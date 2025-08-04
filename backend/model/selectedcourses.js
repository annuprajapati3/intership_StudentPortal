const mongoose = require("mongoose");

const studentSelectionSchema = new mongoose.Schema({
    rollNo : String,
  marks: Number,
  course: String,
  subjects: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("StudentSelection", studentSelectionSchema);
