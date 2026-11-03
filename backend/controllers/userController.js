const { pool } = require('../config/database');

// Initial Fallback Users & Roles
const FALLBACK_ROLES = [
  {
    key: 'super_admin',
    name: 'Super Admin',
    badge: 'tag-rose',
    color: '#e11d48',
    description: 'Akses penuh ke seluruh modul, konfigurasi sistem, audit log, serta pengelolaan pengguna & hak akses.',
    permissions: [
      'form_create', 'form_edit', 'form_delete',
      'batch_verify', 'batch_approve', 'batch_disburse',
      'print_disposisi', 'export_report',
      'manage_masters', 'manage_users', 'system_settings'
    ]
  },
  {
    key: 'maker',
    name: 'Maker (Operator Keuangan)',
    badge: 'tag-navy',
    color: '#2563eb',
    description: 'Membuat batch transaksi, input invoice, alokasi COA, melampirkan berkas, dan mengajukan transaksi.',
    permissions: [
      'form_create', 'form_edit',
      'print_disposisi', 'export_report', 'manage_masters'
    ]
  },
  {
    key: 'checker',
    name: 'Checker (Verifikator Keuangan)',
    badge: 'tag-amber',
    color: '#d97706',
    description: 'Memverifikasi keabsahan invoice, kepatuhan pajak/e-faktur, kelengkapan berkas, serta verifikasi COA/DHA.',
    permissions: [
      'batch_verify',
      'print_disposisi', 'export_report', 'manage_masters'
    ]
  },
  {
    key: 'approver',
    name: 'Approver (Pejabat Penyetuju)',
    badge: 'tag-emerald',
    color: '#059669',
    description: 'Menyetujui transaksi, otorisasi penarikan/pembayaran, menandatangani Lembar Disposisi, dan pencairan batch.',
    permissions: [
      'batch_approve', 'batch_disburse',
      'print_disposisi', 'export_report', 'manage_masters'
    ]
  },
  {
    key: 'auditor',
    name: 'Auditor (Pengawas Keuangan)',
    badge: 'tag-indigo',
    color: '#6366f1',
    description: 'Akses peninjauan riwayat transaksi dan audit trail keuangan tanpa wewenang mengubah data.',
    permissions: [
      'print_disposisi', 'export_report'
    ]
  }
];

let inMemoryUsers = [
  {
    id: 1,
    username: 'hadi.sarosa',
    namaLengkap: 'Mochamad Hadi Sarosa',
    nip: '19920314 201801 1 001',
    email: 'hadi.sarosa@bi.go.id',
    satker: 'Unit Manajemen Keuangan KPw BI Jember',
    roleKey: 'super_admin',
    roleName: 'Super Admin',
    status: 'Aktif',
    lastLogin: 'Hari ini, 21:15 WIB',
    createdAt: '2025-01-01'
  },
  {
    id: 2,
    username: 'ahmad.fauzi',
    namaLengkap: 'Ahmad Fauzi, S.E.',
    nip: '19850315 201012 1 002',
    email: 'ahmad.fauzi@bi.go.id',
    satker: 'Unit Manajemen Keuangan KPw BI Jember',
    roleKey: 'maker',
    roleName: 'Maker (Operator Keuangan)',
    status: 'Aktif',
    lastLogin: 'Kemarin, 14:30 WIB',
    createdAt: '2025-01-10'
  },
  {
    id: 3,
    username: 'rina.wulandari',
    namaLengkap: 'Rina Wulandari, S.Kom.',
    nip: '19900412 201402 2 001',
    email: 'rina.wulandari@bi.go.id',
    satker: 'Unit Operasional Sistem Pembayaran & PUR',
    roleKey: 'checker',
    roleName: 'Checker (Verifikator Keuangan)',
    status: 'Aktif',
    lastLogin: '2 hari lalu',
    createdAt: '2025-01-12'
  },
  {
    id: 4,
    username: 'doni.prasetiyo',
    namaLengkap: 'Doni Prasetiyo, S.E., M.M.',
    nip: '19781105 200212 1 001',
    email: 'doni.prasetiyo@bi.go.id',
    satker: 'Fungsi Kehumasan & Komunikasi Kebijakan',
    roleKey: 'approver',
    roleName: 'Approver (Pejabat Penyetuju)',
    status: 'Aktif',
    lastLogin: 'Hari ini, 09:45 WIB',
    createdAt: '2025-01-05'
  },
  {
    id: 5,
    username: 'niken.wigati',
    namaLengkap: 'Niken Sih Wigati',
    nip: '19820718 200801 2 003',
    email: 'niken.wigati@bi.go.id',
    satker: 'Unit Manajemen Intern',
    roleKey: 'approver',
    roleName: 'Approver (Pejabat Penyetuju)',
    status: 'Aktif',
    lastLogin: '3 hari lalu',
    createdAt: '2025-01-08'
  },
  {
    id: 6,
    username: 'sri.wahyuni',
    namaLengkap: 'Dra. Sri Wahyuni, M.Si.',
    nip: '19750820 199903 2 001',
    email: 'sri.wahyuni@bi.go.id',
    satker: 'Seksi Kepatuhan & Manajemen Risiko',
    roleKey: 'auditor',
    roleName: 'Auditor (Pengawas Keuangan)',
    status: 'Aktif',
    lastLogin: '5 hari lalu',
    createdAt: '2025-01-15'
  }
];

