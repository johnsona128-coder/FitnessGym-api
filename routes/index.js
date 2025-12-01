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
      exercises: '/exercises',
      instructions: '/exercises',
      muscles: '/muscles',
      forceTypes: '/force-types',
      levels: '/levels',
      mechanics: '/mechanics',
      equipment: '/equipment',
      categories: '/categories',
      workouts:  '/workouts'
    }
  });
});

module.exports = router;