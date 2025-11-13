const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Import routes
const indexRouter = require('./routes/index');
const testDatabaseRouter = require('./routes/test');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
app.use('/', indexRouter);
app.use('/test', testDatabaseRouter);


// 404 handler
app.use(function(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(function(err, req, res, next) {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});


module.exports = app;