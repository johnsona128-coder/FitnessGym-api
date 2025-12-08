const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const indexRouter = require('./routes/index');
const exercisesRouter = require('./routes/exercise/exercises');
const musclesRouter = require('./routes/exercise/muscles');
const forceTypesRouter = require('./routes/exercise/forceTypes');
const levelsRouter = require('./routes/exercise/levels');
const mechanicsRouter = require('./routes/exercise/mechanics');
const equipmentRouter = require('./routes/exercise/equipment');
const categoriesRouter = require('./routes/exercise/categories');
const workoutsRouter = require('./routes/workout/workouts');
const membersRouter = require('./routes/profile/members');
const assessmentRouter = require('./routes/profile/assessments');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
app.use('/', indexRouter);
app.use('/members', membersRouter);
app.use('/exercises', exercisesRouter);
app.use('/muscles', musclesRouter);
app.use('/force-types', forceTypesRouter);
app.use('/levels', levelsRouter);
app.use('/mechanics', mechanicsRouter);
app.use('/equipment', equipmentRouter);
app.use('/categories', categoriesRouter);
app.use('/workouts', workoutsRouter);
app.use('/profile', assessmentRouter);


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