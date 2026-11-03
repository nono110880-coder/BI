const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const rawHost = process.env.DB_HOST || '127.0.0.1';
const dbHost = rawHost === 'localhost' ? '127.0.0.1' : rawHost;
const dbPort = Number(process.env.DB_PORT) || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'form_batch_erp';

async function dropDatabase() {
  console.log(`[Drop-DB] Menghubungkan ke MySQL di ${dbHost}:${dbPort} sebagai user '${dbUser}'...`);
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });

    console.log(`[Drop-DB] Terhubung ke MySQL. Menjalankan DROP DATABASE IF EXISTS \`${dbName}\`...`);
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);

    const [dbs] = await connection.query(`SHOW DATABASES LIKE '${dbName}'`);
    if (dbs.length === 0) {
      console.log(`[Drop-DB] SUKSES: Database \`${dbName}\` beserta seluruh tabel dan strukturnya telah berhasil dihapus!`);
    } else {
      console.warn(`[Drop-DB] PERINGATAN: Database \`${dbName}\` masih terdeteksi di MySQL.`);
    }
  } catch (error) {
    console.error(`[Drop-DB] Gagal menghapus database:`, error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

dropDatabase();
