// models/Fine.js
const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
    },
    fines: [
        {
            type: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Fine", fineSchema);
