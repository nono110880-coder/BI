const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const rawHost = process.env.DB_HOST || '127.0.0.1';
const dbHost = rawHost === 'localhost' ? '127.0.0.1' : rawHost;
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'form_batch_erp';

async function initDatabase() {
  console.log(`[Init-DB] Menghubungkan ke MySQL di ${dbHost}:${dbPort} sebagai user '${dbUser}'...`);
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      multipleStatements: true
    });

    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`File schema.sql tidak ditemukan di ${schemaPath}`);
    }

    console.log(`[Init-DB] Membaca file schema.sql...`);
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log(`[Init-DB] Mengeksekusi pembuatan database & struktur tabel...`);
    await connection.query(sql);

    console.log(`[Init-DB] SUKSES: Database \`${dbName}\` dan tabel-tabelnya berhasil dipasang kembali!`);
  } catch (error) {
    console.error(`[Init-DB] Gagal menginisialisasi database:`, error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
