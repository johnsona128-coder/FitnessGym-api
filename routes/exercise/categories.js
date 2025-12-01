const express = require('express');
const router = express.Router();
const connection = require('../../db');
const cors = require('cors');

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };

router.get('/', cors(corsOptions), function(req, res, next) {
  connection.query('SELECT * FROM categories ORDER BY category', function(err, results) {
    if (!err) {
      res.json({ success: true, data: results });
    } else {
      next(err);
    }
  });
});

router.post('/', cors(corsOptions), function(req, res, next) {
  const { category } = req.body;
  connection.query('INSERT INTO categories (category) VALUES (?)', [category], function(err, result) {
    if (!err) {
      res.status(201).json({ success: true, message: 'Force type created', data: { category } });
    } else {
      next(err);
    }
  });
});

router.delete('/:category', cors(corsOptions), function(req, res, next) {
  connection.query('DELETE FROM categories WHERE category = ?', [req.params.category], function(err, result) {
    if (!err) {
      res.json({ success: true, message: 'Category deleted' });
    } else {
      next(err);
    }
  });
});

module.exports = router;