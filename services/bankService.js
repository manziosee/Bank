// services/bankService.js
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BANK_API_URL = process.env.BANK_API_URL; // e.g., 'https://api.externalbank.com'
const BANK_API_KEY = process.env.BANK_API_KEY; // Your bank API key or credentials

/**
 * Transfer funds to an external bank
 * @param {string} accountNumber - The microfinance account number
 * @param {number} amount - The amount to transfer
 * @returns {Object} - Response from the bank API
 */
const transferToBank = async (accountNumber, amount) => {
  try {
    const response = await axios.post(
      `${BANK_API_URL}/transfer`,
      {
        accountNumber,
        amount,
        currency: 'USD', // or your relevant currency
      },
      {
        headers: {
          'Authorization': `Bearer ${BANK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // Expecting { success: true } or similar
  } catch (error) {
    console.error('Error transferring to bank:', error.response ? error.response.data : error.message);
    return { success: false };
  }
};

/**
 * Receive funds from an external bank
 * @param {string} accountNumber - The microfinance account number
 * @param {number} amount - The amount to receive
 * @returns {Object} - Response from the bank API
 */
const receiveFromBank = async (accountNumber, amount) => {
  try {
    const response = await axios.post(
      `${BANK_API_URL}/receive`,
      {
        accountNumber,
        amount,
        currency: 'USD', // or your relevant currency
      },
      {
        headers: {
          'Authorization': `Bearer ${BANK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // Expecting { success: true } or similar
  } catch (error) {
    console.error('Error receiving from bank:', error.response ? error.response.data : error.message);
    return { success: false };
  }
};

module.exports = {
  transferToBank,
  receiveFromBank,
};
