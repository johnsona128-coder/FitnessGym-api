const express = require('express');
const router = express.Router();
const connection = require('../../db');
const cors = require('cors');

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };

router.get('/', cors(corsOptions), function(req, res, next) {
  connection.query('SELECT * FROM equipment ORDER BY equipment', function(err, results) {
    if (!err) {
      res.json({ success: true, data: results });
    } else {
      next(err);
    }
  });
});

router.post('/', cors(corsOptions), function(req, res, next) {
  const { equipment } = req.body;
  connection.query('INSERT INTO equipment (equipment) VALUES (?)', [equipment], function(err, result) {
    if (!err) {
      res.status(201).json({ success: true, message: 'Force type created', data: { equipment } });
    } else {
      next(err);
    }
  });
});

router.delete('/:type', cors(corsOptions), function(req, res, next) {
  connection.query('DELETE FROM equipment WHERE equipment = ?', [req.params.type], function(err, result) {
    if (!err) {
      res.json({ success: true, message: 'Equipment deleted' });
    } else {
      next(err);
    }
  });
});

module.exports = router;