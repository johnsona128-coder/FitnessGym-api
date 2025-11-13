const express = require('express');
const router = express.Router();
const connection = require('../db');
const cors = require('cors');

// CORS options
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

// GET Datatbase Version --  This is just a test endpoint to verify DB connection
router.get('/', cors(corsOptions), function(req, res, next) {
  const query = `
    SELECT VERSION();
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

module.exports = router;