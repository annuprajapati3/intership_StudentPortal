const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  rollNumber :{
    type:String,
    required:true,
    unique: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
