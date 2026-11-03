const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Gunakan 127.0.0.1 secara default untuk mencegah masalah resolusi IPv6 ::1 pada MariaDB/MySQL Windows
const rawHost = process.env.DB_HOST || '127.0.0.1';
const normalizedHost = rawHost === 'localhost' ? '127.0.0.1' : rawHost;

const DB_CONFIG = {
  host: normalizedHost,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'form_batch_erp'
};

// Connection Pool untuk Express REST API
const pool = mysql.createPool({
  ...DB_CONFIG,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});

// Helper pengujian koneksi dan auto-seed database saat server start
async function testConnection() {
  const dbName = DB_CONFIG.database;
  try {
    // 1. Periksa apakah server MySQL / MariaDB dapat dihubungi
    const serverConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      multipleStatements: true
    });

    const [dbs] = await serverConn.query(`SHOW DATABASES LIKE '${dbName}'`);

    // Jika database belum ada, buat otomatis dan jalankan schema.sql
    if (dbs.length === 0) {
      console.log(`[Database Notice] Database '${dbName}' belum ada di MySQL. Menginisialisasi otomatis...`);
      const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const sql = fs.readFileSync(schemaPath, 'utf8');
        await serverConn.query(sql);
        console.log(`[Database Sukses] Database '${dbName}' dan tabel-tabelnya berhasil di-setup otomatis!`);
      }
    } else {
      // Jika database sudah ada, periksa apakah tabel batches kosong
      try {
        await serverConn.query(`USE \`${dbName}\``);
        const [tables] = await serverConn.query(`SHOW TABLES LIKE 'batches'`);
        if (tables.length === 0) {
          console.log(`[Database Notice] Tabel 'batches' belum ada. Menjalankan schema.sql...`);
          const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
          if (fs.existsSync(schemaPath)) {
            const sql = fs.readFileSync(schemaPath, 'utf8');
            await serverConn.query(sql);
            console.log(`[Database Sukses] Skema database berhasil di-update!`);
          }
        }
      } catch (errCheck) {
        console.warn('[Database Notice] Gagal verifikasi tabel batches:', errCheck.message);
      }
    }

    await serverConn.end();

    // 2. Hubungkan ke database form_batch_erp melalui pool
    const connection = await pool.getConnection();
    console.log(`[Database] Koneksi ke database '${dbName}' di ${DB_CONFIG.host}:${DB_CONFIG.port} BERHASIL!`);

    // Auto-fix: Lepaskan nomor batch pada data yang dihapus (soft-delete) agar tidak menabrak UNIQUE key MySQL
    try {
      await connection.query("UPDATE batches SET no_batch = CONCAT(no_batch, '_DEL_', id) WHERE is_deleted = 1 AND no_batch NOT LIKE '%_DEL_%'");
    } catch (eFixDel) {}

    connection.release();
    return true;
  } catch (error) {
    console.error('[Database Error] Koneksi gagal:', error.message);
    if (error.message.includes('not allowed to connect')) {
      console.warn(`[Solusi Host MariaDB] MariaDB menolak host '${DB_CONFIG.host}'.`);
      console.warn(`[Solusi] Pastikan di backend/.env tertulis 'DB_HOST=127.0.0.1'.`);
      console.warn(`[Solusi Alternatif] Jika masih ditolak, buka XAMPP Shell lalu jalankan:`);
      console.warn(`  mysql -u root`);
      console.warn(`  GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;`);
      console.warn(`  FLUSH PRIVILEGES;`);
    } else {
      console.warn(`[Panduan] Pastikan MySQL/XAMPP sudah aktif di port ${DB_CONFIG.port} dan password di backend/.env sesuai.`);
    }
    return false;
  }
}

module.exports = {
  pool,
  koneksi: pool,
  testConnection
};