// routes/transactions.js
const express = require('express');
const { 
  deposit, 
  withdraw, 
  transfer, 
  getTransactions, 
  depositFromBank, 
  withdrawToBank 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.post('/deposit-from-bank', protect, depositFromBank);
router.post('/withdraw-to-bank', protect, withdrawToBank);
router.get('/', protect, getTransactions);

module.exports = router;
