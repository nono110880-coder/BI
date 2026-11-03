const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'form_batch_erp',
  multipleStatements: true
};

async function setupTables() {
  console.log(`[Setup] Menghubungkan ke MySQL ${config.host}:${config.port} database '${config.database}'...`);
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[Setup] Koneksi berhasil!');

    const createBatchesSql = `
      CREATE TABLE IF NOT EXISTS \`batches\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`no_batch\` VARCHAR(50) NOT NULL UNIQUE,
        \`no_dokumen\` VARCHAR(100) NOT NULL,
        \`tgl_transaksi\` DATE NOT NULL,
        \`dari_uker\` VARCHAR(255) NOT NULL,
        \`kepada_uker\` VARCHAR(255) NOT NULL,
        \`perihal\` TEXT NOT NULL,
        \`nama_rekanan\` VARCHAR(255) NOT NULL,
        \`alamat_rekanan\` TEXT NULL,
        \`nik_npwp\` VARCHAR(50) NULL,
        \`nama_wp_rekanan\` VARCHAR(255) NULL,
        \`no_faktur_pajak\` VARCHAR(100) NULL,
        \`tgl_faktur_pajak\` DATE NULL,
        \`tipe_pembayaran\` VARCHAR(100) NOT NULL,
        \`nama_bank\` VARCHAR(100) NOT NULL,
        \`nama_rekening\` VARCHAR(255) NOT NULL,
        \`nomor_rekening\` VARCHAR(60) NOT NULL,
        \`beban_anggaran_uker\` VARCHAR(255) NOT NULL,
        \`jenis_invoice\` VARCHAR(100) NOT NULL,
        \`nama_dha\` VARCHAR(255) NOT NULL,
        \`yang_mengajukan\` VARCHAR(255) NOT NULL,
        \`pangkat_mengajukan\` VARCHAR(255) NOT NULL,
        \`yang_menyetujui\` VARCHAR(255) NOT NULL,
        \`pangkat_menyetujui\` VARCHAR(255) NOT NULL,
        \`status\` VARCHAR(50) DEFAULT 'Diajukan',
        \`catatan_audit\` TEXT NULL,
        \`created_by\` VARCHAR(100) DEFAULT 'Admin ERP',
        \`updated_by\` VARCHAR(100) DEFAULT 'Admin ERP',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`is_deleted\` TINYINT(1) DEFAULT 0,
        \`deleted_at\` TIMESTAMP NULL,
        INDEX \`idx_no_batch\` (\`no_batch\`),
        INDEX \`idx_no_dokumen\` (\`no_dokumen\`),
        INDEX \`idx_tgl_transaksi\` (\`tgl_transaksi\`),
        INDEX \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    const createInvoicesSql = `
      CREATE TABLE IF NOT EXISTS \`batch_invoices\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`batch_id\` INT NOT NULL,
        \`slot_index\` TINYINT NOT NULL COMMENT 'Slot 1 s/d 4',
        \`no_invoice\` VARCHAR(100) NULL,
        \`tgl_invoice\` DATE NULL,
        \`nominal\` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`batch_id\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    const createCoasSql = `
      CREATE TABLE IF NOT EXISTS \`batch_coas\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`batch_id\` INT NOT NULL,
        \`slot_index\` TINYINT NOT NULL COMMENT 'Slot 1 s/d 3',
        \`rangkaian_coa\` VARCHAR(255) NULL,
        \`natural_akun\` VARCHAR(255) NULL,
        \`nominal\` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`batch_id\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    console.log('[Setup] Membuat tabel batches jika belum ada...');
    await connection.query(createBatchesSql);

    console.log('[Setup] Membuat tabel batch_invoices jika belum ada...');
    await connection.query(createInvoicesSql);

    console.log('[Setup] Membuat tabel batch_coas jika belum ada...');
    await connection.query(createCoasSql);

    // Pastikan kolom natural_akun ada di batch_coas
    try {
      await connection.query(`ALTER TABLE \`batch_coas\` ADD COLUMN \`natural_akun\` VARCHAR(255) NULL AFTER \`rangkaian_coa\``);
      console.log('[Setup] Kolom natural_akun ditambahkan ke batch_coas.');
    } catch (eCol) {
      // Kolom sudah ada
    }

    // Pastikan kolom status bertipe VARCHAR(50)
    try {
      await connection.query(`ALTER TABLE \`batches\` MODIFY COLUMN \`status\` VARCHAR(50) DEFAULT 'Diajukan'`);
      console.log('[Setup] Kolom status disesuaikan menjadi VARCHAR(50).');
    } catch (eStatus) {
      // Abaikan
    }

    const [tables] = await connection.query('SHOW TABLES');
    console.log('[Setup] Tabel yang aktif sekarang di database:', tables.map(t => Object.values(t)[0]));

    const [countBatches] = await connection.query('SELECT COUNT(*) AS total FROM batches');
    console.log('[Setup] SUKSES! Jumlah baris saat ini di tabel batches:', countBatches[0].total);

  } catch (error) {
    console.error('[Setup Error]:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupTables();