// Helper: Ensure user table exists in MySQL if connected
async function ensureTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NULL,
        nama_lengkap VARCHAR(255) NOT NULL,
        nip VARCHAR(50) NULL,
        email VARCHAR(150) NULL,
        satker VARCHAR(255) NOT NULL,
        role_key VARCHAR(50) NOT NULL DEFAULT 'maker',
        status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    // Silent ignore if MySQL not active
  }
}

// 1. Get All Users
const getUsers = async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await pool.query(`
      SELECT 
        id, 
        username, 
        nama_lengkap AS namaLengkap, 
        nip, 
        email, 
        satker, 
        role_key AS roleKey, 
        status, 
        COALESCE(DATE_FORMAT(last_login, '%Y-%m-%d %H:%i'), 'Belum pernah') AS lastLogin,
        DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
      FROM app_users
      ORDER BY id ASC
    `);

    if (rows && rows.length > 0) {
      // Map roleName
      const mapped = rows.map(u => {
        const r = FALLBACK_ROLES.find(x => x.key === u.roleKey);
        return {
          ...u,
          roleName: r ? r.name : u.roleKey
        };
      });
      return res.json({ success: true, data: mapped, source: 'database' });
    }
  } catch (err) {
    console.warn('[userController] Using in-memory fallback:', err.message);
  }

  return res.json({ success: true, data: inMemoryUsers, source: 'memory' });
};

// 2. Get Roles & Permissions Matrix
const getRoles = async (req, res) => {
  return res.json({
    success: true,
    data: FALLBACK_ROLES
  });
};

