// controllers/ticketController.js
const Ticket = require('../models/Ticket');

exports.createTicket = async (req, res, next) => {
  const { userId, subject, description } = req.body;

  try {
    const ticket = await Ticket.create({ user: userId, subject, description });
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

