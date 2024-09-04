// controllers/reportController.js
const Transaction = require('../models/Transaction');

exports.getTransactionReport = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
    const transactions = await Transaction.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate('fromAccount toAccount');

    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};
