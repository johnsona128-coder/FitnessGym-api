const express = require('express');
const router = express.Router();
const connection = require('../../db');
const cors = require('cors');

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };

router.get('/', cors(corsOptions), function(req, res, next) {
  connection.query('SELECT * FROM force_types ORDER BY force_type', function(err, results) {
    if (!err) {
      res.json({ success: true, data: results });
    } else {
      next(err);
    }
  });
});

router.post('/', cors(corsOptions), function(req, res, next) {
  const { force_type } = req.body;
  connection.query('INSERT INTO force_types (force_type) VALUES (?)', [force_type], function(err, result) {
    if (!err) {
      res.status(201).json({ success: true, message: 'Force type created', data: { force_type } });
    } else {
      next(err);
    }
  });
});

router.delete('/:type', cors(corsOptions), function(req, res, next) {
  connection.query('DELETE FROM force_types WHERE force_type = ?', [req.params.type], function(err, result) {
    if (!err) {
      res.json({ success: true, message: 'Force type deleted' });
    } else {
      next(err);
    }
  });
});

module.exports = router;