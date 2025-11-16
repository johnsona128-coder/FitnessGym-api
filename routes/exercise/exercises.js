const express = require('express');
const router = express.Router();
const connection = require('../../db');
const cors = require('cors');
const { normalizeRows } = require("../utils/normalizeKeys");

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// GET all exercises with full details
router.get('/', cors(corsOptions), function (req, res, next) {
  const query = `
    SELECT 
      e.*,
      GROUP_CONCAT(DISTINCT pm.muscle_name) as primary_muscles,
      GROUP_CONCAT(DISTINCT sm.muscle_name) as secondary_muscles,
      ei.image_path as videoUrl
    FROM exercises e
    LEFT JOIN exercise_primary_muscles epm ON e.id = epm.exercise_id
    LEFT JOIN muscles pm ON epm.muscle_id = pm.id
    LEFT JOIN exercise_secondary_muscles esm ON e.id = esm.exercise_id
    LEFT JOIN muscles sm ON esm.muscle_id = sm.id
    LEFT JOIN exercise_images ei on e.id = ei.exercise_id
    GROUP BY e.id, ei.exercise_id, ei.image_path
  `;

  connection.query(query, function (err, results, fields) {
    if (!err) {

      if (results.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
      } else {

        const normalized = normalizeRows(results);


        res.json({
          success: true,
          data: normalized
        });
      }
    }

  });
});

// GET exercise by ID
router.get('/:id', cors(corsOptions), function (req, res, next) {
  const id = req.params.id;

  const query = `
    SELECT 
      e.*,
      GROUP_CONCAT(DISTINCT pm.muscle_name) as primary_muscles,
      GROUP_CONCAT(DISTINCT sm.muscle_name) as secondary_muscles
    FROM exercises e
    LEFT JOIN exercise_primary_muscles epm ON e.id = epm.exercise_id
    LEFT JOIN muscles pm ON epm.muscle_id = pm.id
    LEFT JOIN exercise_secondary_muscles esm ON e.id = esm.exercise_id
    LEFT JOIN muscles sm ON esm.muscle_id = sm.id
    WHERE e.id = ?
    GROUP BY e.id
  `;

  connection.query(query, [id], function (err, results, fields) {
    if (!err) {
      if (results.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
      } else {
        const normalized = normalizeRows(results);

        res.json({
          success: true,
          data: normalized
        });
      }

    } else {
      next(err);
    }
  });
});



