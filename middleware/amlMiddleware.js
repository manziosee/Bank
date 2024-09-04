// middleware/amlMiddleware.js//Anti-Money Laundering//Implement checks to flag suspicious transactions based on predefined rules (e.g., large amounts, rapid transactions).
const Transaction = require('../models/Transaction');

exports.amlCheck = async (req, res, next) => {
  const { amount } = req.body;

  if (amount > 10000) { // Example threshold
    const suspiciousTransaction = await Transaction.create({
      ...req.body,
      flagged: true,
    });

    return res.status(403).json({ message: 'Transaction flagged for AML review', transaction: suspiciousTransaction });
  }

  next();
};
