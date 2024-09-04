// controllers/mobileMoneyController.js//You'll need to integrate with mobile money APIs to handle deposits and withdrawals through mobile money providers.
const axios = require('axios');
const { mobileMoneyTransactionSchema } = require('../validationSchemas');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.depositViaMobileMoney = async (req, res, next) => {
  const { error } = mobileMoneyTransactionSchema.deposit.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { accountNumber, amount, mobileMoneyProvider, mobileNumber } = req.body;

  try {
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      res.status(404);
      throw new Error('Account not found');
    }

    // Mobile money deposit logic
    const response = await axios.post(`${mobileMoneyProvider}/deposit`, {
      mobileNumber,
      amount,
    });

    if (response.data.success) {
      account.balance += amount;
      await account.save();

      const transaction = await Transaction.create({
        toAccount: account._id,
        amount,
        type: 'deposit-via-mobile-money',
      });

      res.status(201).json(transaction);
    } else {
      throw new Error('Mobile money deposit failed');
    }
  } catch (err) {
    next(err);
  }
};
