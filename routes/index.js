const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', function(req, res, next) {
  res.json({
    success: true,
    message: 'Health Habits Gym API',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
router.get('/', function(req, res, next) {
  res.json({
    success: true,
    message: 'Health Habits Gym API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
    }
  });
});

module.exports = router;