// GET exercises by muscle (primary or secondary)
router.get('/muscle/:muscleId', cors(corsOptions), function (req, res, next) {
  const muscleId = req.params.muscleId;

  const query = `
    SELECT DISTINCT
      e.*,
      GROUP_CONCAT(DISTINCT pm.muscle_name) as primary_muscles,
      GROUP_CONCAT(DISTINCT sm.muscle_name) as secondary_muscles
    FROM exercises e
    LEFT JOIN exercise_primary_muscles epm ON e.id = epm.exercise_id
    LEFT JOIN muscles pm ON epm.muscle_id = pm.id
    LEFT JOIN exercise_secondary_muscles esm ON e.id = esm.exercise_id
    LEFT JOIN muscles sm ON esm.muscle_id = sm.id
    WHERE epm.muscle_id = ? OR esm.muscle_id = ?
    GROUP BY e.id
    ORDER BY e.exercise_name
  `;

  connection.query(query, [muscleId, muscleId], function (err, results, fields) {
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

// GET exercises by category
router.get('/category/:category', cors(corsOptions), function (req, res, next) {
  const category = req.params.category;

  const query = `
    SELECT 
      e.*,
      GROUP_CONCAT(DISTINCT pm.muscle_name) as primary_muscles,
      GROUP_CONCAT(DISTINCT sm.muscle_name) as secondary_muscles
    FROM exercises e
    LEFT JOIN exercise_primary_muscles epm ON e.id = epm.exercise_id
    LEFT JOIN muscles pm ON epm.muscle_id = pm.id
    LEFT JOIN exercise_secondary_muscles esm ON e.id = esm.exercise_id
    LEFT JOIN muscles sm ON esm.muscle_id = sm.id
    WHERE e.category = ?
    GROUP BY e.id
    ORDER BY e.exercise_name
  `;

  connection.query(query, [category], function (err, results, fields) {
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

// GET instructions for an exercise
router.get('/:id/instructions', cors(corsOptions), function (req, res, next) {
  const id = req.params.id;


  const query = `
    Select ei.* FROM exercise_instructions ei  
    Where exercise_id = ? 
    ORDER BY ei.step_number
  `;

  connection.query(query, [id], function (err, results, fields) {
    if (!err) {
      if (results.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise Instructions not found'
        });
      } else {
        const normalized = normalizeRows(results);

        res.json({
          success: true,
          data: normalized
        });
      }

    } else {
      next(err);
    }
  });
});

// GET exercises details
router.get('/equipment/:equipment', cors(corsOptions), function (req, res, next) {
  const equipment = req.params.equipment;

  const query = `
    SELECT 
      e.*,
      GROUP_CONCAT(DISTINCT pm.muscle_name) as primary_muscles,
      GROUP_CONCAT(DISTINCT sm.muscle_name) as secondary_muscles
    FROM exercises e
    LEFT JOIN exercise_primary_muscles epm ON e.id = epm.exercise_id
    LEFT JOIN muscles pm ON epm.muscle_id = pm.id
    LEFT JOIN exercise_secondary_muscles esm ON e.id = esm.exercise_id
    LEFT JOIN muscles sm ON esm.muscle_id = sm.id
    WHERE e.equipment = ?
    GROUP BY e.id
    ORDER BY e.exercise_name
  `;

  connection.query(query, [equipment], function (err, results, fields) {
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

// POST create exercise
router.post('/', cors(corsOptions), function (req, res, next) {
  const {
    exercise_name,
    force_type,
    experience_level,
    mechanic,
    equipment,
    category,
    instructions,
    primary_muscles, // array of muscle IDs
    secondary_muscles // array of muscle IDs
  } = req.body;

  const query = `
    INSERT INTO exercises 
    (exercise_name, force_type, experience_level, mechanic, equipment, category, instructions) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [exercise_name, force_type, experience_level, mechanic, equipment, category, instructions],
    function (err, result, fields) {
      if (!err) {
        const exerciseId = result.insertId;
        let completedOperations = 0;
        const totalOperations =
          (primary_muscles && primary_muscles.length > 0 ? 1 : 0) +
          (secondary_muscles && secondary_muscles.length > 0 ? 1 : 0);

        // If no muscles to add, return immediately
        if (totalOperations === 0) {
          return res.status(201).json({
            success: true,
            message: 'Exercise created successfully',
            data: {
              id: exerciseId,
              exercise_name
            }
          });
        }

        const checkComplete = () => {
          completedOperations++;
          if (completedOperations === totalOperations) {
            res.status(201).json({
              success: true,
              message: 'Exercise created successfully with muscles',
              data: {
                id: exerciseId,
                exercise_name
              }
            });
          }
        };

        // Add primary muscles if provided
        if (primary_muscles && primary_muscles.length > 0) {
          const primaryValues = primary_muscles.map(muscleId => [exerciseId, muscleId]);
          connection.query(
            'INSERT INTO exercise_primary_muscles (exercise_id, muscle_id) VALUES ?',
            [primaryValues],
            function (err2) {
              if (err2) {
                next(err2);
                return;
              }
              checkComplete();
            }
          );
        }

        // Add secondary muscles if provided
        if (secondary_muscles && secondary_muscles.length > 0) {
          const secondaryValues = secondary_muscles.map(muscleId => [exerciseId, muscleId]);
          connection.query(
            'INSERT INTO exercise_secondary_muscles (exercise_id, muscle_id) VALUES ?',
            [secondaryValues],
            function (err3) {
              if (err3) {
                next(err3);
                return;
              }
              checkComplete();
            }
          );
        }
      } else {
        next(err);
      }
    }
  );
});

// PUT update exercise
router.put('/:id', cors(corsOptions), function (req, res, next) {
  const id = req.params.id;
  const {
    exercise_name,
    force_type,
    experience_level,
    mechanic,
    equipment,
    category,
    instructions,
    primary_muscles, // array of muscle IDs
    secondary_muscles // array of muscle IDs
  } = req.body;

  // First, update the exercise details
  const updateExerciseQuery = `
    UPDATE exercises 
    SET exercise_name = ?, force_type = ?, experience_level = ?, 
        mechanic = ?, equipment = ?, category = ?, instructions = ?
    WHERE id = ?
  `;

  connection.query(
    updateExerciseQuery,
    [exercise_name, force_type, experience_level, mechanic, equipment, category, instructions, id],
    function (err, result, fields) {
      if (err) {
        next(err);
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
        return;
      }

      // Now handle muscle updates
      let completedOperations = 0;
      const totalOperations = 2; // Delete old + insert new for both primary and secondary

      const checkComplete = () => {
        completedOperations++;
        if (completedOperations === totalOperations) {
          res.json({
            success: true,
            message: 'Exercise updated successfully with muscles'
          });
        }
      };

      // Update PRIMARY muscles
      // 1. Delete existing primary muscles
      connection.query(
        'DELETE FROM exercise_primary_muscles WHERE exercise_id = ?',
        [id],
        function (err2) {
          if (err2) {
            next(err2);
            return;
          }

          // 2. Insert new primary muscles if provided
          if (primary_muscles && primary_muscles.length > 0) {
            const primaryValues = primary_muscles.map(muscleId => [id, muscleId]);
            connection.query(
              'INSERT INTO exercise_primary_muscles (exercise_id, muscle_id) VALUES ?',
              [primaryValues],
              function (err3) {
                if (err3) {
                  next(err3);
                  return;
                }
                checkComplete();
              }
            );
          } else {
            checkComplete();
          }
        }
      );

      // Update SECONDARY muscles
      // 1. Delete existing secondary muscles
      connection.query(
        'DELETE FROM exercise_secondary_muscles WHERE exercise_id = ?',
        [id],
        function (err4) {
          if (err4) {
            next(err4);
            return;
          }

          // 2. Insert new secondary muscles if provided
          if (secondary_muscles && secondary_muscles.length > 0) {
            const secondaryValues = secondary_muscles.map(muscleId => [id, muscleId]);
            connection.query(
              'INSERT INTO exercise_secondary_muscles (exercise_id, muscle_id) VALUES ?',
              [secondaryValues],
              function (err5) {
                if (err5) {
                  next(err5);
                  return;
                }
                checkComplete();
              }
            );
          } else {
            checkComplete();
          }
        }
      );
    }
  );
});

// DELETE exercise (CASCADE will handle muscle deletions if FK constraints are set)
router.delete('/:id', cors(corsOptions), function (req, res, next) {
  const id = req.params.id;

  connection.query('DELETE FROM exercises WHERE id = ?', [id], function (err, result, fields) {
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