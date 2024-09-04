// controllers/loanController.js
const Loan = require('../models/Loan');

exports.applyForLoan = async (req, res, next) => {
  const { userId, amount, interestRate, duration } = req.body;
  const loanNumber = `LOAN${Date.now()}`;

  try {
    const loan = await Loan.create({ user: userId, loanNumber, amount, interestRate, duration });
    res.status(201).json(loan);
  } catch (err) {
    next(err);
  }
};
