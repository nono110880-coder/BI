const { pool } = require('../config/database');

async function run() {
  console.log('Membuat tabel batches jika belum ada...');
  const sql1 = `
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
      \`status\` ENUM('Draft', 'Diajukan', 'Disetujui', 'Cair', 'Ditolak') DEFAULT 'Diajukan',
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

  const sql2 = `
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

  const sql3 = `
    CREATE TABLE IF NOT EXISTS \`batch_coas\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`batch_id\` INT NOT NULL,
      \`slot_index\` TINYINT NOT NULL COMMENT 'Slot 1 s/d 3',
      \`rangkaian_coa\` VARCHAR(255) NULL,
      \`nominal\` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (\`batch_id\`) REFERENCES \`batches\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await pool.query(sql1);
  await pool.query(sql2);
  await pool.query(sql3);
  console.log('Tabel batches, batch_invoices, batch_coas siap digunakan!');
  await pool.end();
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
