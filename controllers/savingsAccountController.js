// controllers/savingsAccountController.js
const SavingsAccount = require('../models/SavingsAccount');

exports.createSavingsAccount = async (req, res, next) => {
  const { userId, interestRate } = req.body;
  const accountNumber = `SAV${Date.now()}`;

  try {
    const account = await SavingsAccount.create({ user: userId, accountNumber, interestRate });
    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};