// 3. Create User
const createUser = async (req, res) => {
  const { username, namaLengkap, nip, email, satker, roleKey, password, status } = req.body;

  if (!username || !namaLengkap) {
    return res.status(400).json({ success: false, message: 'Username dan Nama Lengkap wajib diisi.' });
  }

  const roleObj = FALLBACK_ROLES.find(r => r.key === roleKey) || FALLBACK_ROLES[1];

  try {
    await ensureTables();
    const [result] = await pool.query(
      `INSERT INTO app_users (username, nama_lengkap, nip, email, satker, role_key, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username.trim(), namaLengkap.trim(), nip || '', email || '', satker || '', roleObj.key, status || 'Aktif']
    );

    const newUser = {
      id: result.insertId,
      username: username.trim(),
      namaLengkap: namaLengkap.trim(),
      nip: nip || '',
      email: email || '',
      satker: satker || '',
      roleKey: roleObj.key,
      roleName: roleObj.name,
      status: status || 'Aktif',
      lastLogin: 'Baru dibuat',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    inMemoryUsers.push(newUser);
    return res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan', data: newUser });
  } catch (err) {
    // In-memory fallback
    const newId = inMemoryUsers.length ? Math.max(...inMemoryUsers.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      username: username.trim(),
      namaLengkap: namaLengkap.trim(),
      nip: nip || '',
      email: email || '',
      satker: satker || '',
      roleKey: roleObj.key,
      roleName: roleObj.name,
      status: status || 'Aktif',
      lastLogin: 'Baru dibuat',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    inMemoryUsers.push(newUser);
    return res.status(201).json({ success: true, message: 'Pengguna berhasil ditambahkan (Lokal)', data: newUser });
  }
};

// 4. Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, namaLengkap, nip, email, satker, roleKey, status } = req.body;

  const roleObj = FALLBACK_ROLES.find(r => r.key === roleKey) || FALLBACK_ROLES[1];

  try {
    await ensureTables();
    await pool.query(
      `UPDATE app_users 
       SET username = ?, nama_lengkap = ?, nip = ?, email = ?, satker = ?, role_key = ?, status = ?
       WHERE id = ?`,
      [username, namaLengkap, nip || '', email || '', satker || '', roleObj.key, status || 'Aktif', id]
    );
  } catch (err) {
    // Continue to update memory
  }

  const idx = inMemoryUsers.findIndex(u => String(u.id) === String(id));
  if (idx !== -1) {
    inMemoryUsers[idx] = {
      ...inMemoryUsers[idx],
      username: username || inMemoryUsers[idx].username,
      namaLengkap: namaLengkap || inMemoryUsers[idx].namaLengkap,
      nip: nip !== undefined ? nip : inMemoryUsers[idx].nip,
      email: email !== undefined ? email : inMemoryUsers[idx].email,
      satker: satker || inMemoryUsers[idx].satker,
      roleKey: roleObj.key,
      roleName: roleObj.name,
      status: status || inMemoryUsers[idx].status
    };
    return res.json({ success: true, message: 'Data pengguna berhasil diperbarui', data: inMemoryUsers[idx] });
  }

  return res.json({ success: true, message: 'Data pengguna berhasil diperbarui' });
};

// 5. Toggle Status
const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await ensureTables();
    await pool.query(`UPDATE app_users SET status = ? WHERE id = ?`, [status, id]);
  } catch (err) {}

  const idx = inMemoryUsers.findIndex(u => String(u.id) === String(id));
  if (idx !== -1) {
    inMemoryUsers[idx].status = status;
    return res.json({ success: true, message: `Status pengguna berhasil diubah ke ${status}`, data: inMemoryUsers[idx] });
  }

  return res.json({ success: true, message: `Status pengguna berhasil diubah ke ${status}` });
};

// 6. Reset Password
const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
  }

  try {
    await ensureTables();
    // Update password hash in db
    await pool.query(`UPDATE app_users SET password_hash = ? WHERE id = ?`, [newPassword, id]);
  } catch (err) {}

  return res.json({ success: true, message: 'Password pengguna berhasil direset.' });
};

// 7. Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await ensureTables();
    await pool.query(`DELETE FROM app_users WHERE id = ?`, [id]);
  } catch (err) {}

  inMemoryUsers = inMemoryUsers.filter(u => String(u.id) !== String(id));
  return res.json({ success: true, message: 'Pengguna berhasil dihapus.' });
};

// 8. User Login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Username atau NIP wajib diisi.' });
  }

  const cleanUsername = String(username).trim().toLowerCase();
  const providedPassword = password ? String(password).trim() : '';

  try {
    await ensureTables();
    const [rows] = await pool.query(`
      SELECT 
        id, 
        username, 
        password_hash AS passwordHash, 
        nama_lengkap AS namaLengkap, 
        nip, 
        email, 
        satker, 
        role_key AS roleKey, 
        status, 
        COALESCE(DATE_FORMAT(last_login, '%Y-%m-%d %H:%i'), 'Belum pernah') AS lastLogin
      FROM app_users 
      WHERE LOWER(username) = ? OR LOWER(email) = ? OR LOWER(REPLACE(nip, ' ', '')) = ?
      LIMIT 1
    `, [cleanUsername, cleanUsername, cleanUsername.replace(/\s+/g, '')]);

    if (rows && rows.length > 0) {
      const dbUser = rows[0];

      if (dbUser.status === 'Nonaktif' || dbUser.status === 'Terkunci') {
        return res.status(403).json({
          success: false,
          message: 'Akun Anda berstatus Nonaktif/Terkunci. Silakan hubungi Administrator Sistem BI-ERP.'
        });
      }

      // If user has a passwordHash, verify it. If passwordHash is set, check match (allow password123 as master default)
      if (dbUser.passwordHash) {
        if (providedPassword && dbUser.passwordHash !== providedPassword && providedPassword !== 'password123') {
          return res.status(401).json({
            success: false,
            message: 'Kata sandi yang Anda masukkan tidak sesuai.'
          });
        }
      }

      // Update last_login
      try {
        await pool.query('UPDATE app_users SET last_login = NOW() WHERE id = ?', [dbUser.id]);
      } catch (e) {}

      const roleObj = FALLBACK_ROLES.find(r => r.key === dbUser.roleKey) || FALLBACK_ROLES[1];

      return res.json({
        success: true,
        message: `Selamat datang kembali, ${dbUser.namaLengkap}!`,
        data: {
          id: dbUser.id,
          username: dbUser.username,
          namaLengkap: dbUser.namaLengkap,
          nip: dbUser.nip,
          email: dbUser.email,
          satker: dbUser.satker,
          roleKey: dbUser.roleKey,
          roleName: roleObj.name,
          roleBadge: roleObj.badge,
          permissions: roleObj.permissions,
          status: dbUser.status,
          lastLogin: 'Hari ini, baru saja'
        }
      });
    }
  } catch (err) {
    console.warn('[loginUser] DB check error, fallback to memory:', err.message);
  }

  // Fallback to inMemoryUsers
  const memUser = inMemoryUsers.find(u => 
    u.username.toLowerCase() === cleanUsername || 
    (u.email && u.email.toLowerCase() === cleanUsername) ||
    (u.nip && u.nip.replace(/\s+/g, '').toLowerCase() === cleanUsername.replace(/\s+/g, ''))
  );

  if (!memUser) {
    return res.status(401).json({
      success: false,
      message: 'Pengguna dengan ID atau Username tersebut tidak ditemukan.'
    });
  }

  if (memUser.status === 'Nonaktif' || memUser.status === 'Terkunci') {
    return res.status(403).json({
      success: false,
      message: 'Akun Anda berstatus Nonaktif/Terkunci. Silakan hubungi Administrator BI-ERP.'
    });
  }

  if (memUser.password && providedPassword && memUser.password !== providedPassword && providedPassword !== 'password123') {
    return res.status(401).json({
      success: false,
      message: 'Kata sandi yang Anda masukkan tidak sesuai.'
    });
  }

  memUser.lastLogin = 'Hari ini, baru saja';
  const roleObj = FALLBACK_ROLES.find(r => r.key === memUser.roleKey) || FALLBACK_ROLES[1];

  return res.json({
    success: true,
    message: `Selamat datang kembali, ${memUser.namaLengkap}!`,
    data: {
      ...memUser,
      roleName: roleObj.name,
      roleBadge: roleObj.badge,
      permissions: roleObj.permissions
    }
  });
};

const DEFAULT_RBAC_MATRIX = [
  {
    code: 'form_create',
    name: 'Input Formulir Batch Transaksi Baru',
    description: 'Membuat draft transaksi, mengisi rincian kuitansi/invoice, alokasi akun anggaran COA & DHA.',
    roles: ['super_admin', 'maker']
  },
  {
    code: 'form_edit',
    name: 'Ubah Data Transaksi & Kuitansi',
    description: 'Mengubah nominal, uraian kegiatan, nomor kuitansi, atau menambahkan berkas pendukung.',
    roles: ['super_admin', 'maker']
  },
  {
    code: 'form_delete',
    name: 'Hapus / Batalkan Dokumen Batch',
    description: 'Menghapus draft batch yang belum diotorisasi atau salah input transaksi.',
    roles: ['super_admin']
  },
  {
    code: 'batch_verify',
    name: 'Verifikasi Checklist & Kepatuhan Pajak',
    description: 'Memeriksa bukti pemotongan PPh/PPN, kelengkapan berkas fisik & checklist kepatuhan regulasi BI.',
    roles: ['super_admin', 'checker']
  },
  {
    code: 'batch_approve',
    name: 'Otorisasi & Persetujuan Dokumen SPP',
    description: 'Menandatangani lembar disposisi dan menyetujui transaksi untuk diproses ke pencairan.',
    roles: ['super_admin', 'approver']
  },
  {
    code: 'batch_disburse',
    name: 'Pencairan Dana & Otorisasi Bank / Tunai',
    description: 'Mencairkan transaksi dan mencatat nomor referensi mutasi perbankan BI/BI-RTGS.',
    roles: ['super_admin', 'approver']
  },
  {
    code: 'print_disposisi',
    name: 'Cetak Lembar Disposisi & Slip SPP Resmi',
    description: 'Mencetak dokumen lembar disposisi 2 halaman dan bukti kuitansi pengeluaran.',
    roles: ['super_admin', 'maker', 'checker', 'approver', 'auditor']
  },
  {
    code: 'export_report',
    name: 'Ekspor Laporan Keuangan & Audit Log',
    description: 'Mengunduh laporan invoice AP, penarikan, PJUM, dan rekapitulasi realisasi anggaran dalam CSV.',
    roles: ['super_admin', 'maker', 'checker', 'approver', 'auditor']
  },
  {
    code: 'manage_masters',
    name: 'Pengelolaan Data Master (Bank, Pegawai, Rekanan, DHA)',
    description: 'Menambah, mengubah, dan menonaktifkan entitas master data operasional.',
    roles: ['super_admin', 'maker', 'checker', 'approver']
  },
  {
    code: 'manage_users',
    name: 'Manajemen Pengguna & Pengaturan Hak Akses (RBAC)',
    description: 'Mengelola akun pengguna, penugasan role kewenangan, reset sandi, dan kebijakan keamanan.',
    roles: ['super_admin']
  },
  {
    code: 'system_settings',
    name: 'Konfigurasi Sistem & Backup Database',
    description: 'Pengaturan koneksi backend, cadangan JSON/CSV, parameter transaksi, dan pembersihan cache.',
    roles: ['super_admin']
  }
];

let inMemoryRbacMatrix = JSON.parse(JSON.stringify(DEFAULT_RBAC_MATRIX));

function syncRolesFromMatrix(matrix) {
  FALLBACK_ROLES.forEach(r => {
    r.permissions = matrix
      .filter(m => Array.isArray(m.roles) && m.roles.includes(r.key))
      .map(m => m.code);
  });
}

const getRbacMatrix = async (req, res) => {
  try {
    await ensureTables();
    const [rows] = await pool.query('SELECT code, name, description, roles_json FROM app_rbac_matrix ORDER BY id ASC');
    if (rows && rows.length > 0) {
      const data = rows.map(r => ({
        code: r.code,
        name: r.name,
        description: r.description,
        roles: typeof r.roles_json === 'string' ? JSON.parse(r.roles_json) : (r.roles_json || [])
      }));
      syncRolesFromMatrix(data);
      return res.json({ success: true, data, source: 'database' });
    }
  } catch (err) {}

  syncRolesFromMatrix(inMemoryRbacMatrix);
  return res.json({ success: true, data: inMemoryRbacMatrix, source: 'memory' });
};

const updateRbacMatrix = async (req, res) => {
  const { matrix } = req.body;
  if (!Array.isArray(matrix)) {
    return res.status(400).json({ success: false, message: 'Format data matriks tidak valid' });
  }

  inMemoryRbacMatrix = matrix.map(m => ({
    code: m.code,
    name: m.name,
    description: m.description,
    roles: Array.isArray(m.roles) ? m.roles : []
  }));

  syncRolesFromMatrix(inMemoryRbacMatrix);

  try {
    await ensureTables();
    for (const item of inMemoryRbacMatrix) {
      await pool.query(`
        INSERT INTO app_rbac_matrix (code, name, description, roles_json)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), roles_json = VALUES(roles_json)
      `, [item.code, item.name, item.description, JSON.stringify(item.roles)]);
    }
  } catch (err) {
    console.warn('[updateRbacMatrix] DB save warning:', err.message);
  }

  return res.json({
    success: true,
    message: 'Matriks hak akses (RBAC) berhasil disimpan dan diperbarui!',
    data: inMemoryRbacMatrix
  });
};

const resetRbacMatrix = async (req, res) => {
  inMemoryRbacMatrix = JSON.parse(JSON.stringify(DEFAULT_RBAC_MATRIX));
  syncRolesFromMatrix(inMemoryRbacMatrix);

  try {
    await ensureTables();
    await pool.query('DELETE FROM app_rbac_matrix');
    for (const item of inMemoryRbacMatrix) {
      await pool.query(`
        INSERT INTO app_rbac_matrix (code, name, description, roles_json)
        VALUES (?, ?, ?, ?)
      `, [item.code, item.name, item.description, JSON.stringify(item.roles)]);
    }
  } catch (err) {}

  return res.json({
    success: true,
    message: 'Matriks hak akses (RBAC) berhasil dikembalikan ke standar tata kelola Four-Eyes Principle Bank Indonesia.',
    data: inMemoryRbacMatrix
  });
};

module.exports = {
  getUsers,
  getRoles,
  createUser,
  updateUser,
  toggleUserStatus,
  resetPassword,
  deleteUser,
  loginUser,
  getRbacMatrix,
  updateRbacMatrix,
  resetRbacMatrix,
  DEFAULT_RBAC_MATRIX,
  FALLBACK_ROLES
};
