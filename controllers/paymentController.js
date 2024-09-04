// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res, next) => {
  const { amount, currency, source } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });

    res.status(201).json(charge);
  } catch (err) {
    next(err);
  }
};
