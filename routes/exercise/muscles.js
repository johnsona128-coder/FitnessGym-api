const express = require('express');
const router = express.Router();
const connection = require('../../db');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// GET all muscles
router.get('/', cors(corsOptions), function(req, res, next) {
  connection.query('SELECT * FROM muscles ORDER BY muscle_name', function(err, results, fields) {
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

// GET muscle by ID
router.get('/:id', cors(corsOptions), function(req, res, next) {
  const id = req.params.id;
  
  connection.query('SELECT * FROM muscles WHERE id = ?', [id], function(err, results, fields) {
    if (!err) {
      if (results.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Muscle not found'
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

// POST create muscle
router.post('/', cors(corsOptions), function(req, res, next) {
  const { muscle_name } = req.body;
  
  connection.query(
    'INSERT INTO muscles (muscle_name) VALUES (?)',
    [muscle_name],
    function(err, result, fields) {
      if (!err) {
        res.status(201).json({
          success: true,
          message: 'Muscle created successfully',
          data: {
            id: result.insertId,
            muscle_name
          }
        });
      } else {
        next(err);
      }
    }
  );
});

// PUT update muscle
router.put('/:id', cors(corsOptions), function(req, res, next) {
  const id = req.params.id;
  const { muscle_name } = req.body;
  
  connection.query(
    'UPDATE muscles SET muscle_name = ? WHERE id = ?',
    [muscle_name, id],
    function(err, result, fields) {
      if (!err) {
        if (result.affectedRows === 0) {
          res.status(404).json({
            success: false,
            message: 'Muscle not found'
          });
        } else {
          res.json({
            success: true,
            message: 'Muscle updated successfully'
          });
        }
      } else {
        next(err);
      }
    }
  );
});

// DELETE muscle
router.delete('/:id', cors(corsOptions), function(req, res, next) {
  const id = req.params.id;
  
  connection.query('DELETE FROM muscles WHERE id = ?', [id], function(err, result, fields) {
    if (!err) {
      if (result.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: 'Muscle not found'
        });
      } else {
        res.json({
          success: true,
          message: 'Muscle deleted successfully'
        });
      }
    } else {
      next(err);
    }
  });
});

module.exports = router;