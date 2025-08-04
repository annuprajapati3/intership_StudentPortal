// models/StudentMarks.js

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    sub1: String,
    sub2: String,
    sub3: String,
    sub4: String,
    sub5: String
}, { _id: false });

const studentMarksSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },

    marks: {
        type: Map,
        of: subjectSchema,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('StudentMarks', studentMarksSchema);
