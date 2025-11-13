const mysql = require('mysql2');
require('dotenv').config();

// Create connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to database
connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database as id', connection.threadId);
  console.log('http://localhost:' + process.env.PORT);
});


module.exports = connection;