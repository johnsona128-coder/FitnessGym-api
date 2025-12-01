const express = require('express');
const router = express.Router();
const connection = require('../../db');
const cors = require('cors');

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };

router.get('/', cors(corsOptions), function(req, res, next) {
  connection.query('SELECT * FROM levels ORDER BY experience_level', function(err, results) {
    if (!err) {
      res.json({ success: true, data: results });
    } else {
      next(err);
    }
  });
});

router.post('/', cors(corsOptions), function(req, res, next) {
  const { experience_level } = req.body;
  connection.query('INSERT INTO levels (experience_level) VALUES (?)', [experience_level], function(err, result) {
    if (!err) {
      res.status(201).json({ success: true, message: 'Experience level created', data: { experience_level } });
    } else {
      next(err);
    }
  });
});

router.delete('/:level', cors(corsOptions), function(req, res, next) {
  connection.query('DELETE FROM levels WHERE experience_level = ?', [req.params.level], function(err, result) {
    if (!err) {
      res.json({ success: true, message: 'Experience level deleted' });
    } else {
      next(err);
    }
  });
});

module.exports = router;