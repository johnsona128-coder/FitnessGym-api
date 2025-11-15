const express = require('express');
const router = express.Router();
const connection = require('../../db');
const cors = require('cors');

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };

router.get('/', cors(corsOptions), function(req, res, next) {
  connection.query('SELECT * FROM mechanics ORDER BY mechanic', function(err, results) {
    if (!err) {
      res.json({ success: true, data: results });
    } else {
      next(err);
    }
  });
});

router.post('/', cors(corsOptions), function(req, res, next) {
  const { mechanic } = req.body;
  connection.query('INSERT INTO mechanics (mechanic) VALUES (?)', [mechanic], function(err, result) {
    if (!err) {
      res.status(201).json({ success: true, message: 'Mechanic created', data: { mechanic } });
    } else {
      next(err);
    }
  });
});

router.delete('/:mechanic', cors(corsOptions), function(req, res, next) {
  connection.query('DELETE FROM mechanics WHERE mechanic = ?', [req.params.mechanic], function(err, result) {
    if (!err) {
      res.json({ success: true, message: 'Mechanic deleted' });
    } else {
      next(err);
    }
  });
});

module.exports = router;