// models/SavingsAccount.js
const mongoose = require('mongoose');

const savingsAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  interestRate: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SavingsAccount', savingsAccountSchema);
