// backend/db.js
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false // REQUIRED for Aiven
  },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

// Optional: test connection once
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected (Aiven)");
    connection.release();
  }
});

// ✅ EXPORT PROMISE WRAPPER
module.exports = pool.promise();
