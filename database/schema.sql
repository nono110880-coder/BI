SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `form_batch_erp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `form_batch_erp`;

DROP TABLE IF EXISTS `master_uker`;
CREATE TABLE `master_uker` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_uker` VARCHAR(30) NOT NULL UNIQUE,
  `nama_uker` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `master_rekanan`;
CREATE TABLE `master_rekanan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_rekanan` VARCHAR(255) NOT NULL,
  `alamat` TEXT NULL,
  `nik_npwp` VARCHAR(50) NOT NULL,
  `nama_wp` VARCHAR(255) NULL,
  `bank_default` VARCHAR(100) NULL,
  `rekening_default` VARCHAR(50) NULL,
  `atas_nama_default` VARCHAR(255) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `master_pejabat`;
CREATE TABLE `master_pejabat` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nip` VARCHAR(50) NULL,
  `nama_pejabat` VARCHAR(255) NOT NULL,
  `pangkat_jabatan` VARCHAR(255) NOT NULL,
  `role_pejabat` ENUM('pengaju', 'penyetuju', 'keduanya') DEFAULT 'keduanya',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `master_dha`;
CREATE TABLE `master_dha` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dha` TEXT NOT NULL,
  `rangkaian_coa` VARCHAR(100) NOT NULL,
  `anggaran` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `natural_akun` VARCHAR(255) NOT NULL,
  `kode_dha` VARCHAR(50) NULL,
  `nama_dha` VARCHAR(255) NULL,
  `pagu_awal` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `saldo_tersedia` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `tahun_anggaran` INT NOT NULL DEFAULT 2025,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `master_coa`;
CREATE TABLE `master_coa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_coa` VARCHAR(50) NOT NULL UNIQUE,
  `nama_akun` VARCHAR(255) NOT NULL,
  `kategori` VARCHAR(100) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `batches`;
CREATE TABLE `batches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `no_batch` VARCHAR(50) NOT NULL UNIQUE,
  `no_dokumen` VARCHAR(100) NOT NULL,
  `tgl_transaksi` DATE NOT NULL,
  `dari_uker` VARCHAR(255) NOT NULL,
  `kepada_uker` VARCHAR(255) NOT NULL,
  `perihal` TEXT NOT NULL,
  

  `nama_rekanan` VARCHAR(255) NOT NULL,
  `alamat_rekanan` TEXT NULL,
  `nik_npwp` VARCHAR(50) NULL,
  `nama_wp_rekanan` VARCHAR(255) NULL,
  `no_faktur_pajak` VARCHAR(100) NULL,
  `tgl_faktur_pajak` DATE NULL,
  

  `tipe_pembayaran` VARCHAR(100) NOT NULL,
  `nama_bank` VARCHAR(100) NOT NULL,
  `nama_rekening` VARCHAR(255) NOT NULL,
  `nomor_rekening` VARCHAR(60) NOT NULL,
  `beban_anggaran_uker` VARCHAR(255) NOT NULL,
  `jenis_invoice` VARCHAR(100) NOT NULL,
  

  `nama_dha` VARCHAR(255) NULL,
  

  `yang_mengajukan` VARCHAR(255) NULL,
  `pangkat_mengajukan` VARCHAR(255) NULL,
  `yang_menyetujui` VARCHAR(255) NULL,
  `pangkat_menyetujui` VARCHAR(255) NULL,
  

  `status` VARCHAR(50) DEFAULT 'Diajukan',
  `catatan_audit` TEXT NULL,
  `created_by` VARCHAR(100) DEFAULT 'Admin ERP',
  `updated_by` VARCHAR(100) DEFAULT 'Admin ERP',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT(1) DEFAULT 0,
  `deleted_at` TIMESTAMP NULL,

  INDEX `idx_no_batch` (`no_batch`),
  INDEX `idx_no_dokumen` (`no_dokumen`),
  INDEX `idx_tgl_transaksi` (`tgl_transaksi`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `batch_invoices`;
CREATE TABLE `batch_invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL,
  `slot_index` TINYINT NOT NULL COMMENT 'Slot 1 s/d 4',
  `no_invoice` VARCHAR(100) NULL,
  `tgl_invoice` DATE NULL,
  `nominal` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `batch_coas`;
