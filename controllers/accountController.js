// controllers/accountController.js
const Account = require('../models/Account');
const { accountSchema } = require('../validationSchemas');

// @desc    Create a new account
// @route   POST /api/accounts
// @access  Private
exports.createAccount = async (req, res, next) => {
  const { error } = accountSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const userId = req.user.id;
    const accountNumber = `ACC${Date.now()}`;

    const account = await Account.create({ user: userId, accountNumber });

    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all accounts for a user
// @route   GET /api/accounts
// @access  Private
exports.getAccounts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const accounts = await Account.find({ user: userId });

    res.json(accounts);
  } catch (err) {
    next(err);
  }
};
