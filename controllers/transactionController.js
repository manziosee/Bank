// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { transactionSchema } = require('../validationSchemas');

// @desc    Deposit money into an account
// @route   POST /api/transactions/deposit
// @access  Private
exports.deposit = async (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { accountNumber, amount } = req.body;
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      res.status(404);
      throw new Error('Account not found');
    }

    account.balance += amount;
    await account.save();

    const transaction = await Transaction.create({
      toAccount: account._id,
      amount,
      type: 'deposit',
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

// @desc    Withdraw money from an account
// @route   POST /api/transactions/withdraw
// @access  Private
exports.withdraw = async (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { accountNumber, amount } = req.body;
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      res.status(404);
      throw new Error('Account not found');
    }

    if (account.balance < amount) {
      res.status(400);
      throw new Error('Insufficient funds');
    }

    account.balance -= amount;
    await account.save();

    const transaction = await Transaction.create({
      fromAccount: account._id,
      amount,
      type: 'withdrawal',
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

// @desc    Transfer money between accounts
// @route   POST /api/transactions/transfer
// @access  Private
exports.transfer = async (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;
    const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

    if (!fromAccount || !toAccount) {
      res.status(404);
      throw new Error('One or both accounts not found');
    }

    if (fromAccount.balance < amount) {
      res.status(400);
      throw new Error('Insufficient funds in the source account');
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    const transaction = await Transaction.create({
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      amount,
      type: 'transfer',
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const accounts = await Account.find({ user: userId });
    const accountIds = accounts.map((acc) => acc._id);

    const transactions = await Transaction.find({
      $or: [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } },
      ],
    }).populate('fromAccount toAccount');

    res.json(transactions);
  } catch (err) {
    next(err);
  }
};