CREATE TABLE `batch_coas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL,
  `slot_index` TINYINT NOT NULL COMMENT 'Slot 1 s/d 3',
  `rangkaian_coa` VARCHAR(255) NULL,
  `natural_akun` VARCHAR(255) NULL,
  `nominal` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- SEED DATA AWAL (MASTER & TRANSAKSI BATCH ERP BANK INDONESIA)
-- ========================================================

-- 1. Master Unit Kerja
INSERT INTO `master_uker` (`kode_uker`, `nama_uker`, `is_active`) VALUES
('UKER-01', 'Unit Manajemen Keuangan KPw BI Jember', 1),
('UKER-02', 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)', 1),
('UKER-03', 'Unit Manajemen Logistik & Rumah Tangga', 1),
('UKER-04', 'Fungsi Data, Statistik & Kajian Ekonomi', 1),
('UKER-05', 'Unit Operasional Sistem Pembayaran & PUR', 1),
('UKER-06', 'Fungsi Kehumasan & Komunikasi Kebijakan', 1),
('UKER-07', 'Seksi Kepatuhan & Manajemen Risiko', 1)
ON DUPLICATE KEY UPDATE `nama_uker` = VALUES(`nama_uker`);

-- 2. Master Rekanan / Vendor
INSERT INTO `master_rekanan` (`nama_rekanan`, `alamat`, `nik_npwp`, `nama_wp`, `bank_default`, `rekening_default`, `atas_nama_default`, `is_active`) VALUES
('CV Surya Mandiri Jember', 'Jl. Gajah Mada No. 45, Jember', '01.234.567.8-654.000', 'CV Surya Mandiri Jember', 'Bank Mandiri', '1430019283741', 'CV Surya Mandiri Jember', 1),
('PT Graha Mitra Sarana', 'Jl. Hayam Wuruk No. 12, Jember', '02.345.678.9-654.000', 'PT Graha Mitra Sarana', 'Bank Rakyat Indonesia (BRI)', '002101002345501', 'PT Graha Mitra Sarana', 1),
('PT Kencana Perkasa Abadi', 'Jl. Kalimantan No. 88, Jember', '03.456.789.0-654.000', 'PT Kencana Perkasa Abadi', 'Bank Central Asia (BCA)', '0351982734', 'PT Kencana Perkasa Abadi', 1),
('CV Pandawa Cipta Karya', 'Jl. Trunojoyo No. 15, Jember', '04.567.890.1-654.000', 'CV Pandawa Cipta Karya', 'Bank Jatim', '0032049581', 'CV Pandawa Cipta Karya', 1),
('PT Indotech Pratama Solusindo', 'Jl. PB Sudirman No. 70, Jember', '05.678.901.2-654.000', 'PT Indotech Pratama Solusindo', 'Bank Negara Indonesia (BNI)', '0238491823', 'PT Indotech Pratama Solusindo', 1);

-- 3. Master Pejabat Otorisasi
INSERT INTO `master_pejabat` (`nip`, `nama_pejabat`, `pangkat_jabatan`, `role_pejabat`, `is_active`) VALUES
('198503152010121002', 'Ahmad Fauzi, S.E.', 'Pelaksana Madya Keuangan', 'pengaju', 1),
('198207182008011003', 'Bambang Prasetyo, S.E., M.M.', 'Asisten Manajer Pengadaan', 'pengaju', 1),
('199004122014022001', 'Rina Wulandari, S.Kom.', 'Pelaksana Sistem Pembayaran', 'pengaju', 1),
('197508201999032001', 'Dra. Sri Wahyuni, M.Si.', 'Kepala Seksi Keuangan & Akuntansi', 'penyetuju', 1),
('197205101997031002', 'Ir. Gunawan Santoso, M.M.', 'Deputi Kepala Perwakilan KPw BI Jember', 'penyetuju', 1),
('197811052002121001', 'H. Mochammad Arifin, S.E., Ak.', 'Manajer Operasional KPw BI Jember', 'penyetuju', 1);

-- 4. Master DHA & Anggaran
INSERT INTO `master_dha` (`dha`, `rangkaian_coa`, `anggaran`, `natural_akun`, `kode_dha`, `nama_dha`, `pagu_awal`, `saldo_tersedia`, `tahun_anggaran`, `is_active`) VALUES
('DHA/2025/KEU-01 - Beban Operasional Kantor & Rumah Tangga', '5.1.03.01', 750000000.00, '5.1.03 - Beban Rumah Tangga & Utilitas', 'DHA/2025/KEU-01', 'Beban Operasional Kantor & Rumah Tangga', 750000000.00, 520000000.00, 2025, 1),
('DHA/2025/PUR-02 - Penyelenggaraan Kas Keliling & Sosialisasi Rupiah', '5.1.02.04', 450000000.00, '5.1.02 - Beban Transportasi & Kegiatan Kas', 'DHA/2025/PUR-02', 'Penyelenggaraan Kas Keliling & Sosialisasi Rupiah', 450000000.00, 310000000.00, 2025, 1),
('DHA/2025/UMKM-03 - Fasilitasi Pengembangan Klaster UMKM Binaan BI', '5.1.04.02', 600000000.00, '5.1.04 - Beban Fasilitasi Program UMKM', 'DHA/2025/UMKM-03', 'Fasilitasi Pengembangan Klaster UMKM Binaan BI', 600000000.00, 485000000.00, 2025, 1),
('DHA/2025/KOM-04 - Komunikasi Kebijakan & Diseminasi Kajian Ekonomi', '5.1.05.01', 350000000.00, '5.1.05 - Beban Publikasi & Acara Media', 'DHA/2025/KOM-04', 'Komunikasi Kebijakan & Diseminasi Kajian Ekonomi', 350000000.00, 215000000.00, 2025, 1),
('DHA/2025/PSBI-05 - Program Sosial Bank Indonesia (PSBI) & Kepedulian', '5.2.01.05', 800000000.00, '5.2.01 - Beban Bantuan Sosial Program Prioritas', 'DHA/2025/PSBI-05', 'Program Sosial Bank Indonesia (PSBI) & Kepedulian', 800000000.00, 640000000.00, 2025, 1);

-- 5. Master Chart of Accounts (COA)
INSERT INTO `master_coa` (`kode_coa`, `nama_akun`, `kategori`, `is_active`) VALUES
('5.1.02.01', 'Biaya Honorarium Narasumber / MC Kegiatan', 'Operasional', 1),
('5.1.02.04', 'Biaya Sewa Kendaraan Operasional & Transportasi', 'Operasional', 1),
('5.1.03.01', 'Biaya Konsumsi Kegiatan Rapat & Sarasehan', 'Operasional', 1),
('5.2.01.05', 'Biaya Bantuan Sosial / Santunan Program Prioritas', 'Sosial', 1),
('5.1.04.02', 'Biaya Fasilitasi Pelaksana Program Pendukung UMKM', 'Program', 1),
('5.1.05.01', 'Biaya Publikasi, Dokumentasi & Perlengkapan Acara', 'Kehumasan', 1),
('5.1.01.02', 'Beban Perjalanan Dinas Dalam Negeri Operasional', 'Operasional', 1),
('5.1.03.05', 'Beban Pemeliharaan Peralatan Kantor & Teknologi Informasi', 'Pemeliharaan', 1)
ON DUPLICATE KEY UPDATE `nama_akun` = VALUES(`nama_akun`);

-- 6. Seed Data Transaksi Batch Awal
INSERT INTO `batches` (`id`, `no_batch`, `no_dokumen`, `tgl_transaksi`, `dari_uker`, `kepada_uker`, `perihal`, `nama_rekanan`, `alamat_rekanan`, `nik_npwp`, `nama_wp_rekanan`, `no_faktur_pajak`, `tgl_faktur_pajak`, `tipe_pembayaran`, `nama_bank`, `nama_rekening`, `nomor_rekening`, `beban_anggaran_uker`, `jenis_invoice`, `nama_dha`, `yang_mengajukan`, `pangkat_mengajukan`, `yang_menyetujui`, `pangkat_menyetujui`, `status`, `created_by`, `updated_by`) VALUES
(1, 'BATCH-2025-001', 'SPBY-001/KEU/I/2025', '2025-01-15', 'Unit Manajemen Keuangan KPw BI Jember', 'Unit Manajemen Keuangan KPw BI Jember', 'Pembayaran Pengadaan Konsumsi Sarasehan Ekonomi & Keuangan', 'CV Surya Mandiri Jember', 'Jl. Gajah Mada No. 45, Jember', '01.234.567.8-654.000', 'CV Surya Mandiri Jember', '010.001-25.00019283', '2025-01-14', 'Transfer Bank Antar Rekening', 'Bank Mandiri', 'CV Surya Mandiri Jember', '1430019283741', 'Unit Manajemen Keuangan KPw BI Jember', 'Invoice PO Pengadaan Barang & Jasa', 'DHA/2025/KEU-01 - Beban Operasional Kantor & Rumah Tangga', 'Ahmad Fauzi, S.E.', 'Pelaksana Madya Keuangan', 'Dra. Sri Wahyuni, M.Si.', 'Kepala Seksi Keuangan & Akuntansi', 'Disetujui', 'Admin ERP', 'Admin ERP'),
(2, 'BATCH-2025-002', 'SPBY-002/PUR/I/2025', '2025-01-20', 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)', 'Unit Manajemen Keuangan KPw BI Jember', 'Sewa Armada Kendaraan Operasional Kas Keliling Wilayah Tapal Kuda', 'PT Graha Mitra Sarana', 'Jl. Hayam Wuruk No. 12, Jember', '02.345.678.9-654.000', 'PT Graha Mitra Sarana', '010.002-25.00038472', '2025-01-18', 'BI-FAST / Real Time', 'Bank Rakyat Indonesia (BRI)', 'PT Graha Mitra Sarana', '002101002345501', 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)', 'Invoice Non PO / Kontrak Langsung', 'DHA/2025/PUR-02 - Penyelenggaraan Kas Keliling & Sosialisasi Rupiah', 'Bambang Prasetyo, S.E., M.M.', 'Asisten Manajer Pengadaan', 'Ir. Gunawan Santoso, M.M.', 'Deputi Kepala Perwakilan KPw BI Jember', 'Cair', 'Admin ERP', 'Admin ERP'),
(3, 'BATCH-2025-003', 'SPBY-003/UMKM/II/2025', '2025-02-05', 'Fungsi Data, Statistik & Kajian Ekonomi', 'Unit Manajemen Keuangan KPw BI Jember', 'Fasilitasi Workshop Peningkatan Kapasitas & Digitalisasi UMKM Kopi Jember', 'PT Kencana Perkasa Abadi', 'Jl. Kalimantan No. 88, Jember', '03.456.789.0-654.000', 'PT Kencana Perkasa Abadi', '010.003-25.00059182', '2025-02-03', 'Overbooking / Pindah Buku BI', 'Bank Central Asia (BCA)', 'PT Kencana Perkasa Abadi', '0351982734', 'Fungsi Data, Statistik & Kajian Ekonomi', 'Invoice PO Pengadaan Barang & Jasa', 'DHA/2025/UMKM-03 - Fasilitasi Pengembangan Klaster UMKM Binaan BI', 'Rina Wulandari, S.Kom.', 'Pelaksana Sistem Pembayaran', 'H. Mochammad Arifin, S.E., Ak.', 'Manajer Operasional KPw BI Jember', 'Diajukan', 'Admin ERP', 'Admin ERP')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- 7. Seed Invoices Transaksi Batch
INSERT INTO `batch_invoices` (`batch_id`, `slot_index`, `no_invoice`, `tgl_invoice`, `nominal`) VALUES
(1, 1, 'INV/SMJ/01/2025', '2025-01-14', 15000000.00),
(2, 1, 'INV/GMS/01/2025', '2025-01-18', 45000000.00),
(3, 1, 'INV/KPA/02/2025', '2025-02-03', 28500000.00);

-- 8. Seed COA Transaksi Batch
INSERT INTO `batch_coas` (`batch_id`, `slot_index`, `rangkaian_coa`, `nominal`) VALUES
(1, 1, '5.1.03.01 - Biaya Konsumsi Kegiatan Rapat & Sarasehan', 15000000.00),
(2, 1, '5.1.02.04 - Biaya Sewa Kendaraan Operasional & Transportasi', 45000000.00),
(3, 1, '5.1.04.02 - Biaya Fasilitasi Pelaksana Program Pendukung UMKM', 28500000.00);


DROP TABLE IF EXISTS `app_users`;
DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `role_key` VARCHAR(50) NOT NULL UNIQUE,
  `role_name` VARCHAR(100) NOT NULL,
  `badge_class` VARCHAR(50) DEFAULT 'tag-navy',
  `deskripsi` TEXT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `app_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `nama_lengkap` VARCHAR(255) NOT NULL,
  `nip` VARCHAR(50) NULL,
  `email` VARCHAR(150) NULL,
  `satker` VARCHAR(255) NOT NULL,
  `role_key` VARCHAR(50) NOT NULL,
  `status` ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_key`) REFERENCES `user_roles`(`role_key`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data Roles Sistem
INSERT INTO `user_roles` (`role_key`, `role_name`, `badge_class`, `deskripsi`) VALUES
('super_admin', 'Super Admin', 'tag-rose', 'Akses penuh ke seluruh modul, konfigurasi sistem, database, audit log, serta kelola pengguna.'),
('maker', 'Maker (Operator Keuangan)', 'tag-navy', 'Membuat transaksi batch baru, entri data invoice, alokasi COA, dan pengajuan pembayaran.'),
('checker', 'Checker (Verifikator Keuangan)', 'tag-amber', 'Memeriksa kelengkapan administrasi, verifikasi faktur pajak, dan evaluasi kepatuhan dokumen.'),
('approver', 'Approver (Pejabat Penyetuju)', 'tag-emerald', 'Otorisator berwenang menyetujui transaksi, pengesahan Lembar Disposisi, dan pencairan dana.'),
('auditor', 'Auditor (Pengawas Keuangan)', 'tag-indigo', 'Akses pengawasan dan review laporan keuangan secara menyeluruh (Read-only access).')
ON DUPLICATE KEY UPDATE `role_name` = VALUES(`role_name`);

-- Seed Data Pengguna Awal
INSERT INTO `app_users` (`username`, `nama_lengkap`, `nip`, `email`, `satker`, `role_key`, `status`) VALUES
('hadi.sarosa', 'Mochamad Hadi Sarosa', '19920314 201801 1 001', 'hadi.sarosa@bi.go.id', 'Unit Manajemen Keuangan KPw BI Jember', 'super_admin', 'Aktif'),
('ahmad.fauzi', 'Ahmad Fauzi, S.E.', '19850315 201012 1 002', 'ahmad.fauzi@bi.go.id', 'Unit Manajemen Keuangan KPw BI Jember', 'maker', 'Aktif'),
('rina.wulandari', 'Rina Wulandari, S.Kom.', '19900412 201402 2 001', 'rina.wulandari@bi.go.id', 'Unit Operasional Sistem Pembayaran & PUR', 'checker', 'Aktif'),
('doni.prasetiyo', 'Doni Prasetiyo, S.E., M.M.', '19781105 200212 1 001', 'doni.prasetiyo@bi.go.id', 'Fungsi Kehumasan & Komunikasi Kebijakan', 'approver', 'Aktif'),
('niken.wigati', 'Niken Sih Wigati', '19820718 200801 2 003', 'niken.wigati@bi.go.id', 'Unit Manajemen Intern', 'approver', 'Aktif'),
('sri.wahyuni', 'Dra. Sri Wahyuni, M.Si.', '19750820 199903 2 001', 'sri.wahyuni@bi.go.id', 'Seksi Kepatuhan & Manajemen Risiko', 'auditor', 'Aktif')
ON DUPLICATE KEY UPDATE `nama_lengkap` = VALUES(`nama_lengkap`);



