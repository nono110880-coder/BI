
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',

  // Password kosong diperbolehkan
  password: process.env.DB_PASSWORD || '',

  database: process.env.DB_NAME || 'form_batch_erp',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  charset: 'utf8mb4'
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log('============================================');
    console.log(' MYSQL DATABASE CONNECTION SUCCESSFUL');
    console.log('============================================');
    console.log(` Host     : ${process.env.DB_HOST}`);
    console.log(` Database : ${process.env.DB_NAME}`);
    console.log(` User     : ${process.env.DB_USER}`);
    console.log(' Password : Empty');

    connection.release();

    return true;

  } catch (error) {
    console.error('============================================');
    console.error(' MYSQL DATABASE CONNECTION FAILED');
    console.error('============================================');
    console.error('Error:', error.message);

    return false;
  }
};

// Export pool and connection test
module.exports = {
  pool,
  testConnection
};
