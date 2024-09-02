// routes/accounts.js
const express = require('express');
const { createAccount, getAccounts } = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createAccount);
router.get('/', protect, getAccounts);

module.exports = router;
