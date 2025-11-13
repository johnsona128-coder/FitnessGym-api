const express = require('express');
const router = express.Router();
const connection = require('../db');
const cors = require('cors');

// CORS options
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// GET all exercises
router.get('/', cors(corsOptions), function(req, res, next) {
  const query = `
    SELECT 
      e.*,
      mg.MuscleGroupName,
      eg.GroupName as ExerciseGroupName
    FROM Exercise e
    LEFT JOIN MuscleGroups mg ON e.MuscleGroupID = mg.MuscleGroupID
    LEFT JOIN ExerciseGroups eg ON e.ExerciseGroupID = eg.ExerciseGroupID
    ORDER BY e.ExerciseName
  `;
  
  connection.query(query, function(err, results, fields) {
    if (!err) {
      res.json({
        success: true,
        data: results
      });
    } else {
      next(err);
    }
  });
});

// GET exercise by ID
router.get('/:id', cors(corsOptions), function(req, res, next) {
  const exerciseId = req.params.id;
  
  const query = `
    SELECT 
      e.*,
      mg.MuscleGroupName,
      eg.GroupName as ExerciseGroupName
    FROM Exercise e
    LEFT JOIN MuscleGroups mg ON e.MuscleGroupID = mg.MuscleGroupID
    LEFT JOIN ExerciseGroups eg ON e.ExerciseGroupID = eg.ExerciseGroupID
    WHERE e.ExerciseID = ?
  `;
  
  connection.query(query, [exerciseId], function(err, results, fields) {
    if (!err) {
      if (results.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
      } else {
        res.json({
          success: true,
          data: results[0]
        });
      }
    } else {
      next(err);
    }
  });
});

// GET exercises by muscle group
router.get('/muscle/:muscleGroupId', cors(corsOptions), function(req, res, next) {
  const muscleGroupId = req.params.muscleGroupId;
  
  const query = `
    SELECT 
      e.*,
      mg.MuscleGroupName,
      eg.GroupName as ExerciseGroupName
    FROM Exercise e
    LEFT JOIN MuscleGroups mg ON e.MuscleGroupID = mg.MuscleGroupID
    LEFT JOIN ExerciseGroups eg ON e.ExerciseGroupID = eg.ExerciseGroupID
    WHERE e.MuscleGroupID = ?
    ORDER BY e.ExerciseName
  `;
  
  connection.query(query, [muscleGroupId], function(err, results, fields) {
    if (!err) {
      res.json({
        success: true,
        data: results
      });
    } else {
      next(err);
    }
  });
});

// GET exercise steps
router.get('/:id/steps', cors(corsOptions), function(req, res, next) {
  const exerciseId = req.params.id;
  
  const query = `
    SELECT * FROM ExerciseSteps 
    WHERE ExerciseID = ? 
    ORDER BY OrderNumber
  `;
  
  connection.query(query, [exerciseId], function(err, results, fields) {
    if (!err) {
      res.json({
        success: true,
        data: results
      });
    } else {
      next(err);
    }
  });
});

// POST create new exercise
router.post('/', cors(corsOptions), function(req, res, next) {
  const { ExerciseName, Description, CaloriesBurned, MuscleGroupID, ExerciseGroupID, SafetyTips } = req.body;
  
  const query = `
    INSERT INTO Exercise 
    (ExerciseName, Description, CaloriesBurned, MuscleGroupID, ExerciseGroupID, SafetyTips) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  connection.query(
    query, 
    [ExerciseName, Description, CaloriesBurned, MuscleGroupID, ExerciseGroupID, SafetyTips],
    function(err, result, fields) {
      if (!err) {
        res.status(201).json({
          success: true,
          message: 'Exercise created successfully',
          data: {
            ExerciseID: result.insertId,
            ExerciseName
          }
        });
      } else {
        next(err);
      }
    }
  );
});

// PUT update exercise
router.put('/:id', cors(corsOptions), function(req, res, next) {
  const exerciseId = req.params.id;
  const { ExerciseName, Description, CaloriesBurned, MuscleGroupID, ExerciseGroupID, SafetyTips } = req.body;
  
  const query = `
    UPDATE Exercise 
    SET ExerciseName = ?, Description = ?, CaloriesBurned = ?, 
        MuscleGroupID = ?, ExerciseGroupID = ?, SafetyTips = ?
    WHERE ExerciseID = ?
  `;
  
  connection.query(
    query,
    [ExerciseName, Description, CaloriesBurned, MuscleGroupID, ExerciseGroupID, SafetyTips, exerciseId],
    function(err, result, fields) {
      if (!err) {
        if (result.affectedRows === 0) {
          res.status(404).json({
            success: false,
            message: 'Exercise not found'
          });
        } else {
          res.json({
            success: true,
            message: 'Exercise updated successfully'
          });
        }
      } else {
        next(err);
      }
    }
  );
});

// DELETE exercise
router.delete('/:id', cors(corsOptions), function(req, res, next) {
  const exerciseId = req.params.id;
  
  connection.query('DELETE FROM Exercise WHERE ExerciseID = ?', [exerciseId], function(err, result, fields) {
    if (!err) {
      if (result.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
      } else {
        res.json({
          success: true,
          message: 'Exercise deleted successfully'
        });
      }
    } else {
      next(err);
    }
  });
});

module.exports = router;