// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Corrected path to db.js
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// CORS Middleware
const cors = require('cors');
app.use(cors());

// Request Logging Middleware
const morgan = require('morgan');
app.use(morgan('dev'));

// Route handlers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/transactions', require('./routes/transactions'));

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
