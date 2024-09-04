// validationSchemas.js
const Joi = require('joi');

// Validation schema for internal transactions
const transactionSchema = {
  deposit: Joi.object({
    accountNumber: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }),
  withdraw: Joi.object({
    accountNumber: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }),
  transfer: Joi.object({
    fromAccountNumber: Joi.string().required(),
    toAccountNumber: Joi.string().required(),
    amount: Joi.number().positive().required(),
  }),
};

// Validation schema for external transactions
const externalTransactionSchema = {
  depositFromBank: Joi.object({
    accountNumber: Joi.string().required(),
    amount: Joi.number().positive().required(),
    // You can add more fields like bank reference, transaction ID, etc.
  }),
  withdrawToBank: Joi.object({
    accountNumber: Joi.string().required(),
    amount: Joi.number().positive().required(),
    // You can add more fields like bank reference, transaction ID, etc.
  }),
};

module.exports = {
  transactionSchema,
  externalTransactionSchema,
};
