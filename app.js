const { createApp, ref, reactive, computed, onMounted, watch } = Vue;

const API_BASE = 'http://localhost:5000/api';

function angkaKeTerbilang(nilai) {
  const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  const n = Math.floor(Math.abs(nilai));

  if (n === 0) return 'Nol Rupiah';

  function terbilang(x) {
    if (x < 12) return bilangan[x];
    if (x < 20) return terbilang(x - 10) + ' Belas';
    if (x < 100) return terbilang(Math.floor(x / 10)) + ' Puluh ' + terbilang(x % 10);
    if (x < 200) return 'Seratus ' + terbilang(x - 100);
    if (x < 1000) return terbilang(Math.floor(x / 100)) + ' Ratus ' + terbilang(x % 100);
    if (x < 2000) return 'Seribu ' + terbilang(x - 1000);
    if (x < 1000000) return terbilang(Math.floor(x / 1000)) + ' Ribu ' + terbilang(x % 1000);
    if (x < 1000000000) return terbilang(Math.floor(x / 1000000)) + ' Juta ' + terbilang(x % 1000000);
    if (x < 1000000000000) return terbilang(Math.floor(x / 1000000000)) + ' Miliar ' + terbilang(x % 1000000000);
    return terbilang(Math.floor(x / 1000000000000)) + ' Triliun ' + terbilang(x % 1000000000000);
  }

  return (terbilang(n) + ' Rupiah').replace(/\s+/g, ' ').trim();
}

async function showSweetConfirm({
  title = 'Konfirmasi Tindakan',
  html = '',
  text = '',
  icon = 'warning',
  confirmButtonText = 'Ya, Lanjutkan',
  cancelButtonText = 'Batal',
  confirmButtonColor = '#1e3a8a',
  cancelButtonColor = '#64748b'
} = {}) {
  const swalInstance = (typeof Swal !== 'undefined' && Swal && Swal.fire) ? Swal : (window.Swal || null);
  if (!swalInstance) {
    return window.confirm(text || title);
  }
  const result = await swalInstance.fire({
    title,
    text: html ? undefined : text,
    html: html || undefined,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    target: document.body
  });
  return result.isConfirmed;
}

createApp({
  setup() {
    // Auth State
    const isLoggedIn = ref(false);
    const isLoggingIn = ref(false);
    const loginErrorMessage = ref('');
    const loginSuccessMessage = ref('');
    const showLoginPassword = ref(false);
    const isLoginFocusedField = ref('');
    const isCapsLockActive = ref(false);
    const showForgotModal = ref(false);
    const showQuickRolesLogin = ref(true);

    const loginForm = reactive({
      username: 'ahmad.fauzi',
      password: 'password123',
      rememberMe: true
    });

    const defaultQuickUsers = [
      {
        username: 'hadi.sarosa',
        namaLengkap: 'Mochamad Hadi Sarosa',
        roleKey: 'super_admin',
        roleName: 'Super Admin',
        badgeClass: 'tag-rose',
        nip: '19920314 201801 1 001',
        satker: 'Unit Manajemen Keuangan KPw BI Jember',
        email: 'hadi.sarosa@bi.go.id'
      },
      {
        username: 'ahmad.fauzi',
        namaLengkap: 'Ahmad Fauzi, S.E.',
        roleKey: 'maker',
        roleName: 'Maker (Operator Keu)',
        badgeClass: 'tag-navy',
        nip: '19850315 201012 1 002',
        satker: 'Unit Manajemen Keuangan KPw BI Jember',
        email: 'ahmad.fauzi@bi.go.id'
      },
      {
        username: 'rina.wulandari',
        namaLengkap: 'Rina Wulandari, S.Kom.',
        roleKey: 'checker',
        roleName: 'Checker (Verifikator)',
        badgeClass: 'tag-amber',
        nip: '19900412 201402 2 001',
        satker: 'Unit Operasional Sistem Pembayaran & PUR',
        email: 'rina.wulandari@bi.go.id'
      },
      {
        username: 'doni.prasetiyo',
        namaLengkap: 'Doni Prasetiyo, S.E., M.M.',
        roleKey: 'approver',
        roleName: 'Approver (Penyetuju)',
        badgeClass: 'tag-emerald',
        nip: '19781105 200212 1 001',
        satker: 'Fungsi Kehumasan & Komunikasi Kebijakan',
        email: 'doni.prasetiyo@bi.go.id'
      },
      {
        username: 'sri.wahyuni',
        namaLengkap: 'Dra. Sri Wahyuni, M.Si.',
        roleKey: 'auditor',
        roleName: 'Auditor (Pengawas)',
        badgeClass: 'tag-indigo',
        nip: '19750820 199903 2 001',
        satker: 'Seksi Kepatuhan & Manajemen Risiko',
        email: 'sri.wahyuni@bi.go.id'
      }
    ];

    function applyQuickLoginUser(u) {
      loginForm.username = u.username;
      loginForm.password = 'password123';
      loginErrorMessage.value = '';
    }

    async function submitLogin() {
      if (!loginForm.username) {
        loginErrorMessage.value = 'Silakan masukkan Username atau NIP Anda.';
        showToast('Data belum lengkap! Silakan masukkan Username atau NIP Anda.', 'warning');
        return;
      }
      if (!loginForm.password) {
        loginErrorMessage.value = 'Silakan masukkan kata sandi Anda.';
        showToast('Data belum lengkap! Silakan masukkan kata sandi Anda.', 'warning');
        return;
      }

      loginErrorMessage.value = '';
      loginSuccessMessage.value = '';
      isLoggingIn.value = true;

      try {
        const res = await fetch(`${API_BASE}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: loginForm.username.trim(),
            password: loginForm.password
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.data) {
          handleLoginSuccess(data.data);
          return;
        } else {
          throw new Error(data.message || 'Login gagal.');
        }
      } catch (err) {
        console.warn('API login fallback:', err.message);
        const match = defaultQuickUsers.find(u => 
          u.username.toLowerCase() === loginForm.username.trim().toLowerCase() ||
          (u.email && u.email.toLowerCase() === loginForm.username.trim().toLowerCase())
        );

        if (match) {
          handleLoginSuccess({
            id: 1,
            username: match.username,
            namaLengkap: match.namaLengkap,
            nip: match.nip,
            email: match.email,
            satker: match.satker,
            roleKey: match.roleKey,
            roleName: match.roleName,
            status: 'Aktif'
          });
          return;
        }

        loginErrorMessage.value = err.message || 'Kredensial tidak valid.';
      } finally {
        isLoggingIn.value = false;
      }
    }

    function handleLoginSuccess(userData) {
      loginSuccessMessage.value = `Selamat datang, ${userData.namaLengkap}!`;
      currentUser.name = userData.namaLengkap;
      currentUser.nip = userData.nip || '';
      currentUser.role = userData.roleName || userData.roleKey;
      currentUser.satker = userData.satker || 'Unit Manajemen Keuangan KPw BI Jember';
      currentUser.email = userData.email || '';
      currentUser.roleKey = userData.roleKey || 'maker';

      const sessionData = {
        id: userData.id,
        username: userData.username,
        namaLengkap: userData.namaLengkap,
        nip: userData.nip,
        email: userData.email,
        satker: userData.satker,
        roleKey: userData.roleKey,
        roleName: userData.roleName
      };

      if (loginForm.rememberMe) {
        localStorage.setItem('bi_erp_auth_user', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('bi_erp_auth_user', JSON.stringify(sessionData));
      }

      setTimeout(() => {
        isLoggedIn.value = true;
        showToast(`Login berhasil! Selamat datang, ${userData.namaLengkap || 'Pegawai Bank Indonesia'}.`, 'success');
      }, 400);
    }

    function logoutUser() {
      isLoggedIn.value = false;
      localStorage.removeItem('bi_erp_auth_user');
      sessionStorage.removeItem('bi_erp_auth_user');
      showUserMenu.value = false;
      showToast('Berhasil logout dari sistem.', 'logout');
    }

    // Valid views navigation list
    const validViews = [
      'dashboard',
      'invoice-ap', 'travel-event', 'penarikan-um', 'pertanggungjawaban-um',
      'laporan-invoice', 'laporan-travel', 'laporan-penarikan', 'laporan-pertanggungjawaban',
      'data-pegawai', 'data-bank', 'data-rekanan', 'data-dha', 'data-unit-kerja',
      'pengaturan', 'form', 'table', 'print'
    ];

    function getViewFromUrl() {
      try {
        if (typeof window === 'undefined' || !window.location) return null;
        const params = new URLSearchParams(window.location.search);
        let viewParam = params.get('view');
        if (viewParam) {
          if (viewParam === 'settings') viewParam = 'pengaturan';
          if (validViews.includes(viewParam)) return viewParam;
        }

        const hash = window.location.hash.replace(/^#\/?/, '');
        if (hash) {
          const hashParams = new URLSearchParams(hash);
          let hashView = hashParams.get('view') || hash;
          if (hashView === 'settings') hashView = 'pengaturan';
          if (validViews.includes(hashView)) return hashView;
        }
      } catch (e) {}
      return null;
    }

    const isSidebarCollapsed = ref(false);
    const isErphrisMenuOpen = ref(true);
    const isLaporanMenuOpen = ref(true);
    const isDataMasterMenuOpen = ref(true);
    const previousView = ref('invoice-ap');

    function ensureMenuOpenForView(v) {
      if (!v) return;
      if (['invoice-ap', 'travel-event', 'penarikan-um', 'pertanggungjawaban-um', 'form', 'table'].includes(v)) {
        isErphrisMenuOpen.value = true;
      } else if (['laporan-invoice', 'laporan-travel', 'laporan-penarikan', 'laporan-pertanggungjawaban'].includes(v)) {
        isLaporanMenuOpen.value = true;
      } else if (['data-pegawai', 'data-bank', 'data-rekanan', 'data-dha', 'data-unit-kerja'].includes(v)) {
        isDataMasterMenuOpen.value = true;
      }
    }

    function getViewUrl(viewName) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('view', viewName);
        return `${url.pathname}${url.search}`;
      } catch (e) {
        return `?view=${encodeURIComponent(viewName)}`;
      }
    }

    function getViewRequiredPermission(viewName) {
      switch (viewName) {
        case 'form':
          return form && form.id ? 'form_edit' : 'form_create';
        case 'print':
          return 'print_disposisi';
        case 'data-pegawai':
        case 'data-bank':
        case 'data-rekanan':
        case 'data-dha':
        case 'data-unit-kerja':
          return 'manage_masters';
        case 'laporan-invoice':
        case 'laporan-travel':
        case 'laporan-penarikan':
        case 'laporan-pertanggungjawaban':
          return 'export_report';
        case 'travel-event':
        case 'penarikan-um':
        case 'pertanggungjawaban-um':
          return 'form_create';
        default:
          return null;
      }
    }

    function getPermissionName(permCode) {
      if (!permCode) return '';
      const item = rbacMatrixItems.value.find(m => m.code === permCode);
      return item ? item.name : permCode;
    }

    function canAccessView(viewName) {
      const reqPerm = getViewRequiredPermission(viewName);
      if (!reqPerm) return true;
      return hasPermission(reqPerm);
    }

    function navigateView(viewName, e) {
      if (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
          return;
        }
        if (typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
      }

      currentView.value = viewName;
      ensureMenuOpenForView(viewName);

      if (!canAccessView(viewName)) {
        const reqPerm = getViewRequiredPermission(viewName);
        const permName = getPermissionName(reqPerm);
        showToast(`Akses Ditolak (403 Forbidden): Peran "${currentUser.role || currentUser.roleKey}" tidak memiliki wewenang untuk membuka modul ini (${permName}).`, 'error');
      }

      try {
        const url = new URL(window.location.href);
        if (url.searchParams.get('view') !== viewName) {
          url.searchParams.set('view', viewName);
          window.history.pushState({ view: viewName }, '', url.toString());
        }
      } catch (err) {
        try {
          window.location.hash = `view=${viewName}`;
        } catch (_) {}
      }
    }

    function handleDropdownToggle(menuKey, e) {
      if (e && (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1)) {
        return;
      }
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      if (menuKey === 'erphris') {
        isErphrisMenuOpen.value = !isErphrisMenuOpen.value;
      } else if (menuKey === 'laporan') {
        isLaporanMenuOpen.value = !isLaporanMenuOpen.value;
      } else if (menuKey === 'datamaster') {
        isDataMasterMenuOpen.value = !isDataMasterMenuOpen.value;
      }
    }

    const initialViewFromUrl = getViewFromUrl();
    const currentView = ref(initialViewFromUrl || 'dashboard');
    const activeTab = currentView;
    if (initialViewFromUrl) {
      ensureMenuOpenForView(initialViewFromUrl);
    }

    watch(currentView, (newView) => {
      if (newView) {
        ensureMenuOpenForView(newView);
        try {
          const url = new URL(window.location.href);
          if (url.searchParams.get('view') !== newView) {
            url.searchParams.set('view', newView);
            window.history.pushState({ view: newView }, '', url.toString());
          }
        } catch (_) {}
      }
    });
    const showUserMenu = ref(false);
    const currentTheme = ref('light');
    const isOnline = ref(false);
    const isSubmitting = ref(false);
    const docDuplicateWarning = ref('');

    const currentUser = reactive({
      name: 'Ahmad Fauzi',
      nip: '19880412 201202 1 002',
      role: 'Pelaksana Madya Keuangan',
      satker: 'Unit Manajemen Keuangan KPw BI Jember',
      email: 'ahmad.fauzi@bi.go.id'
    });

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

    const userRoles = ref([
      {
        key: 'super_admin',
        name: 'Super Admin',
        badge: 'tag-rose',
        color: '#e11d48',
        description: 'Akses penuh ke seluruh modul, konfigurasi sistem, audit log, serta pengelolaan pengguna & hak akses.',
        permissions: ['form_create', 'form_edit', 'form_delete', 'batch_verify', 'batch_approve', 'batch_disburse', 'print_disposisi', 'export_report', 'manage_masters', 'manage_users', 'system_settings']
      },
      {
        key: 'maker',
        name: 'Maker (Operator Keuangan)',
        badge: 'tag-navy',
        color: '#2563eb',
        description: 'Membuat batch transaksi, input invoice, alokasi COA, melampirkan berkas, dan mengajukan transaksi.',
        permissions: ['form_create', 'form_edit', 'print_disposisi', 'export_report', 'manage_masters']
      },
      {
        key: 'checker',
        name: 'Checker (Verifikator Keuangan)',
        badge: 'tag-amber',
        color: '#d97706',
        description: 'Memverifikasi keabsahan invoice, kepatuhan pajak/e-faktur, kelengkapan berkas, serta verifikasi COA/DHA.',
        permissions: ['batch_verify', 'print_disposisi', 'export_report', 'manage_masters']
      },
      {
        key: 'approver',
        name: 'Approver (Pejabat Penyetuju)',
        badge: 'tag-emerald',
        color: '#059669',
        description: 'Menyetujui transaksi, otorisasi penarikan/pembayaran, menandatangani Lembar Disposisi, dan pencairan batch.',
        permissions: ['batch_approve', 'batch_disburse', 'print_disposisi', 'export_report', 'manage_masters']
      },
      {
        key: 'auditor',
        name: 'Auditor (Pengawas Keuangan)',
        badge: 'tag-indigo',
        color: '#6366f1',
        description: 'Akses peninjauan riwayat transaksi dan audit trail keuangan tanpa wewenang mengubah data.',
        permissions: ['print_disposisi', 'export_report']
      }
    ]);

    const isMatrixDirty = ref(false);
    const matrixSearchKeyword = ref('');
    const matrixRoleFilter = ref('');

    let savedMatrixApp = null;
    try {
      const stored = localStorage.getItem('bi_erp_rbac_matrix');
      if (stored) savedMatrixApp = JSON.parse(stored);
    } catch (_) {}

    const rbacMatrixItems = ref(Array.isArray(savedMatrixApp) && savedMatrixApp.length > 0 ? savedMatrixApp : JSON.parse(JSON.stringify(DEFAULT_RBAC_MATRIX)));

    const filteredRbacMatrixItems = computed(() => {
      let list = rbacMatrixItems.value;
      if (matrixSearchKeyword.value && matrixSearchKeyword.value.trim()) {
        const q = matrixSearchKeyword.value.toLowerCase().trim();
        list = list.filter(item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q)
        );
      }
      return list;
    });

    function syncRolesPermissionsFromMatrix() {
      if (!Array.isArray(userRoles.value)) return;
      userRoles.value.forEach(r => {
        r.permissions = rbacMatrixItems.value
          .filter(m => Array.isArray(m.roles) && m.roles.includes(r.key))
          .map(m => m.code);
      });
    }

    function hasPermission(permissionCode) {
      const userRole = currentUser.roleKey || 'maker';
      const item = rbacMatrixItems.value.find(m => m.code === permissionCode);
      if (!item || !Array.isArray(item.roles)) return userRole === 'super_admin';
      return item.roles.includes(userRole);
    }

    function toggleRolePermission(item, roleKey) {
      if (roleKey === 'super_admin' && item.code === 'manage_users' && item.roles.includes('super_admin')) {
        showToast('Wewenang Manajemen Pengguna untuk Super Admin tidak boleh dikunci.', 'warning');
        return;
      }

      const idx = item.roles.indexOf(roleKey);
      if (idx > -1) {
        item.roles.splice(idx, 1);
        showToast(`Wewenang "${item.name}" untuk peran ${roleKey.toUpperCase()} telah dikunci.`, 'info');
      } else {
        item.roles.push(roleKey);
        showToast(`Wewenang "${item.name}" untuk peran ${roleKey.toUpperCase()} berhasil diizinkan.`, 'success');
      }

      isMatrixDirty.value = true;
      syncRolesPermissionsFromMatrix();
    }

    function bulkSetRolePermissions(roleKey, action) {
      if (action === 'allow_all') {
        rbacMatrixItems.value.forEach(item => {
          if (!item.roles.includes(roleKey)) {
            item.roles.push(roleKey);
          }
        });
        showToast(`Semua modul & wewenang telah diizinkan untuk peran ${roleKey.toUpperCase()}.`, 'success');
      } else if (action === 'deny_all') {
        rbacMatrixItems.value.forEach(item => {
          if (roleKey === 'super_admin' && item.code === 'manage_users') return;
          const idx = item.roles.indexOf(roleKey);
          if (idx > -1) item.roles.splice(idx, 1);
        });
        showToast(`Semua modul & wewenang telah dikunci untuk peran ${roleKey.toUpperCase()}.`, 'info');
      } else if (action === 'reset_default') {
        const defaultForRole = DEFAULT_RBAC_MATRIX.filter(d => d.roles.includes(roleKey)).map(d => d.code);
        rbacMatrixItems.value.forEach(item => {
          const shouldHave = defaultForRole.includes(item.code);
          const has = item.roles.includes(roleKey);
          if (shouldHave && !has) item.roles.push(roleKey);
          else if (!shouldHave && has) {
            if (roleKey === 'super_admin' && item.code === 'manage_users') return;
            const idx = item.roles.indexOf(roleKey);
            if (idx > -1) item.roles.splice(idx, 1);
          }
        });
        showToast(`Wewenang peran ${roleKey.toUpperCase()} berhasil dikembalikan ke standar default BI.`, 'info');
      }
      isMatrixDirty.value = true;
      syncRolesPermissionsFromMatrix();
    }

    async function saveRbacMatrix() {
      try {
        localStorage.setItem('bi_erp_rbac_matrix', JSON.stringify(rbacMatrixItems.value));
        try {
          await fetch('http://localhost:5000/api/users/rbac-matrix', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matrix: rbacMatrixItems.value })
          });
        } catch (_) {}
        isMatrixDirty.value = false;
        syncRolesPermissionsFromMatrix();
        showToast('Matriks Hak Akses (RBAC) berhasil disimpan dan diperbarui!', 'success');
      } catch (err) {
        showToast('Gagal menyimpan matriks hak akses: ' + err.message, 'error');
      }
    }

    async function resetRbacMatrixToDefault() {
      const confirmed = await showSweetConfirm({
        title: 'Reset Matriks Hak Akses?',
        html: 'Kembalikan seluruh matriks hak akses ke standar tata kelola <strong>Pengendalian Internal Bank Indonesia (Four-Eyes Principle / Maker-Checker-Approver)</strong>?',
        icon: 'warning',
        confirmButtonText: 'Ya, Reset ke Standar BI',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      rbacMatrixItems.value = JSON.parse(JSON.stringify(DEFAULT_RBAC_MATRIX));
      localStorage.setItem('bi_erp_rbac_matrix', JSON.stringify(rbacMatrixItems.value));
      try {
        await fetch('http://localhost:5000/api/users/rbac-matrix/reset', { method: 'POST' });
      } catch (_) {}
      isMatrixDirty.value = false;
      syncRolesPermissionsFromMatrix();
      showToast('Matriks Hak Akses berhasil dikembalikan ke standar default Bank Indonesia.', 'success');
    }

    function switchTestRole(roleKey) {
      const foundRole = userRoles.value.find(r => r.key === roleKey);
      if (!foundRole) return;
      currentUser.roleKey = roleKey;
      currentUser.role = foundRole.name;
      if (!canAccessView(currentView.value)) {
        showToast(`Sesi beralih ke peran ${foundRole.name}. Modul aktif "${currentView.value}" terkunci untuk peran ini.`, 'warning');
      } else {
        showToast(`Sesi beralih ke peran ${foundRole.name}. Wewenang aplikasi kini mengikuti RBAC matrix.`, 'info');
      }
    }

    function exportRbacMatrixCSV() {
      const headers = ['Kode Wewenang', 'Modul & Fungsi Wewenang', 'Deskripsi Regulasi', 'Super Admin', 'Maker', 'Checker', 'Approver', 'Auditor'];
      const rows = rbacMatrixItems.value.map(item => [
        `"${item.code}"`,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.description.replace(/"/g, '""')}"`,
        item.roles.includes('super_admin') ? 'Diizinkan' : 'Terkunci',
        item.roles.includes('maker') ? 'Diizinkan' : 'Terkunci',
        item.roles.includes('checker') ? 'Diizinkan' : 'Terkunci',
        item.roles.includes('approver') ? 'Diizinkan' : 'Terkunci',
        item.roles.includes('auditor') ? 'Diizinkan' : 'Terkunci'
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `RBAC_Matrix_Hak_Akses_BI_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Matriks Hak Akses (RBAC) berhasil diekspor ke file CSV.', 'success');
    }

    syncRolesPermissionsFromMatrix();
    const appSettings = reactive({
      prefixBatch: 'JR25 0',
      printHeaderBi: 'BANK INDONESIA - KANTOR PERWAKILAN JEMBER',
      printAlamat: 'Jl. Gajah Mada No. 248, Jember | Sistem Manajemen ERP Transaksi',
      autoBalanceCoa: true,
      checkDuplicateDoc: true
    });

    // ================= PENGATURAN CETAK (HURUF, MARGIN, UKURAN KERTAS, ORIENTASI) =================
    const defaultPrintSettings = {
      fontFamily: 'Courier new', // 'TimesNRCyrMT' | 'Frutiger45 ligth' | 'Arial' | 'sans-serif' | 'Times New Roman' | 'Courier new'
      fontSize: 11,              // in pt
      paperSize: 'A4',           // 'A4' | 'F4' | 'Letter' | 'Legal' | 'A5'
      orientation: 'portrait',   // 'portrait' | 'landscape'
      marginPreset: 'standar',   // 'standar' | 'sempit' | 'sedang' | 'custom'
      marginTop: 1.2,            // in cm
      marginBottom: 1.2,         // in cm
      marginLeft: 1.4,           // in cm
      marginRight: 1.4           // in cm
    };

    function getFontFamilyCss(family) {
      if (!family) return "'Courier New', Courier, monospace";
      const f = String(family).trim();
      switch (f) {
        case 'TimesNRCyrMT':
          return "'TimesNRCyrMT', 'Times New Roman', Times, serif";
        case 'Frutiger45 ligth':
        case 'frutiger':
          return "'Frutiger45 ligth', 'Frutiger 45 Light', 'Frutiger LT Std 45 Light', 'Frutiger', sans-serif";
        case 'Arial':
        case 'arial':
          return "'Arial', 'Helvetica Neue', Helvetica, sans-serif";
        case 'sans-serif':
          return "sans-serif, Arial";
        case 'Times New Roman':
        case 'times-new-roman':
          return "'Times New Roman', Times, serif";
        case 'Courier new':
        case 'courier-new':
        case 'standart':
        default:
          return "'Courier New', Courier, monospace";
      }
    }

    let savedPrintSettings = null;
    try {
      const stored = localStorage.getItem('bi_erp_print_settings');
      if (stored) {
        savedPrintSettings = JSON.parse(stored);
        if (!savedPrintSettings.fontSize) savedPrintSettings.fontSize = 11;
        // Normalisasi pilihan font lama ke 6 font resmi
        if (savedPrintSettings.fontFamily === 'standart') savedPrintSettings.fontFamily = 'Courier new';
        else if (savedPrintSettings.fontFamily === 'frutiger') savedPrintSettings.fontFamily = 'Frutiger45 ligth';
        else if (savedPrintSettings.fontFamily === 'arial') savedPrintSettings.fontFamily = 'Arial';
        // Otomatis konversi jika sebelumnya tersimpan dalam milimeter (> 5)
        if (savedPrintSettings && savedPrintSettings.marginTop && savedPrintSettings.marginTop > 5) {
          savedPrintSettings.marginTop = Number((savedPrintSettings.marginTop / 10).toFixed(1));
          savedPrintSettings.marginBottom = Number((savedPrintSettings.marginBottom / 10).toFixed(1));
          savedPrintSettings.marginLeft = Number((savedPrintSettings.marginLeft / 10).toFixed(1));
          savedPrintSettings.marginRight = Number((savedPrintSettings.marginRight / 10).toFixed(1));
        }
      }
    } catch (_) {}

    const printSettings = reactive(Object.assign({}, defaultPrintSettings, savedPrintSettings || {}));
    const showPrintConfigModal = ref(false);

    function getPageSizeCss(paperSize, orientation) {
      if (paperSize === 'F4') {
        return orientation === 'landscape' ? '330mm 215mm' : '215mm 330mm';
      }
      return `${paperSize} ${orientation}`;
    }

    function applyPrintSettingsToDOM() {
      if (typeof document === 'undefined') return;
      let styleEl = document.getElementById('bi-erp-dynamic-print-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'bi-erp-dynamic-print-styles';
        document.head.appendChild(styleEl);
      }

      const fontCss = getFontFamilyCss(printSettings.fontFamily);
      const sizeCss = getPageSizeCss(printSettings.paperSize, printSettings.orientation);
      const marginCss = `${printSettings.marginTop}cm ${printSettings.marginRight}cm ${printSettings.marginBottom}cm ${printSettings.marginLeft}cm`;
      const isFrutiger = printSettings.fontFamily === 'Frutiger45 ligth' || printSettings.fontFamily === 'frutiger';
      const fontSizePt = printSettings.fontSize || 11;

      styleEl.textContent = `
        @media print {
          @page {
            size: ${sizeCss} !important;
            margin: ${marginCss} !important;
          }
          .print-only .disposisi-sheet,
          .print-only .disposisi-sheet * {
            font-family: ${fontCss} !important;
            ${isFrutiger ? 'font-weight: 300 !important; letter-spacing: 0.15px;' : ''}
          }
          .print-only .disposisi-sheet {
            font-size: ${fontSizePt}pt !important;
          }
          .print-only .disposisi-table th,
          .print-only .disposisi-table td {
            font-family: ${fontCss} !important;
            font-size: ${fontSizePt}pt !important;
          }
          .print-only .disposisi-title {
            font-family: ${fontCss} !important;
          }
        }
      `;
    }

    const previewSheetStyle = computed(() => {
      const fontCss = getFontFamilyCss(printSettings.fontFamily);
      const fontSizePt = printSettings.fontSize || 11;
      return {
        fontFamily: fontCss,
        fontSize: `${fontSizePt}pt`,
        padding: `${printSettings.marginTop}cm ${printSettings.marginRight}cm ${printSettings.marginBottom}cm ${printSettings.marginLeft}cm`,
        maxWidth: printSettings.orientation === 'landscape' ? '1060px' : '840px'
      };
    });

    function applyMarginPreset(preset) {
      printSettings.marginPreset = preset;
      if (preset === 'standar') {
        printSettings.marginTop = 1.2;
        printSettings.marginBottom = 1.2;
        printSettings.marginLeft = 1.4;
        printSettings.marginRight = 1.4;
      } else if (preset === 'sempit') {
        printSettings.marginTop = 0.8;
        printSettings.marginBottom = 0.8;
        printSettings.marginLeft = 0.8;
        printSettings.marginRight = 0.8;
      } else if (preset === 'sedang') {
        printSettings.marginTop = 1.8;
        printSettings.marginBottom = 1.8;
        printSettings.marginLeft = 2.0;
        printSettings.marginRight = 2.0;
      }
      applyPrintSettingsToDOM();
    }

    function onCustomMarginChange() {
      printSettings.marginPreset = 'custom';
      applyPrintSettingsToDOM();
    }

    function openPrintConfigModal() {
      showPrintConfigModal.value = true;
    }

    function closePrintConfigModal() {
      showPrintConfigModal.value = false;
    }

    function savePrintSettings() {
      try {
        localStorage.setItem('bi_erp_print_settings', JSON.stringify(printSettings));
      } catch (_) {}
      applyPrintSettingsToDOM();
      showToast('Pengaturan cetak (huruf, margin, kertas & orientasi) berhasil disimpan.', 'success');
      showPrintConfigModal.value = false;
    }

    function resetPrintSettings() {
      Object.assign(printSettings, defaultPrintSettings);
      try {
        localStorage.setItem('bi_erp_print_settings', JSON.stringify(printSettings));
      } catch (_) {}
      applyPrintSettingsToDOM();
      showToast('Pengaturan cetak berhasil di-reset ke standar.', 'info');
    }

    function printWithCurrentSettings() {
      applyPrintSettingsToDOM();
      showPrintConfigModal.value = false;
      triggerPrint();
    }

    function previewPrintDocument() {
      applyPrintSettingsToDOM();
      if (typeof selectedDetailBatch !== 'undefined' && selectedDetailBatch && selectedDetailBatch.value) {
        loadBatchToForm(selectedDetailBatch.value);
      }
      setTimeout(() => {
        window.print();
      }, 50);
    }

    const liveTime = ref('');
    function updateClock() {
      const now = new Date();
      liveTime.value = new Intl.DateTimeFormat('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(now);
    }
    setInterval(updateClock, 1000);
    updateClock();

    function toggleTheme() {
      currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme.value);
      localStorage.setItem('bi_erp_theme', currentTheme.value);
      showToast(`Mode tema diubah ke ${currentTheme.value === 'dark' ? 'Gelap' : 'Terang'}`, 'info');
    }

    const ukerList = ref([
      'Fungsi Data, Statistik & Kajian Ekonomi',
      'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)',
      'Unit Manajemen Keuangan KPw BI Jember',
      'Seksi Kepatuhan & Manajemen Risiko',
      'Unit Operasional Sistem Pembayaran & PUR',
      'Unit Manajemen Logistik & Rumah Tangga',
      'Fungsi Kehumasan & Komunikasi Kebijakan',
      'Seksi Kehumasan & Sistem Informasi'
    ]);

    const rekananPresets = ref([]);

    const bankList = ref([
      'Bank Mandiri', 'Bank Rakyat Indonesia (BRI)', 'Bank Negara Indonesia (BNI)',
      'Bank Central Asia (BCA)', 'Bank Syariah Indonesia (BSI)', 'Bank Jatim', 'Bank Tabungan Negara (BTN)'
    ]);

    const tipePembayaranList = ref([
      'Tunai', 'BIFast', 'SKN', 'RTGS', 'SWIFT'
    ]);

    const jenisInvoiceList = ref([
      'Invoice Non matching', 'Invoice matching'
    ]);

    const dhaList = ref([]);

    const coaList = ref([
      '5.1.02.01 - Biaya Honorarium Narasumber / MC Kegiatan',
      '5.1.02.04 - Biaya Sewa Kendaraan Operasional & Transportasi',
      '5.1.03.01 - Biaya Konsumsi Kegiatan Rapat & Sarasehan',
      '5.2.01.05 - Biaya Bantuan Sosial / Santunan Program Prioritas',
      '5.1.04.02 - Biaya Fasilitasi Pelaksana Program Pendukung UMKM',
      '5.1.05.01 - Biaya Publikasi, Dokumentasi & Perlengkapan Acara'
    ]);

    const pejabatPengajuList = ref([]);

    const pejabatPenyetujuList = ref([]);

    const currentStep = ref(1);
    const invoiceApSubView = ref('form');
    const confirmCheck = ref(false);
    const historySearch = ref('');
    const historyStatusFilter = ref('all');

    const defaultPartners = [
      { name: 'CLARESTA ISLAMEY', wp: 'YUANGGA PUTRA PERDANA', npwp: '—', account: 'YUANGGA PUTRA PERDANA', accountNo: '12345678901234', address: '—', bank: 'Bank Mandiri' },
      { name: 'PT HASTA KARYA ROTENBI', wp: 'YUANGGA PUTRA PERDANA', npwp: '—', account: 'YUANGGA PUTRA PERDANA', accountNo: '012345678901234', address: '—', bank: 'Bank Mandiri' }
    ];

    const todayDateStr = new Date().toISOString().slice(0, 10);

    const form = reactive({
      id: null,
      noBatch: 'BT26-0003',
      noDokumen: '',
      tglTransaksi: todayDateStr,
      maker: 'Admin Finance',
      ldapDate: todayDateStr,
      processDate: todayDateStr,
      dariUker: '',
      kepadaUker: '',
      tipePembayaran: '',
      batchName: '',
      perihal: '',

      invoices: [
        { noInvoice: '', tglInvoice: '', nominal: 0 },
        { noInvoice: '', tglInvoice: '', nominal: 0 },
        { noInvoice: '', tglInvoice: '', nominal: 0 },
        { noInvoice: '', tglInvoice: '', nominal: 0 }
      ],
      noFakturPajak: '',
      tglFakturPajak: '',

      namaRekanan: '',
      alamatRekanan: '',
      nikNpwp: '',
      namaWpRekanan: '',
      newPartner: '',

      namaBank: '',
      namaRekening: '',
      nomorRekening: '',

      bebanAnggaranUker: '',
      jenisInvoice: '',
      namaDha: '',
      dhaBalance: 0,

      coas: [
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 }
      ],

      paidDate: '',
      pbtPrintDate: '',
      pbtSubmitDate: '',

      yangMengajukan: '',
      pangkatMengajukan: '',
      yangMenyetujui: '',
      pangkatMenyetujui: '',

      status: 'Menunggu proses'
    });

    const isTunai = computed(() => {
      return String(form.tipePembayaran || '').trim().toLowerCase() === 'tunai';
    });

    function onTipePembayaranChange() {
      if (isTunai.value) {
        form.namaBank = '';
        form.nomorRekening = '-';
        form.namaRekening = '-';
      } else {
        if (form.nomorRekening === '-') form.nomorRekening = '';
        if (form.namaRekening === '-') form.namaRekening = '';
      }
    }

    const unitKerjaOptions = computed(() => {
      if (masterUnitKerjaList.value && masterUnitKerjaList.value.length > 0) {
        return masterUnitKerjaList.value.map(u => ({
          val: u.nama_unit || u.nama,
          label: u.kode_unit ? `${u.kode_unit} - ${u.nama_unit || u.nama}` : (u.nama_unit || u.nama),
          kode: u.kode_unit || u.kode || '',
          nama: u.nama_unit || u.nama || ''
        }));
      }
      return ukerList.value.map(u => ({ val: u, label: u, kode: '', nama: u }));
    });

    watch(() => form.dariUker, (newVal) => {
      if (newVal && masterUnitKerjaList.value && masterUnitKerjaList.value.length > 0) {
        const matched = masterUnitKerjaList.value.find(u =>
          (u.kode_unit && u.kode_unit.toUpperCase() === String(newVal).toUpperCase()) ||
          (u.kode && u.kode.toUpperCase() === String(newVal).toUpperCase())
        );
        if (matched) {
          const canonical = matched.nama_unit || matched.nama;
          if (canonical && form.dariUker !== canonical) {
            form.dariUker = canonical;
          }
        }
      }
    }, { immediate: true });

    const initialBatches = [
      {
        id: 1,
        noBatch: 'JR25 00001',
        batch: 'JR25 00001',
        noDokumen: '27/12/JR/M.02/B',
        doc: '27/12/JR/M.02/B',
        tglTransaksi: '2025-01-03',
        date: '2025-01-03',
        processDate: '2025-01-03',
        dariUker: 'Fungsi Data, Statistik & Kajian Ekonomi',
        uker: 'Fungsi Data, Statistik & Kajian Ekonomi',
        namaRekanan: 'CLARESTA ISLAMEY',
        partner: 'CLARESTA ISLAMEY',
        perihal: 'REIMBURSE PEMBAYARAN SUVENIR SK BERUPA NECK PILLOW PERIODE TW 1 2025',
        tipePembayaran: 'SKN',
        payment: 'SKN',
        nominalTotal: 11249300,
        nominal: 11249300,
        status: 'Selesai',
        maker: 'Adam Masykur',
        invoices: [
          { noInvoice: 'INV-2025-01', tglInvoice: '2025-01-03', nominal: 11249300 },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 }
        ],
        coas: [
          { rangkaianCoa: '1-731001-861001-99-4500-102-014-040-1810-001-00000', nominal: 11249300 },
          { rangkaianCoa: '', nominal: 0 },
          { rangkaianCoa: '', nominal: 0 }
        ]
      },
      {
        id: 2,
        noBatch: 'JR25 00002',
        batch: 'JR25 00002',
        noDokumen: '27/12/JR/M.02/B',
        doc: '27/12/JR/M.02/B',
        tglTransaksi: '2025-01-03',
        date: '2025-01-03',
        processDate: '2025-01-03',
        dariUker: 'Fungsi Data, Statistik & Kajian Ekonomi',
        uker: 'Fungsi Data, Statistik & Kajian Ekonomi',
        namaRekanan: 'PT HASTA KARYA ROTENBI',
        partner: 'PT HASTA KARYA ROTENBI',
        perihal: 'PEMBAYARAN SUVENIR LIAISON PERIODE KE-2 TAHUN 2024',
        tipePembayaran: 'SKN',
        payment: 'SKN',
        nominalTotal: 23460000,
        nominal: 23460000,
        status: 'Menunggu proses',
        maker: 'Adam Masykur',
        invoices: [
          { noInvoice: 'INV-2025-02', tglInvoice: '2025-01-03', nominal: 23460000 },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 }
        ],
        coas: [
          { rangkaianCoa: '1-731001-861001-99-4500-102-014-040-1810-001-00000', nominal: 23460000 },
          { rangkaianCoa: '', nominal: 0 },
          { rangkaianCoa: '', nominal: 0 }
        ]
      }
    ];

    const cachedBatches = localStorage.getItem('bi_erp_batches');
    const batchList = ref(cachedBatches ? JSON.parse(cachedBatches) : JSON.parse(JSON.stringify(initialBatches)));

    watch(batchList, (newVal) => {
      localStorage.setItem('bi_erp_batches', JSON.stringify(newVal));
    }, { deep: true });

    // ================= STEP 2: AUTOCOMPLETE / SUGGESTION LIST REKANAN =================
    const isPartnerDropdownOpen = ref(false);
    const partnerSearchText = ref('');
    const activePartnerIndex = ref(-1);

    // List gabungan semua rekanan (default favorit + rekananPresets dari database)
    const allPartnerList = computed(() => {
      const list = [];
      const namesSeen = new Set();

      // 1. Rekanan Default / Pinned
      if (Array.isArray(defaultPartners)) {
        for (const d of defaultPartners) {
          const rawName = String(d.name || d.nama || '').trim();
          if (!rawName || namesSeen.has(rawName.toLowerCase())) continue;
          namesSeen.add(rawName.toLowerCase());

          const subParts = [];
          if (d.wp) subParts.push(`WP: ${d.wp}`);
          if (d.npwp && d.npwp !== '—') subParts.push(`NPWP: ${d.npwp}`);
          if (d.bank) subParts.push(d.bank);
          if (d.accountNo) subParts.push(`Rek: ${d.accountNo}`);

          list.push({
            id: 'def_' + rawName,
            nama: rawName,
            name: rawName,
            namaWp: d.wp || '',
            nikNpwp: (d.npwp === '—' || d.nikNpwp === '—') ? '' : (d.npwp || d.nikNpwp || ''),
            alamat: (d.address === '—' || d.alamat === '—') ? '' : (d.address || d.alamat || ''),
            bank: d.bank || '',
            rekening: String(d.accountNo || d.rekening || ''),
            atasNama: d.account || d.atasNama || '',
            isDefault: true,
            sub: subParts.join(' • ')
          });
        }
      }

      // 2. Rekanan dari Master Database (rekananPresets)
      if (Array.isArray(rekananPresets.value)) {
        for (const r of rekananPresets.value) {
          const rawName = String(r.nama || r.name || '').trim();
          if (!rawName || namesSeen.has(rawName.toLowerCase())) continue;
          namesSeen.add(rawName.toLowerCase());

          const subParts = [];
          if (r.namaWp && r.namaWp !== rawName) subParts.push(`WP: ${r.namaWp}`);
          if (r.nikNpwp && r.nikNpwp !== '—') subParts.push(`NPWP: ${r.nikNpwp}`);
          if (r.bank) subParts.push(r.bank);
          if (r.rekening) subParts.push(`Rek: ${r.rekening}`);

          list.push({
            id: r.id || rawName,
            nama: rawName,
            name: rawName,
            namaWp: r.namaWp || r.wp || '',
            nikNpwp: (r.nikNpwp === '—' || r.npwp === '—') ? '' : (r.nikNpwp || r.npwp || ''),
            alamat: (r.alamat === '—' || r.address === '—') ? '' : (r.alamat || r.address || ''),
            bank: r.bank || '',
            rekening: String(r.rekening || r.accountNo || ''),
            atasNama: r.atasNama || r.account || '',
            isDefault: false,
            sub: subParts.join(' • ')
          });
        }
      }

      return list;
    });

    // Filter rekanan berdasarkan teks input pencarian
    const filteredPartnerOptions = computed(() => {
      const q = (partnerSearchText.value || '').toLowerCase().trim();
      if (!q || q === '+ rekanan lainnya / input manual') {
        return allPartnerList.value;
      }
      return allPartnerList.value.filter(p => {
        return (p.nama && p.nama.toLowerCase().includes(q)) ||
               (p.namaWp && p.namaWp.toLowerCase().includes(q)) ||
               (p.nikNpwp && p.nikNpwp.toLowerCase().includes(q)) ||
               (p.alamat && p.alamat.toLowerCase().includes(q)) ||
               (p.rekening && p.rekening.toLowerCase().includes(q)) ||
               (p.bank && p.bank.toLowerCase().includes(q));
      });
    });

    // Batasi rendering hingga 80 item agar performa autocomplete sangat responsif
    const displayedPartnerOptions = computed(() => {
      return filteredPartnerOptions.value.slice(0, 80);
    });

    const exactPartnerMatch = computed(() => {
      const q = (partnerSearchText.value || '').toLowerCase().trim();
      if (!q) return null;
      return allPartnerList.value.find(p => p.nama.toLowerCase() === q);
    });

    function openPartnerDropdown() {
      isPartnerDropdownOpen.value = true;
      activePartnerIndex.value = -1;
    }

    function togglePartnerDropdown() {
      isPartnerDropdownOpen.value = !isPartnerDropdownOpen.value;
      if (isPartnerDropdownOpen.value) {
        activePartnerIndex.value = -1;
      }
    }

    function onPartnerInput() {
      isPartnerDropdownOpen.value = true;
      activePartnerIndex.value = -1;
      if (!partnerSearchText.value.trim()) {
        form.namaRekanan = '';
      }
    }

    function selectPartnerOption(item) {
      form.namaRekanan = item.nama;
      partnerSearchText.value = item.nama;
      isPartnerDropdownOpen.value = false;
      activePartnerIndex.value = -1;
      onPartnerChange();
    }

    function selectNewManualPartner() {
      form.namaRekanan = '__new';
      if (partnerSearchText.value && partnerSearchText.value.trim() && partnerSearchText.value !== '+ Rekanan lainnya / input manual') {
        form.newPartner = partnerSearchText.value.trim();
      }
      isPartnerDropdownOpen.value = false;
      activePartnerIndex.value = -1;
    }

    function clearPartnerSelection() {
      form.namaRekanan = '';
      form.newPartner = '';
      partnerSearchText.value = '';
      form.namaWpRekanan = '';
      form.alamatRekanan = '';
      form.nikNpwp = '';
      form.namaRekening = '';
      form.nomorRekening = '';
      activePartnerIndex.value = -1;
      isPartnerDropdownOpen.value = false;
    }

    function onPartnerKeydown(e) {
      if (!isPartnerDropdownOpen.value) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
          isPartnerDropdownOpen.value = true;
          return;
        }
      }

      const totalItems = displayedPartnerOptions.value.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activePartnerIndex.value < totalItems - 1) {
          activePartnerIndex.value++;
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activePartnerIndex.value > -1) {
          activePartnerIndex.value--;
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activePartnerIndex.value === -1) {
          selectNewManualPartner();
        } else if (activePartnerIndex.value >= 0 && activePartnerIndex.value < totalItems) {
          selectPartnerOption(displayedPartnerOptions.value[activePartnerIndex.value]);
        } else if (exactPartnerMatch.value) {
          selectPartnerOption(exactPartnerMatch.value);
        } else if (totalItems > 0) {
          selectPartnerOption(displayedPartnerOptions.value[0]);
        } else {
          selectNewManualPartner();
        }
      } else if (e.key === 'Escape') {
        isPartnerDropdownOpen.value = false;
      }
    }

    // Sinkronisasi partnerSearchText dengan form.namaRekanan
    watch(() => form.namaRekanan, (newVal) => {
      if (newVal === '__new') {
        partnerSearchText.value = form.newPartner || '+ Rekanan lainnya / input manual';
      } else if (newVal) {
        partnerSearchText.value = newVal;
      } else {
        if (!isPartnerDropdownOpen.value) {
          partnerSearchText.value = '';
        }
      }
    }, { immediate: true });

    watch(() => form.newPartner, (newVal) => {
      if (form.namaRekanan === '__new') {
        partnerSearchText.value = newVal || '+ Rekanan lainnya / input manual';
      }
    });

    function onPartnerChange() {
      if (form.namaRekanan === '__new') {
        return;
      }
      const p = allPartnerList.value.find(x => x.nama === form.namaRekanan || x.name === form.namaRekanan) ||
                defaultPartners.find(x => x.name === form.namaRekanan) ||
                rekananPresets.value.find(x => x.nama === form.namaRekanan);
      if (p) {
        form.namaWpRekanan = p.namaWp || p.wp || '';
        form.nikNpwp = (p.npwp === '—' || p.nikNpwp === '—') ? '' : (p.nikNpwp || p.npwp || '');
        form.namaRekening = p.atasNama || p.account || '';
        form.nomorRekening = String(p.rekening || p.accountNo || '');
        form.alamatRekanan = (p.alamat === '—' || p.address === '—') ? '' : (p.alamat || p.address || '');
        if (p.bank) form.namaBank = p.bank;
        showToast(`Data rekanan "${p.nama || p.name}" berhasil dimuat otomatis`, 'info');
      }
    }

    const chosenPartner = computed(() => {
      if (form.namaRekanan === '__new') {
        return form.newPartner || (partnerSearchText.value !== '+ Rekanan lainnya / input manual' ? partnerSearchText.value : '');
      }
      return form.namaRekanan;
    });

    // ================= STEP 3: SEARCHABLE DROPDOWN UNTUK PENGAJU & PENYETUJU =================
    const isPengajuDropdownOpen = ref(false);
    const pengajuSearchText = ref(form.yangMengajukan || '');
    const activePengajuIndex = ref(-1);

    const isPenyetujuDropdownOpen = ref(false);
    const penyetujuSearchText = ref(form.yangMenyetujui || '');
    const activePenyetujuIndex = ref(-1);

    // Unified list of all pegawai from pegawaiList + fallback/pejabat
    const allPegawaiOptions = computed(() => {
      const map = new Map();

      const seedList = (pegawaiList.value && pegawaiList.value.length > 0)
        ? pegawaiList.value
        : [
            { id: 1, nip: '19880412', nama: 'Ahmad Fauzi, S.E.', pangkat: 'Pelaksana Madya Keuangan', jabatan: 'Maker', uker: 'Unit Manajemen Keuangan KPw BI Jember', peran: 'Pejabat Pengaju' },
            { id: 2, nip: '16244', nama: 'A Robith Mubarok', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju' },
            { id: 3, nip: '17379', nama: 'Achmad Maulidi Effendi', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju' },
            { id: 4, nip: '14156', nama: 'Adam Masykur', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju' },
            { id: 5, nip: '17388', nama: 'Adhytya Bagus Rizkianto', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju' },
            { id: 6, nip: '16873', nama: 'Adi Purnomo', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju' },
            { id: 7, nip: '15133', nama: 'Agapito Ganesha J.M.N', pangkat: 'Asisten Manajer', jabatan: 'Checker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Penyetuju' },
            { id: 8, nip: '19820511', nama: 'Bambang Prasetyo, S.E., M.M.', pangkat: 'Asisten Manajer Pengadaan', jabatan: 'Maker', uker: 'Unit Manajemen Logistik & RT', peran: 'Pejabat Pengaju' },
            { id: 9, nip: '19790315', nama: 'Dra. Sri Wahyuni, M.Si.', pangkat: 'Kepala Seksi Keuangan & Akuntansi', jabatan: 'Signer', uker: 'Unit Manajemen Keuangan', peran: 'Pejabat Penyetuju' },
            { id: 10, nip: '19750820', nama: 'Ir. Gunawan Santoso, M.M.', pangkat: 'Deputi Kepala Perwakilan KPw BI Jember', jabatan: 'Approver', uker: 'Pimpinan KPw BI Jember', peran: 'Pejabat Penyetuju' },
            { id: 11, nip: '19780104', nama: 'H. Mochammad Arifin, S.E., Ak.', pangkat: 'Manajer Operasional KPw BI Jember', jabatan: 'Signer', uker: 'Unit Operasional', peran: 'Pejabat Penyetuju' }
          ];

      for (const p of seedList) {
        const nama = String(p.nama || '').trim();
        if (!nama) continue;
        if (!map.has(nama.toLowerCase())) {
          map.set(nama.toLowerCase(), {
            id: p.id || nama,
            nama: nama,
            pangkat: p.pangkat || p.jabatan || 'Pelaksana',
            jabatan: p.jabatan || '',
            nip: p.nip || '',
            uker: p.uker || '',
            peran: p.peran || ''
          });
        }
      }

      if (Array.isArray(pejabatPengajuList.value)) {
        for (const p of pejabatPengajuList.value) {
          const nama = String(p.nama || '').trim();
          if (!nama || map.has(nama.toLowerCase())) continue;
          map.set(nama.toLowerCase(), {
            id: 'pengaju_' + nama,
            nama: nama,
            pangkat: p.pangkat || 'Pelaksana',
            jabatan: '',
            nip: '',
            uker: '',
            peran: 'Pejabat Pengaju'
          });
        }
      }

      if (Array.isArray(pejabatPenyetujuList.value)) {
        for (const p of pejabatPenyetujuList.value) {
          const nama = String(p.nama || '').trim();
          if (!nama || map.has(nama.toLowerCase())) continue;
          map.set(nama.toLowerCase(), {
            id: 'penyetuju_' + nama,
            nama: nama,
            pangkat: p.pangkat || 'Pejabat Penyetuju',
            jabatan: '',
            nip: '',
            uker: '',
            peran: 'Pejabat Penyetuju'
          });
        }
      }

      return Array.from(map.values());
    });

    const filteredPengajuOptions = computed(() => {
      const q = (pengajuSearchText.value || '').toLowerCase().trim();
      if (!q) return allPegawaiOptions.value;
      return allPegawaiOptions.value.filter(p =>
        (p.nama && p.nama.toLowerCase().includes(q)) ||
        (p.pangkat && p.pangkat.toLowerCase().includes(q)) ||
        (p.nip && String(p.nip).toLowerCase().includes(q)) ||
        (p.jabatan && p.jabatan.toLowerCase().includes(q))
      );
    });

    const displayedPengajuOptions = computed(() => {
      return filteredPengajuOptions.value.slice(0, 60);
    });

    const filteredPenyetujuOptions = computed(() => {
      const q = (penyetujuSearchText.value || '').toLowerCase().trim();
      if (!q) return allPegawaiOptions.value;
      return allPegawaiOptions.value.filter(p =>
        (p.nama && p.nama.toLowerCase().includes(q)) ||
        (p.pangkat && p.pangkat.toLowerCase().includes(q)) ||
        (p.nip && String(p.nip).toLowerCase().includes(q)) ||
        (p.jabatan && p.jabatan.toLowerCase().includes(q))
      );
    });

    const displayedPenyetujuOptions = computed(() => {
      return filteredPenyetujuOptions.value.slice(0, 60);
    });

    function openPengajuDropdown() {
      isPengajuDropdownOpen.value = true;
      isPenyetujuDropdownOpen.value = false;
      activePengajuIndex.value = -1;
    }

    function togglePengajuDropdown() {
      isPengajuDropdownOpen.value = !isPengajuDropdownOpen.value;
      isPenyetujuDropdownOpen.value = false;
      if (isPengajuDropdownOpen.value) {
        activePengajuIndex.value = -1;
      }
    }

    function onPengajuInput() {
      isPengajuDropdownOpen.value = true;
      activePengajuIndex.value = -1;
      form.yangMengajukan = pengajuSearchText.value;
      const matched = allPegawaiOptions.value.find(p => p.nama.toLowerCase() === (pengajuSearchText.value || '').toLowerCase().trim());
      if (matched) {
        form.pangkatMengajukan = matched.pangkat;
      }
    }

    function selectPengaju(item) {
      form.yangMengajukan = item.nama;
      form.pangkatMengajukan = item.pangkat;
      pengajuSearchText.value = item.nama;
      isPengajuDropdownOpen.value = false;
      activePengajuIndex.value = -1;
      showToast(`Yang mengajukan: ${item.nama} (${item.pangkat})`, 'info');
    }

    function clearPengaju() {
      form.yangMengajukan = '';
      form.pangkatMengajukan = '';
      pengajuSearchText.value = '';
      activePengajuIndex.value = -1;
      isPengajuDropdownOpen.value = false;
    }

    function onPengajuKeydown(e) {
      if (!isPengajuDropdownOpen.value) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
          isPengajuDropdownOpen.value = true;
          return;
        }
      }
      const total = displayedPengajuOptions.value.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activePengajuIndex.value < total - 1) activePengajuIndex.value++;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activePengajuIndex.value > 0) activePengajuIndex.value--;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activePengajuIndex.value >= 0 && activePengajuIndex.value < total) {
          selectPengaju(displayedPengajuOptions.value[activePengajuIndex.value]);
        } else if (total > 0) {
          selectPengaju(displayedPengajuOptions.value[0]);
        }
      } else if (e.key === 'Escape') {
        isPengajuDropdownOpen.value = false;
      }
    }

    function openPenyetujuDropdown() {
      isPenyetujuDropdownOpen.value = true;
      isPengajuDropdownOpen.value = false;
      activePenyetujuIndex.value = -1;
    }

    function togglePenyetujuDropdown() {
      isPenyetujuDropdownOpen.value = !isPenyetujuDropdownOpen.value;
      isPengajuDropdownOpen.value = false;
      if (isPenyetujuDropdownOpen.value) {
        activePenyetujuIndex.value = -1;
      }
    }

    function onPenyetujuInput() {
      isPenyetujuDropdownOpen.value = true;
      activePenyetujuIndex.value = -1;
      form.yangMenyetujui = penyetujuSearchText.value;
      const matched = allPegawaiOptions.value.find(p => p.nama.toLowerCase() === (penyetujuSearchText.value || '').toLowerCase().trim());
      if (matched) {
        form.pangkatMenyetujui = matched.pangkat;
      }
    }

    function selectPenyetuju(item) {
      form.yangMenyetujui = item.nama;
      form.pangkatMenyetujui = item.pangkat;
      penyetujuSearchText.value = item.nama;
      isPenyetujuDropdownOpen.value = false;
      activePenyetujuIndex.value = -1;
      showToast(`Yang menyetujui: ${item.nama} (${item.pangkat})`, 'info');
    }

    function clearPenyetuju() {
      form.yangMenyetujui = '';
      form.pangkatMenyetujui = '';
      penyetujuSearchText.value = '';
      activePenyetujuIndex.value = -1;
      isPenyetujuDropdownOpen.value = false;
    }

    function onPenyetujuKeydown(e) {
      if (!isPenyetujuDropdownOpen.value) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
          isPenyetujuDropdownOpen.value = true;
          return;
        }
      }
      const total = displayedPenyetujuOptions.value.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activePenyetujuIndex.value < total - 1) activePenyetujuIndex.value++;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activePenyetujuIndex.value > 0) activePenyetujuIndex.value--;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activePenyetujuIndex.value >= 0 && activePenyetujuIndex.value < total) {
          selectPenyetuju(displayedPenyetujuOptions.value[activePenyetujuIndex.value]);
        } else if (total > 0) {
          selectPenyetuju(displayedPenyetujuOptions.value[0]);
        }
      } else if (e.key === 'Escape') {
        isPenyetujuDropdownOpen.value = false;
      }
    }

    watch(() => form.yangMengajukan, (val) => {
      pengajuSearchText.value = val || '';
    });

    watch(() => form.yangMenyetujui, (val) => {
      penyetujuSearchText.value = val || '';
    });

    function formatRupiah(val) {
      if (val === null || val === undefined || val === '') return 'Rp 0';
      const n = Number(val) || 0;
      const hasDecimal = n % 1 !== 0;
      return 'Rp ' + new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: hasDecimal ? 2 : 0,
        maximumFractionDigits: 2
      }).format(n);
    }

    function formatRupiahInput(val) {
      if (val === null || val === undefined || val === '') return '';
      const n = Number(val);
      if (isNaN(n)) return '';
      const hasDecimal = n % 1 !== 0;
      return 'Rp ' + new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: hasDecimal ? 2 : 0,
        maximumFractionDigits: 2
      }).format(n);
    }

    function parseRupiahInput(rawStr) {
      if (!rawStr) return 0;
      let s = String(rawStr).trim().replace(/^Rp\s*/i, '').replace(/\s+/g, '');
      if (!s) return 0;
      s = s.replace(/\./g, '').replace(/,/g, '.');
      const num = parseFloat(s);
      return isNaN(num) ? 0 : num;
    }

    function formatFromRawString(rawStr) {
      if (!rawStr) return '';
      let s = String(rawStr).replace(/^Rp\s*/i, '').trim();
      if (!s) return '';
      const hasComma = s.includes(',');
      const parts = s.split(',');
      const intDigits = parts[0].replace(/\D/g, '');
      const decDigits = parts.length > 1 ? parts[1].replace(/\D/g, '').slice(0, 2) : null;
      if (!intDigits && decDigits === null) return '';
      const formattedInt = intDigits ? new Intl.NumberFormat('id-ID').format(Number(intDigits)) : '0';
      if (hasComma) {
        return 'Rp ' + formattedInt + ',' + (decDigits !== null ? decDigits : '');
      }
      return 'Rp ' + formattedInt;
    }

    function handleInvoiceNominalInput(e, idx) {
      const el = e.target;
      const raw = el.value;
      if (!raw || !raw.replace(/^Rp\s*/i, '').trim()) {
        form.invoices[idx].nominal = 0;
        el.value = '';
        return;
      }
      const formatted = formatFromRawString(raw);
      const numValue = parseRupiahInput(formatted);
      form.invoices[idx].nominal = numValue;

      const cursorPos = el.selectionEnd;
      const oldLength = raw.length;
      el.value = formatted;
      const newLength = formatted.length;
      const newPos = Math.max(3, cursorPos + (newLength - oldLength));
      try {
        el.setSelectionRange(newPos, newPos);
      } catch (err) {}
    }

    function handleInvoiceNominalBlur(e, idx) {
      const num = form.invoices[idx].nominal || 0;
      e.target.value = formatRupiah(num);
    }

    function handleCoaNominalInput(e, cIdx) {
      const el = e.target;
      const raw = el.value;
      if (!raw || !raw.replace(/^Rp\s*/i, '').trim()) {
        form.coas[cIdx].nominal = 0;
        el.value = '';
        return;
      }
      const formatted = formatFromRawString(raw);
      const numValue = parseRupiahInput(formatted);
      form.coas[cIdx].nominal = numValue;

      const cursorPos = el.selectionEnd;
      const oldLength = raw.length;
      el.value = formatted;
      const newLength = formatted.length;
      const newPos = Math.max(3, cursorPos + (newLength - oldLength));
      try {
        el.setSelectionRange(newPos, newPos);
      } catch (err) {}
    }

    function handleCoaNominalBlur(e, cIdx) {
      const num = form.coas[cIdx].nominal || 0;
      e.target.value = formatRupiah(num);
    }

    function handleDhaAnggaranInput(e) {
      const el = e.target;
      const raw = el.value;
      if (!raw || !raw.replace(/^Rp\s*/i, '').trim()) {
        dhaForm.anggaran = 0;
        el.value = '';
        return;
      }
      const formatted = formatFromRawString(raw);
      const numValue = parseRupiahInput(formatted);
      dhaForm.anggaran = numValue;

      const cursorPos = el.selectionEnd;
      const oldLength = raw.length;
      el.value = formatted;
      const newLength = formatted.length;
      const newPos = Math.max(3, cursorPos + (newLength - oldLength));
      try {
        el.setSelectionRange(newPos, newPos);
      } catch (err) {}
    }

    function handleDhaAnggaranBlur(e) {
      const num = dhaForm.anggaran || 0;
      e.target.value = formatRupiah(num);
    }

    function handleNominalFocus(e) {
      try {
        e.target.select();
      } catch (err) {}
    }

    function formatCompactRupiah(v) {
      v = Number(v) || 0;
      if (v >= 1e9) return 'Rp ' + (v / 1e9).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' M';
      if (v >= 1e6) return 'Rp ' + (v / 1e6).toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' jt';
      return formatRupiah(v);
    }

    function formatShortDate(v) {
      if (!v) return '—';
      const d = new Date(v.includes('T') ? v : v + 'T00:00:00');
      return isNaN(d) ? v : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const invoiceTotal = computed(() => {
      return form.invoices.reduce((sum, inv) => sum + Math.max(0, Number(inv.nominal) || 0), 0);
    });

    const invoiceCount = computed(() => {
      return form.invoices.filter(inv => String(inv.noInvoice || '').trim() || (Number(inv.nominal) || 0) > 0).length;
    });

    const coaTotal = computed(() => {
      return form.coas.reduce((sum, c) => sum + Math.max(0, Number(c.nominal) || 0), 0);
    });

    const coaDiff = computed(() => {
      return coaTotal.value - invoiceTotal.value;
    });

    const coaStatus = computed(() => {
      if (coaTotal.value === 0) return 'Belum diisi';
      return Math.abs(coaDiff.value) < 1 ? 'Sesuai' : 'Perlu dicek';
    });

    function validateStep1() {
      const ok = !!String(form.noDokumen || '').trim() &&
                 !!String(form.tglTransaksi || '').trim() &&
                 !!String(form.dariUker || '').trim() &&
                 !!String(form.perihal || '').trim();
      if (!ok) {
        showToast('Data belum lengkap! Harap lengkapi No Dokumen, Tanggal, Dari Uker, dan Perihal.', 'warning');
        return false;
      }
      return true;
    }

    function validateStep2() {
      const partner = chosenPartner.value;
      const count = invoiceCount.value;
      const total = invoiceTotal.value;
      if (!partner) {
        showToast('Data belum lengkap! Pilih atau masukkan nama rekanan terlebih dahulu.', 'warning');
        return false;
      }
      if (count === 0 || total <= 0) {
        showToast('Data belum lengkap! Isi minimal satu nomor invoice dan nominal yang valid.', 'warning');
        return false;
      }
      return true;
    }

    function setStep(n) {
      if (n > currentStep.value) {
        if (currentStep.value === 1 && !validateStep1()) return;
        if (currentStep.value === 2 && !validateStep2()) return;
      }
      currentStep.value = Math.max(1, Math.min(4, n));
    }

    function nextStep() {
      if (currentStep.value === 1 && !validateStep1()) return;
      if (currentStep.value === 2 && !validateStep2()) return;
      setStep(currentStep.value + 1);
    }

    function prevStep() {
      setStep(currentStep.value - 1);
    }

    function jumpStep(n) {
      setStep(n);
    }

    function clearInvoices() {
      form.invoices.forEach(inv => {
        inv.noInvoice = '';
        inv.tglInvoice = '';
        inv.nominal = 0;
      });
      showToast('Data invoice dibersihkan.', 'info');
    }

    function resetFormBatchDirect() {
      if (!hasPermission('form_create')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses membuat batch baru.', 'warning');
        return;
      }
      confirmClear();
      const nextNum = batchList.value.length + 1;
      form.noBatch = `BT26-${String(nextNum).padStart(4, '0')}`;
      form.maker = currentUser.name || 'Admin Finance';
      form.tglTransaksi = new Date().toISOString().slice(0, 10);
      form.ldapDate = new Date().toISOString().slice(0, 10);
      form.processDate = new Date().toISOString().slice(0, 10);
      form.namaRekanan = '';
      form.newPartner = '';
      partnerSearchText.value = '';
      isPartnerDropdownOpen.value = false;
      form.yangMengajukan = '';
      form.pangkatMengajukan = '';
      form.yangMenyetujui = '';
      form.pangkatMenyetujui = '';
      pengajuSearchText.value = '';
      penyetujuSearchText.value = '';
      isPengajuDropdownOpen.value = false;
      isPenyetujuDropdownOpen.value = false;
      confirmCheck.value = false;
      form.coas = [
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 }
      ];
      currentStep.value = 1;
    }

    async function resetFormBatch() {
      const confirmed = await showSweetConfirm({
        title: 'Kosongkan Formulir?',
        html: 'Apakah Anda yakin ingin <strong>mengosongkan seluruh field isian</strong> pada formulir batch ini?',
        icon: 'question',
        confirmButtonText: '<i class="bi bi-eraser me-1"></i> Ya, Kosongkan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      resetFormBatchDirect();
      showToast('Form telah direset.', 'info');
    }

    async function saveDraftBatch() {
      if (!hasPermission('form_create') && !hasPermission('form_edit')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses menyimpan draft batch.', 'error');
        return;
      }
      if (!form.noDokumen && !form.perihal && !chosenPartner.value) {
        showToast('Isi setidaknya nomor dokumen, perihal, atau rekanan sebelum menyimpan draft.', 'warning');
        return;
      }
      form.status = 'Draft';
      form.namaRekanan = chosenPartner.value || form.namaRekanan || 'Draft Rekanan';
      if (!form.noDokumen) form.noDokumen = `DRAFT-${Date.now().toString().slice(-6)}`;
      if (!form.perihal) form.perihal = 'Draft Transaksi Invoice AP';
      if (!form.tglTransaksi) form.tglTransaksi = new Date().toISOString().slice(0, 10);
      if (!form.dariUker) form.dariUker = 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)';
      if (!form.tipePembayaran) form.tipePembayaran = 'Transfer Bank Antar Rekening';
      if (!form.namaBank) form.namaBank = 'Bank Mandiri';

      isSubmitting.value = true;
      try {
        if (isOnline.value) {
          const payload = JSON.parse(JSON.stringify(form));
          payload.nominalTotal = invoiceTotal.value;
          let res, data;
          if (form.id) {
            res = await fetch(`${API_BASE}/batches/${form.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            data = await res.json();
          } else {
            res = await fetch(`${API_BASE}/batches`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            data = await res.json();
            if (data.data && data.data.id) form.id = data.data.id;
            if (data.data && data.data.noBatch) form.noBatch = data.data.noBatch;
          }
          if (!res.ok) throw new Error(data.message || 'Gagal menyimpan draft ke database');

          await checkOnlineStatus();
          showToast(data.message || `Draft batch ${form.noBatch} berhasil disimpan ke database!`, 'success');
        } else {
          if (!form.noBatch) {
            form.noBatch = `BT26-${String(batchList.value.length + 1).padStart(4, '0')}`;
          }
          const idx = batchList.value.findIndex(b => (b.noBatch || b.batch) === form.noBatch);
          const data = JSON.parse(JSON.stringify(form));
          data.nominalTotal = invoiceTotal.value;
          data.nominal = invoiceTotal.value;
          data.partner = data.namaRekanan;
          data.doc = data.noDokumen;
          data.date = data.processDate || data.tglTransaksi;
          if (idx >= 0) {
            batchList.value[idx] = data;
          } else {
            data.id = batchList.value.length ? Math.max(...batchList.value.map(x => x.id || 0)) + 1 : 1;
            batchList.value.unshift(data);
          }
          showToast(`Draft batch ${data.noBatch} tersimpan lokal (Server offline).`, 'info');
        }
      } catch (err) {
        showToast(err.message || 'Gagal menyimpan draft ke server', 'error');
      } finally {
        isSubmitting.value = false;
      }
    }

    async function saveCompleteBatch() {
      const reqPerm = form.id ? 'form_edit' : 'form_create';
      if (!hasPermission(reqPerm)) {
        showToast(`Akses Dibatasi: Peran Anda tidak memiliki hak akses untuk menyimpan batch (${getPermissionName(reqPerm)}).`, 'error');
        return;
      }
      if (!validateStep1()) { setStep(1); return; }
      if (!validateStep2()) { setStep(2); return; }
      if (!confirmCheck.value) {
        showToast('Data belum lengkap! Centang konfirmasi kelengkapan dokumen sebelum menyimpan.', 'warning');
        return;
      }

      form.status = 'Menunggu proses';
      form.namaRekanan = chosenPartner.value || form.namaRekanan;

      // Sinkronisasi data rekening & rekanan dari preset jika belum terisi
      if (chosenPartner.value && Array.isArray(allPartnerList.value)) {
        const p = allPartnerList.value.find(x => x.nama === chosenPartner.value);
        if (p) {
          if (!form.namaBank && p.bank) form.namaBank = p.bank;
          if (!form.nomorRekening && p.rekening) form.nomorRekening = String(p.rekening);
          if (!form.namaRekening && p.atasNama) form.namaRekening = p.atasNama;
          if (!form.alamatRekanan && p.alamat && p.alamat !== '—') form.alamatRekanan = p.alamat;
          if (!form.nikNpwp && p.nikNpwp && p.nikNpwp !== '—') form.nikNpwp = p.nikNpwp;
          if (!form.namaWpRekanan && p.namaWp) form.namaWpRekanan = p.namaWp;
        }
      }

      if (!form.namaBank) form.namaBank = isTunai.value ? 'Kas / Tunai' : 'Bank Mandiri';
      if (!form.tipePembayaran) form.tipePembayaran = 'Transfer Bank Antar Rekening';
      if (!form.bebanAnggaranUker) form.bebanAnggaranUker = form.dariUker || 'Unit Manajemen Keuangan KPw BI Jember';
      if (!form.jenisInvoice) form.jenisInvoice = 'Invoice Non PO / Kontrak Langsung';
      if (!form.tglTransaksi) form.tglTransaksi = new Date().toISOString().slice(0, 10);

      // Validasi alokasi COA jika user telah mengisi alokasi
      const totInv = invoiceTotal.value;
      const totCoa = coaTotal.value;
      if (totCoa > 0 && Math.abs(coaDiff.value) >= 1) {
        showToast(`Total alokasi COA (${formatRupiah(totCoa)}) belum seimbang dengan total invoice (${formatRupiah(totInv)}). Periksa kembali di Langkah 4.`, 'warning');
        setStep(4);
        return;
      }

      isSubmitting.value = true;
      try {
        if (isOnline.value) {
          const payload = JSON.parse(JSON.stringify(form));
          payload.namaRekanan = form.namaRekanan;
          payload.status = 'Menunggu proses';
          payload.nominalTotal = totInv;
          payload.nominal = totInv;

          let res, data;
          if (form.id) {
            res = await fetch(`${API_BASE}/batches/${form.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            data = await res.json();
          } else {
            res = await fetch(`${API_BASE}/batches`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            data = await res.json();
            if (data.data && data.data.id) form.id = data.data.id;
            if (data.data && data.data.noBatch) form.noBatch = data.data.noBatch;
          }
          if (!res.ok) throw new Error(data.message || 'Gagal menyimpan batch ke database');

          await checkOnlineStatus();
          showToast('Data berhasil disimpan.', 'success');
          invoiceApSubView.value = 'history';
        } else {
          // Fallback offline
          if (!form.noBatch) {
            form.noBatch = `BT26-${String(batchList.value.length + 1).padStart(4, '0')}`;
          }
          const idx = batchList.value.findIndex(b => (b.noBatch || b.batch) === form.noBatch);
          const data = JSON.parse(JSON.stringify(form));
          data.nominalTotal = totInv;
          data.nominal = totInv;
          data.partner = data.namaRekanan;
          data.doc = data.noDokumen;
          data.date = data.processDate || data.tglTransaksi;
          if (idx >= 0) {
            batchList.value[idx] = data;
          } else {
            data.id = batchList.value.length ? Math.max(...batchList.value.map(x => x.id || 0)) + 1 : 1;
            batchList.value.unshift(data);
          }
          showToast(`Batch ${data.noBatch} berhasil disimpan (Penyimpanan lokal - Server offline).`, 'warning');
          invoiceApSubView.value = 'history';
        }
      } catch (err) {
        showToast(err.message || 'Gagal menyimpan batch ke database server', 'error');
      } finally {
        isSubmitting.value = false;
      }
    }

    function openBatchInForm(b) {
      loadBatchToForm(b);
      form.noBatch = b.noBatch || b.batch || '';
      form.noDokumen = b.noDokumen || b.doc || '';
      form.tglTransaksi = b.tglTransaksi || b.date || '';
      form.processDate = b.processDate || b.date || '';
      form.dariUker = b.dariUker || b.uker || '';
      form.namaRekanan = b.namaRekanan || b.partner || '';
      form.perihal = b.perihal || '';
      form.tipePembayaran = b.tipePembayaran || b.payment || '';
      form.maker = b.maker || 'Admin Finance';
      form.yangMengajukan = b.yangMengajukan || '';
      form.pangkatMengajukan = b.pangkatMengajukan || '';
      form.yangMenyetujui = b.yangMenyetujui || '';
      form.pangkatMenyetujui = b.pangkatMenyetujui || '';
      form.status = b.status || 'Menunggu proses';
      if (b.invoices && b.invoices.length) {
        form.invoices = JSON.parse(JSON.stringify(b.invoices));
        while (form.invoices.length < 4) form.invoices.push({ noInvoice: '', tglInvoice: '', nominal: 0 });
      } else if (b.nominal) {
        form.invoices = [
          { noInvoice: 'INV-01', tglInvoice: form.tglTransaksi, nominal: b.nominal },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 }
        ];
      }
      if (b.coas && b.coas.length) {
        form.coas = JSON.parse(JSON.stringify(b.coas));
        while (form.coas.length < 3) form.coas.push({ rangkaianCoa: '', nominal: 0 });
      }
      invoiceApSubView.value = 'form';
      currentStep.value = 4;
      showToast(`Batch ${form.noBatch} dimuat ke formulir untuk ditinjau.`, 'info');
    }

    const filteredHistoryBatches = computed(() => {
      const q = (historySearch.value || '').trim().toLowerCase();
      const st = historyStatusFilter.value;
      return batchList.value.filter(b => {
        const batchStatus = b.status || 'Menunggu proses';
        const matchStatus = st === 'all' || batchStatus === st;
        if (!matchStatus) return false;
        if (!q) return true;
        const bNo = (b.noBatch || b.batch || '').toLowerCase();
        const dNo = (b.noDokumen || b.doc || '').toLowerCase();
        const ptnr = (b.namaRekanan || b.partner || '').toLowerCase();
        const prhl = (b.perihal || '').toLowerCase();
        return bNo.includes(q) || dNo.includes(q) || ptnr.includes(q) || prhl.includes(q);
      });
    });

    const historyTotalNominal = computed(() => {
      const sum = batchList.value.reduce((s, b) => {
        const nom = b.nominal !== undefined ? b.nominal : (b.nominalTotal !== undefined ? b.nominalTotal : (b.invoices ? b.invoices.reduce((a, c) => a + (Number(c.nominal) || 0), 0) : 0));
        return s + (Number(nom) || 0);
      }, 0);
      return formatCompactRupiah(sum);
    });

    const historyDraftCount = computed(() => {
      return batchList.value.filter(b => b.status === 'Draft').length;
    });

    async function checkOnlineStatus() {
      try {
        const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
        if (res.ok) {
          isOnline.value = true;
          try {
            const mRes = await fetch(`${API_BASE}/masters`);
            if (mRes.ok) {
              const mJson = await mRes.json();
              if (mJson.data) {
                if (mJson.data.ukerList) ukerList.value = mJson.data.ukerList;
                if (mJson.data.rekananPresets) rekananPresets.value = mJson.data.rekananPresets;
                if (mJson.data.dhaList) dhaList.value = mJson.data.dhaList;
                if (mJson.data.coaList) coaList.value = mJson.data.coaList;
                if (mJson.data.pejabatPengajuList) pejabatPengajuList.value = mJson.data.pejabatPengajuList;
                if (mJson.data.pejabatPenyetujuList) pejabatPenyetujuList.value = mJson.data.pejabatPenyetujuList;
                if (mJson.data.pegawaiList && mJson.data.pegawaiList.length > 0) pegawaiList.value = mJson.data.pegawaiList;
                if (mJson.data.bankList && mJson.data.bankList.length > 0) bankList.value = mJson.data.bankList;
                if (mJson.data.masterBankList && mJson.data.masterBankList.length > 0) masterBankList.value = mJson.data.masterBankList;
                if (mJson.data.unitKerjaList && mJson.data.unitKerjaList.length > 0) {
                  masterUnitKerjaList.value = mJson.data.unitKerjaList.map(u => ({
                    id: u.id,
                    kode_unit: u.kode_unit || u.kode || '',
                    nama_unit: u.nama_unit || u.nama || '',
                    kode: u.kode_unit || u.kode || '',
                    nama: u.nama_unit || u.nama || ''
                  }));
                }
              }
            }
            if (pegawaiList.value.length === 0) {
              try {
                const pRes = await fetch(`${API_BASE}/masters/pegawai`);
                if (pRes.ok) {
                  const pJson = await pRes.json();
                  if (pJson.data && pJson.data.length > 0) pegawaiList.value = pJson.data;
                }
              } catch (eP) {}
            }
            if (masterBankList.value.length === 0) {
              try {
                const bRes = await fetch(`${API_BASE}/masters/banks`);
                if (bRes.ok) {
                  const bJson = await bRes.json();
                  if (bJson.data && bJson.data.length > 0) {
                    masterBankList.value = bJson.data;
                    bankList.value = bJson.data.map(b => b.nama);
                  }
                }
              } catch (eB) {}
            }
            if (masterUnitKerjaList.value.length === 0) {
              try {
                const uRes = await fetch(`${API_BASE}/masters/unit-kerja`);
                if (uRes.ok) {
                  const uJson = await uRes.json();
                  if (uJson.data && uJson.data.length > 0) {
                    masterUnitKerjaList.value = uJson.data.map(u => ({
                      id: u.id,
                      kode_unit: u.kode_unit || u.kode || '',
                      nama_unit: u.nama_unit || u.nama || '',
                      kode: u.kode_unit || u.kode || '',
                      nama: u.nama_unit || u.nama || ''
                    }));
                  }
                }
              } catch (eU) {}
            }
            const bRes = await fetch(`${API_BASE}/batches`);
            if (bRes.ok) {
              const bJson = await bRes.json();
              if (bJson.data && bJson.data.length > 0) {
                batchList.value = bJson.data;
              }
            }
          } catch (err) {
            console.warn('[Sync Error]', err);
          }
        } else {
          isOnline.value = false;
        }
      } catch (err) {
        isOnline.value = false;
      }
    }

    const totalNominalInvoice = computed(() => {
      return form.invoices.reduce((acc, cur) => acc + (Number(cur.nominal) || 0), 0);
    });

    const filledInvoicesCount = computed(() => {
      return form.invoices.filter(i => (i.noInvoice && i.noInvoice.trim()) || i.nominal > 0).length;
    });

    const totalNominalCoa = computed(() => {
      return form.coas.reduce((acc, cur) => acc + (Number(cur.nominal) || 0), 0);
    });

    const selisihCoa = computed(() => {
      return totalNominalInvoice.value - totalNominalCoa.value;
    });

    const isCoaBalanced = computed(() => {
      return totalNominalInvoice.value > 0 && selisihCoa.value === 0;
    });

    const terbilangInvoice = computed(() => {
      return angkaKeTerbilang(totalNominalInvoice.value);
    });

    const currentDha = computed(() => {
      return dhaList.value.find(d => (d.dha === form.namaDha || d.nama === form.namaDha)) || {
        dha: form.namaDha,
        nama: form.namaDha,
        anggaran: 50000000,
        saldo: 50000000,
        paguAwal: 50000000,
        rangkaianCoa: '',
        naturalAkun: ''
      };
    });

    const sisaSaldoDha = computed(() => {
      const budget = currentDha.value.anggaran !== undefined ? currentDha.value.anggaran : currentDha.value.saldo;
      return budget - totalNominalInvoice.value;
    });

    const persentaseDha = computed(() => {
      const budget = currentDha.value.anggaran !== undefined ? currentDha.value.anggaran : currentDha.value.saldo;
      if (!budget) return 0;
      return Math.round((totalNominalInvoice.value / budget) * 100);
    });

    const activeInvoices = computed(() => {
      return form.invoices.filter(i => (i.noInvoice && i.noInvoice.trim()) || i.nominal > 0);
    });

    const activeCoas = computed(() => {
      return form.coas.filter(c => (c.rangkaianCoa && c.rangkaianCoa.trim()) || c.nominal > 0);
    });

    const stats = computed(() => {
      const totalCount = batchList.value.length;
      const totalAmount = batchList.value.reduce((acc, cur) => acc + calcBatchTotal(cur), 0);
      return { totalCount, totalAmount };
    });

    const approvedBatchCount = computed(() => {
      return batchList.value.filter(b => b.status === 'Disetujui').length;
    });

    const pendingBatchCount = computed(() => {
      return batchList.value.filter(b => b.status === 'Draft' || b.status === 'Review' || b.status === 'Menunggu Otorisasi' || b.status === 'Diajukan').length;
    });

    function startNewBatch() {
      confirmClear();
      currentView.value = 'form';
    }

    function triggerPrint() {
      applyPrintSettingsToDOM();
      window.print();
    }

    function calcBatchTotal(b) {
      if (!b) return 0;
      if (Array.isArray(b.invoices) && b.invoices.length > 0) {
        const sum = b.invoices.reduce((s, i) => s + (Number(i.nominal) || 0), 0);
        if (sum > 0) return sum;
      }
      if (Array.isArray(b.coas) && b.coas.length > 0) {
        const sumCoa = b.coas.reduce((s, c) => s + (Number(c.nominal) || 0), 0);
        if (sumCoa > 0) return sumCoa;
      }
      if (b.totalNominal !== undefined && b.totalNominal !== null) return Number(b.totalNominal) || 0;
      if (b.nominalTotal !== undefined && b.nominalTotal !== null) return Number(b.nominalTotal) || 0;
      if (b.nominal !== undefined && b.nominal !== null) return Number(b.nominal) || 0;
      return 0;
    }


    function formatCurrency(val) {
      if (!val && val !== 0) return 'Rp 0';
      const n = Number(val) || 0;
      const hasDecimal = n % 1 !== 0;
      return 'Rp ' + new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: hasDecimal ? 2 : 0,
        maximumFractionDigits: 2
      }).format(n);
    }

    function formatDateIndo(dateStr) {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric'
        }).format(d);
      } catch (e) {
        return dateStr;
      }
    }

    // Custom Date Helpers (DD/MM/YYYY formatting & parsing)
    function formatIsoToDmy(iso) {
      if (!iso) return '';
      const str = String(iso).trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
        return str;
      }
      const m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (m) {
        const y = m[1];
        const mo = m[2].padStart(2, '0');
        const d = m[3].padStart(2, '0');
        return `${d}/${mo}/${y}`;
      }
      const dt = new Date(str);
      if (!isNaN(dt.getTime())) {
        const d = String(dt.getDate()).padStart(2, '0');
        const mo = String(dt.getMonth() + 1).padStart(2, '0');
        const y = dt.getFullYear();
        return `${d}/${mo}/${y}`;
      }
      return str;
    }

    function parseDmyToIso(val) {
      if (!val) return '';
      const str = String(val).trim();
      const m = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
      if (m) {
        const d = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const y = parseInt(m[3], 10);
        if (y >= 1900 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
          return `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }
      }
      const mDigits = str.match(/^(\d{2})(\d{2})(\d{4})$/);
      if (mDigits) {
        const d = parseInt(mDigits[1], 10);
        const mo = parseInt(mDigits[2], 10);
        const y = parseInt(mDigits[3], 10);
        if (y >= 1900 && y <= 2100 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
          return `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }
      }
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return str;
      }
      return null;
    }

    function handleDateTextInput(event, setter) {
      const val = event.target.value;
      if (!val || val.trim() === '') {
        setter('');
        return;
      }
      const isDigitsOnly = /^\d+$/.test(val);
      if (isDigitsOnly) {
        if (val.length === 2) {
          event.target.value = val + '/';
          return;
        } else if (val.length === 4) {
          event.target.value = val.slice(0, 2) + '/' + val.slice(2) + '/';
          return;
        } else if (val.length === 8) {
          const formatted = val.slice(0, 2) + '/' + val.slice(2, 4) + '/' + val.slice(4);
          event.target.value = formatted;
          const iso = parseDmyToIso(formatted);
          if (iso) setter(iso);
          return;
        }
      }
      const iso = parseDmyToIso(val);
      if (iso) {
        setter(iso);
      }
    }

    function handleDateBlur(event, setter, currentIso) {
      const val = event.target.value.trim();
      if (!val) {
        setter('');
        event.target.value = '';
        return;
      }
      const iso = parseDmyToIso(val);
      if (iso) {
        setter(iso);
        event.target.value = formatIsoToDmy(iso);
      } else {
        event.target.value = formatIsoToDmy(currentIso);
      }
    }

    function openDatePickerNative(event) {
      const el = event.currentTarget || event.target;
      if (el && typeof el.showPicker === 'function') {
        try {
          el.showPicker();
        } catch (err) {
          // ignore
        }
      }
    }

    function clearInvoiceSlot(idx) {
      form.invoices[idx] = { noInvoice: '', tglInvoice: '', nominal: 0 };
    }

    function clearCoaSlot(idx) {
      form.coas[idx] = { rangkaianCoa: '', nominal: 0 };
    }

    function autoBalanceCoa(idx) {
      const otherSum = form.coas.reduce((acc, cur, i) => i !== idx ? acc + (Number(cur.nominal) || 0) : acc, 0);
      const remaining = Math.max(0, totalNominalInvoice.value - otherSum);
      form.coas[idx].nominal = remaining;
      showToast(`COA disesuaikan menjadi ${formatCurrency(remaining)}`, 'info');
    }

    function onSelectRekanan(nama) {
      const match = rekananPresets.value.find(r => r.nama === nama);
      if (match) {
        form.alamatRekanan = match.alamat;
        form.nikNpwp = match.nikNpwp;
        form.namaWpRekanan = match.namaWp;
        form.namaBank = match.bank;
        form.namaRekening = match.atasNama;
        form.nomorRekening = String(match.rekening);
        showToast(`Data rekening & NPWP ${match.nama} otomatis diisi`, 'info');
      }
    }

    function onSelectPengaju(nama) {
      const p = pejabatPengajuList.value.find(x => x.nama === nama);
      if (p) form.pangkatMengajukan = p.pangkat;
    }

    function onSelectPenyetuju(nama) {
      const p = pejabatPenyetujuList.value.find(x => x.nama === nama);
      if (p) form.pangkatMenyetujui = p.pangkat;
    }

    async function checkDocUniqueness() {
      if (!form.noDokumen) return;
      if (isOnline.value) {
        try {
          const res = await fetch(`${API_BASE}/batches/check-doc?noDokumen=${encodeURIComponent(form.noDokumen)}${form.id ? '&excludeId=' + form.id : ''}`);
          const json = await res.json();
          if (json.isDuplicate) {
            docDuplicateWarning.value = `Nomor dokumen sudah ada di Batch ${json.existingBatch.no_batch}`;
          } else {
            docDuplicateWarning.value = '';
          }
        } catch (e) { }
      } else {
        const found = batchList.value.find(b => b.noDokumen === form.noDokumen && b.id !== form.id);
        if (found) {
          docDuplicateWarning.value = `Nomor dokumen sudah ada di Batch ${found.noBatch}`;
        } else {
          docDuplicateWarning.value = '';
        }
      }
    }

    const selectedBatchId = ref(1);
    const tableSearchKeyword = ref('');
    const tableCriteria = ref('semua');
    const tableStatusFilter = ref('');
    const tableSortBy = ref('noBatch');
    const tableSortOrder = ref('DESC');
    const currentPage = ref(1);
    const pageSize = ref(10);

    const filteredBatches = computed(() => {
      let result = [...batchList.value];
      const q = tableSearchKeyword.value.trim().toLowerCase();

      if (q) {
        result = result.filter(item => {
          if (tableCriteria.value === 'noBatch') return item.noBatch.toLowerCase().includes(q);
          if (tableCriteria.value === 'noDokumen') return item.noDokumen.toLowerCase().includes(q);
          if (tableCriteria.value === 'perihal') return item.perihal.toLowerCase().includes(q);
          if (tableCriteria.value === 'dariUker') return item.dariUker.toLowerCase().includes(q);
          if (tableCriteria.value === 'rekanan') return item.namaRekanan.toLowerCase().includes(q);
          return (
            item.noBatch.toLowerCase().includes(q) ||
            item.noDokumen.toLowerCase().includes(q) ||
            item.perihal.toLowerCase().includes(q) ||
            item.dariUker.toLowerCase().includes(q) ||
            item.namaRekanan.toLowerCase().includes(q)
          );
        });
      }

      if (tableStatusFilter.value) {
        result = result.filter(item => item.status === tableStatusFilter.value);
      }

      result.sort((a, b) => {
        let valA = a[tableSortBy.value] || '';
        let valB = b[tableSortBy.value] || '';
        if (tableSortBy.value === 'nominalTotal') {
          valA = calcBatchTotal(a);
          valB = calcBatchTotal(b);
        }
        if (valA < valB) return tableSortOrder.value === 'ASC' ? -1 : 1;
        if (valA > valB) return tableSortOrder.value === 'ASC' ? 1 : -1;
        return 0;
      });

      return result;
    });

    const totalPages = computed(() => Math.max(1, Math.ceil(filteredBatches.value.length / pageSize.value)));

    const paginatedBatches = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredBatches.value.slice(start, start + pageSize.value);
    });

    function changeSort(col) {
      if (tableSortBy.value === col) {
        tableSortOrder.value = tableSortOrder.value === 'ASC' ? 'DESC' : 'ASC';
      } else {
        tableSortBy.value = col;
        tableSortOrder.value = 'DESC';
      }
    }

    const invoiceApSearch = ref('');
    const invoiceApDhaFilter = ref('ALL');
    const selectedDetailBatch = ref(null);
    const showDetailModal = ref(false);

    const filteredInvoiceApBatches = computed(() => {
      let result = [...batchList.value];
      if (invoiceApDhaFilter.value && invoiceApDhaFilter.value !== 'ALL') {
        result = result.filter(b => b.namaDha === invoiceApDhaFilter.value);
      }
      if (invoiceApSearch.value && invoiceApSearch.value.trim() !== '') {
        const q = invoiceApSearch.value.toLowerCase().trim();
        result = result.filter(b =>
          (b.noBatch || '').toLowerCase().includes(q) ||
          (b.noDokumen || '').toLowerCase().includes(q) ||
          (b.perihal || '').toLowerCase().includes(q) ||
          (b.namaRekanan || '').toLowerCase().includes(q) ||
          (b.namaDha || '').toLowerCase().includes(q)
        );
      }
      return result;
    });

    function openDetailModal(batch) {
      selectedDetailBatch.value = batch;
      showDetailModal.value = true;
    }

    function closeDetailModal() {
      showDetailModal.value = false;
    }

    function getBatchStatusBadgeClass(status) {
      const s = String(status || '').toLowerCase().trim();
      if (['approved', 'disetujui', 'selesai', 'terverifikasi', 'cair'].includes(s)) {
        return 'tag-emerald';
      }
      if (['ditolak', 'rejected', 'batal'].includes(s)) {
        return 'tag-rose';
      }
      return 'tag-amber';
    }

    function getDetailInvoices(b) {
      if (!b) return [];
      if (Array.isArray(b.invoices) && b.invoices.length > 0) {
        const filled = b.invoices.filter(i => (Number(i.nominal) > 0) || (i.noInvoice && String(i.noInvoice).trim() !== ''));
        if (filled.length > 0) return filled;
      }
      const total = calcBatchTotal(b);
      if (total > 0 || b.noDokumen) {
        return [{
          noInvoice: b.noDokumen || b.noBatch || 'INV-01',
          tglInvoice: b.tglTransaksi || '',
          nominal: total
        }];
      }
      return [];
    }

    function getDetailCoas(b) {
      if (!b) return [];
      if (Array.isArray(b.coas) && b.coas.length > 0) {
        const filled = b.coas.filter(c => (Number(c.nominal) > 0) || (c.rangkaianCoa && String(c.rangkaianCoa).trim() !== '') || (c.naturalAkun && String(c.naturalAkun).trim() !== ''));
        if (filled.length > 0) return filled;
      }
      const total = calcBatchTotal(b);
      if (total > 0 && b.namaDha) {
        return [{
          rangkaianCoa: '1-731001-861001-99-4500-102-014-040-1810-001-00000',
          naturalAkun: 'Penyediaan Sarana dan Prasarana Pendukung',
          nominal: total
        }];
      }
      return [];
    }

    async function approveBatchDetail(batch) {
      if (!batch) return;
      closeDetailModal();
      if (!hasPermission('batch_approve')) {
        showToast(`Akses Dibatasi: Role ${currentUser.role || currentUser.roleKey} tidak memiliki wewenang untuk menyetujui transaksi (Wewenang Approver / Super Admin).`, 'warning');
        return;
      }
      const targetNo = batch.noBatch || batch.id;
      const confirmed = await showSweetConfirm({
        title: 'Setujui Transaksi Batch?',
        html: `Apakah Anda yakin ingin <strong>MENYETUJUI</strong> transaksi <b>Batch ${targetNo}</b>?<br><small class="text-muted">Status transaksi akan diperbarui menjadi "Disetujui" pada sistem & database.</small>`,
        icon: 'success',
        confirmButtonText: '<i class="bi bi-check-circle me-1"></i> Ya, Setujui',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#059669',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;

      const targetId = batch.id;
      const targetNoBatch = batch.noBatch || batch.batch;
      const updater = (currentUser && (currentUser.name || currentUser.username)) || 'Pejabat Penyetuju';

      try {
        if (isOnline.value && targetId) {
          try {
            await fetch(`${API_BASE}/batches/${targetId}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Disetujui', updatedBy: updater })
            });
          } catch (apiErr) {
            console.warn('[API] Update status online gagal, fallback ke update lokal:', apiErr);
          }
        }
        batch.status = 'Disetujui';
        const idx = batchList.value.findIndex(x => (targetId && x.id === targetId) || (x.noBatch && x.noBatch === targetNoBatch));
        if (idx !== -1) {
          batchList.value[idx].status = 'Disetujui';
        }
        localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
        if (form.id === targetId || form.noBatch === targetNoBatch) {
          form.status = 'Disetujui';
        }
        closeDetailModal();
        showToast(`Transaksi Batch ${targetNoBatch} BERHASIL DISETUJUI.`, 'success');
      } catch (err) {
        showToast(err.message || 'Gagal menyetujui transaksi', 'error');
      }
    }

    async function rejectBatchDetail(batch) {
      if (!batch) return;
      closeDetailModal();
      if (!hasPermission('batch_approve')) {
        showToast(`Akses Dibatasi: Role ${currentUser.role || currentUser.roleKey} tidak memiliki wewenang untuk menolak transaksi (Wewenang Approver / Super Admin).`, 'warning');
        return;
      }
      const targetNo = batch.noBatch || batch.id;
      const confirmed = await showSweetConfirm({
        title: 'Tolak Transaksi Batch?',
        html: `Apakah Anda yakin ingin <strong>MENOLAK</strong> transaksi <b>Batch ${targetNo}</b>?<br><small class="text-muted">Status transaksi akan ditandai sebagai "Ditolak".</small>`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-x-circle me-1"></i> Ya, Tolak Transaksi',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;

      const targetId = batch.id;
      const targetNoBatch = batch.noBatch || batch.batch;
      const updater = (currentUser && (currentUser.name || currentUser.username)) || 'Pejabat Penyetuju';

      try {
        if (isOnline.value && targetId) {
          try {
            await fetch(`${API_BASE}/batches/${targetId}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'Ditolak', updatedBy: updater })
            });
          } catch (apiErr) {
            console.warn('[API] Update status online gagal, fallback ke update lokal:', apiErr);
          }
        }
        batch.status = 'Ditolak';
        const idx = batchList.value.findIndex(x => (targetId && x.id === targetId) || (x.noBatch && x.noBatch === targetNoBatch));
        if (idx !== -1) {
          batchList.value[idx].status = 'Ditolak';
        }
        localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
        if (form.id === targetId || form.noBatch === targetNoBatch) {
          form.status = 'Ditolak';
        }
        closeDetailModal();
        showToast(`Transaksi Batch ${targetNoBatch} TELAH DITOLAK.`, 'warning');
      } catch (err) {
        showToast(err.message || 'Gagal menolak transaksi', 'error');
      }
    }

    function printBatchDetail(batch) {
      if (!batch) return;
      if (!hasPermission('print_disposisi')) {
        showToast('Akses Dibatasi: Anda tidak memiliki wewenang untuk mencetak lembar disposisi.', 'warning');
        return;
      }
      loadBatchToForm(batch);
      closeDetailModal();
      printVoucher(true);
    }

    function goBack() {
      currentView.value = previousView.value || 'invoice-ap';
    }

    function startNewBatch() {
      if (!hasPermission('form_create')) {
        showToast(`Akses Dibatasi: Role ${currentUser.role || currentUser.roleKey} tidak memiliki wewenang untuk membuat transaksi baru.`, 'warning');
        return;
      }
      previousView.value = currentView.value;
      confirmClear();
      currentView.value = 'form';
    }

    const pegawaiList = ref([]);

    const pegawaiSearch = ref('');
    const filteredPegawaiList = computed(() => {
      if (!pegawaiSearch.value || !pegawaiSearch.value.trim()) return pegawaiList.value;
      const q = pegawaiSearch.value.toLowerCase().trim();
      return pegawaiList.value.filter(p =>
        (p.nama && p.nama.toLowerCase().includes(q)) ||
        (p.nip && String(p.nip).toLowerCase().includes(q)) ||
        (p.pangkat && p.pangkat.toLowerCase().includes(q)) ||
        (p.jabatan && p.jabatan.toLowerCase().includes(q)) ||
        (p.uker && p.uker.toLowerCase().includes(q)) ||
        (p.peran && p.peran.toLowerCase().includes(q)) ||
        (p.bank && p.bank.toLowerCase().includes(q)) ||
        (p.noRek && String(p.noRek).toLowerCase().includes(q))
      );
    });

    const showPegawaiModal = ref(false);
    const pegawaiFormMode = ref('add');
    const pegawaiForm = reactive({
      id: null,
      nip: '',
      nama: '',
      pangkat: '',
      uker: 'Unit Manajemen Keuangan KPw BI Jember',
      peran: 'Pejabat Pengaju',
      status: 'Aktif',
      bank: '',
      noRek: ''
    });

    function openPegawaiModal() {
      if (!hasPermission('manage_masters')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses untuk mengelola data master pegawai.', 'warning');
        return;
      }
      pegawaiFormMode.value = 'add';
      pegawaiForm.id = null;
      pegawaiForm.nip = '';
      pegawaiForm.nama = '';
      pegawaiForm.pangkat = '';
      pegawaiForm.uker = ukerList.value[0] || 'Unit Manajemen Keuangan KPw BI Jember';
      pegawaiForm.peran = 'Pejabat Pengaju';
      pegawaiForm.status = 'Aktif';
      pegawaiForm.bank = '';
      pegawaiForm.noRek = '';
      showPegawaiModal.value = true;
    }

    function editPegawai(p) {
      pegawaiFormMode.value = 'edit';
      pegawaiForm.id = p.id;
      pegawaiForm.nip = p.nip;
      pegawaiForm.nama = p.nama;
      pegawaiForm.pangkat = p.pangkat;
      pegawaiForm.uker = p.uker;
      pegawaiForm.peran = p.peran;
      pegawaiForm.status = p.status;
      pegawaiForm.bank = p.bank || '';
      pegawaiForm.noRek = p.noRek || '';
      showPegawaiModal.value = true;
    }

    async function savePegawai() {
      if (!pegawaiForm.nip || !pegawaiForm.nip.trim()) {
        showToast('NIP / Identitas Pegawai wajib diisi!', 'warning');
        return;
      }
      if (!pegawaiForm.nama || !pegawaiForm.nama.trim()) {
        showToast('Nama Lengkap & Gelar Pegawai wajib diisi!', 'warning');
        return;
      }
      if (!pegawaiForm.pangkat || !pegawaiForm.pangkat.trim()) {
        showToast('Pangkat / Jabatan Pegawai wajib diisi!', 'warning');
        return;
      }

      const payload = {
        nip: pegawaiForm.nip.trim(),
        nama: pegawaiForm.nama.trim(),
        pangkat: pegawaiForm.pangkat.trim(),
        jabatan: pegawaiForm.peran === 'Pejabat Penyetuju' ? 'Approver' : 'Maker',
        uker: pegawaiForm.uker,
        peran: pegawaiForm.peran,
        status: pegawaiForm.status,
        bank: pegawaiForm.bank.trim(),
        noRek: pegawaiForm.noRek.trim()
      };

      if (pegawaiFormMode.value === 'add') {
        let insertedId = null;
        if (isOnline.value) {
          try {
            const pRes = await fetch(`${API_BASE}/masters/pegawai`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const pJson = await pRes.json();
            if (pJson.data && pJson.data.id) insertedId = pJson.data.id;
          } catch (e) {}
        }

        const nextId = insertedId || (pegawaiList.value.length ? Math.max(...pegawaiList.value.map(p => p.id || 0)) + 1 : 1);
        const newPegawai = {
          id: nextId,
          ...payload
        };
        pegawaiList.value.unshift(newPegawai);

        if (pegawaiForm.peran === 'Pejabat Pengaju') {
          if (!pejabatPengajuList.value.some(x => x.nama === newPegawai.nama)) {
            pejabatPengajuList.value.push({ nama: newPegawai.nama, pangkat: newPegawai.pangkat });
          }
        } else if (pegawaiForm.peran === 'Pejabat Penyetuju') {
          if (!pejabatPenyetujuList.value.some(x => x.nama === newPegawai.nama)) {
            pejabatPenyetujuList.value.push({ nama: newPegawai.nama, pangkat: newPegawai.pangkat });
          }
        }

        showToast(`Pegawai ${newPegawai.nama} berhasil ditambahkan ke Data Master!`, 'success');
      } else {
        if (isOnline.value && pegawaiForm.id) {
          try {
            await fetch(`${API_BASE}/masters/pegawai/${pegawaiForm.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } catch (e) {}
        }

        const item = pegawaiList.value.find(p => p.id === pegawaiForm.id);
        if (item) {
          item.nip = payload.nip;
          item.nama = payload.nama;
          item.pangkat = payload.pangkat;
          item.uker = payload.uker;
          item.peran = payload.peran;
          item.status = payload.status;
          item.bank = payload.bank;
          item.noRek = payload.noRek;
          showToast(`Data pegawai ${item.nama} berhasil diperbarui!`, 'success');
        }
      }

      showPegawaiModal.value = false;
    }

    async function deletePegawai(id) {
      const item = pegawaiList.value.find(p => p.id === id);
      const name = item ? item.nama : 'Pegawai';
      const confirmed = await showSweetConfirm({
        title: 'Hapus Data Pegawai?',
        html: `Apakah Anda yakin ingin menghapus data pegawai <b>"${name}"</b> dari database master?`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      if (isOnline.value) {
        try {
          await fetch(`${API_BASE}/masters/pegawai/${id}`, { method: 'DELETE' });
        } catch (e) {}
      }
      pegawaiList.value = pegawaiList.value.filter(p => p.id !== id);
      showToast(`Data pegawai ${name} berhasil dihapus.`, 'info');
    }

    const masterBankList = ref([]);

    const bankSearch = ref('');
    const filteredMasterBankList = computed(() => {
      if (!bankSearch.value || !bankSearch.value.trim()) return masterBankList.value;
      const q = bankSearch.value.toLowerCase().trim();
      return masterBankList.value.filter(b =>
        (b.nama && b.nama.toLowerCase().includes(q)) ||
        (b.kode && String(b.kode).toLowerCase().includes(q)) ||
        (b.singkatan && b.singkatan.toLowerCase().includes(q)) ||
        (b.jenis && b.jenis.toLowerCase().includes(q)) ||
        (b.swift && b.swift.toLowerCase().includes(q)) ||
        (b.kliring && b.kliring.toLowerCase().includes(q))
      );
    });

    const showBankModal = ref(false);
    const bankFormMode = ref('add');
    const bankForm = reactive({
      id: null,
      kode: '',
      nama: ''
    });

    function openBankModal() {
      if (!hasPermission('manage_masters')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses untuk mengelola data master bank.', 'warning');
        return;
      }
      bankFormMode.value = 'add';
      bankForm.id = null;
      bankForm.kode = '';
      bankForm.nama = '';
      showBankModal.value = true;
    }

    function editBank(b) {
      bankFormMode.value = 'edit';
      bankForm.id = b.id;
      bankForm.kode = b.kode;
      bankForm.nama = b.nama;
      showBankModal.value = true;
    }

    async function saveBank() {
      if (!bankForm.kode || !bankForm.kode.trim()) {
        showToast('Kode Bank wajib diisi!', 'warning');
        return;
      }
      if (!bankForm.nama || !bankForm.nama.trim()) {
        showToast('Nama Bank wajib diisi!', 'warning');
        return;
      }

      const payload = {
        kode: bankForm.kode.trim(),
        nama: bankForm.nama.trim()
      };

      if (bankFormMode.value === 'add') {
        let insertedId = null;
        if (isOnline.value) {
          try {
            const bRes = await fetch(`${API_BASE}/masters/banks`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const bJson = await bRes.json();
            if (bJson.data && bJson.data.id) insertedId = bJson.data.id;
          } catch (e) {}
        }

        const newBank = {
          id: insertedId || (masterBankList.value.length ? Math.max(...masterBankList.value.map(b => b.id || 0)) + 1 : 1),
          kode: payload.kode,
          nama: payload.nama,
          singkatan: `BANK-${payload.kode}`,
          jenis: 'Bank Umum Swasta / Asing',
          swift: `ID${payload.kode.padStart(3, '0')}`,
          kliring: 'BI-FAST / SKNBI / RTGS',
          status: 'Aktif'
        };
        masterBankList.value.push(newBank);
        if (!bankList.value.includes(newBank.nama)) {
          bankList.value.push(newBank.nama);
        }
        showToast(`Bank ${newBank.nama} berhasil ditambahkan!`, 'success');
      } else {
        if (isOnline.value && bankForm.id) {
          try {
            await fetch(`${API_BASE}/masters/banks/${bankForm.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } catch (e) {}
        }

        const item = masterBankList.value.find(b => b.id === bankForm.id);
        if (item) {
          const oldName = item.nama;
          item.kode = payload.kode;
          item.nama = payload.nama;
          item.singkatan = `BANK-${payload.kode}`;
          const bIdx = bankList.value.indexOf(oldName);
          if (bIdx !== -1) {
            bankList.value[bIdx] = payload.nama;
          }
          showToast(`Data bank ${item.nama} berhasil diperbarui!`, 'success');
        }
      }

      showBankModal.value = false;
    }

    async function deleteBank(id) {
      const item = masterBankList.value.find(b => b.id === id);
      const name = item ? item.nama : 'Bank';
      const confirmed = await showSweetConfirm({
        title: 'Hapus Data Bank?',
        html: `Apakah Anda yakin ingin menghapus data bank <b>"${name}"</b> dari database master?`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      if (isOnline.value) {
        try {
          await fetch(`${API_BASE}/masters/banks/${id}`, { method: 'DELETE' });
        } catch (e) {}
      }
      masterBankList.value = masterBankList.value.filter(b => b.id !== id);
      bankList.value = bankList.value.filter(bName => bName !== name);
      showToast(`Data bank ${name} berhasil dihapus.`, 'info');
    }

    // ================= DATA UNIT KERJA (DATA MASTER) =================
    const masterUnitKerjaList = ref([
      { id: 1, kode_unit: 'FDSEK', nama_unit: 'Fungsi Data, Statistik & Kajian Ekonomi', kode: 'FDSEK', nama: 'Fungsi Data, Statistik & Kajian Ekonomi' },
      { id: 2, kode_unit: 'FPPU', nama_unit: 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)', kode: 'FPPU', nama: 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)' },
      { id: 3, kode_unit: 'UMK', nama_unit: 'Unit Manajemen Keuangan KPw BI Jember', kode: 'UMK', nama: 'Unit Manajemen Keuangan KPw BI Jember' },
      { id: 4, kode_unit: 'KMR', nama_unit: 'Seksi Kepatuhan & Manajemen Risiko', kode: 'KMR', nama: 'Seksi Kepatuhan & Manajemen Risiko' },
      { id: 5, kode_unit: 'PUR', nama_unit: 'Unit Operasional Sistem Pembayaran & PUR', kode: 'PUR', nama: 'Unit Operasional Sistem Pembayaran & PUR' },
      { id: 6, kode_unit: 'LOG', nama_unit: 'Unit Manajemen Logistik & Rumah Tangga', kode: 'LOG', nama: 'Unit Manajemen Logistik & Rumah Tangga' },
      { id: 7, kode_unit: 'HUMAS', nama_unit: 'Fungsi Kehumasan & Komunikasi Kebijakan', kode: 'HUMAS', nama: 'Fungsi Kehumasan & Komunikasi Kebijakan' },
      { id: 8, kode_unit: 'SI-TI', nama_unit: 'Seksi Kehumasan & Sistem Informasi', kode: 'SI-TI', nama: 'Seksi Kehumasan & Sistem Informasi' }
    ]);

    const unitKerjaSearch = ref('');
    const filteredUnitKerjaList = computed(() => {
      if (!unitKerjaSearch.value || !unitKerjaSearch.value.trim()) return masterUnitKerjaList.value;
      const q = unitKerjaSearch.value.toLowerCase().trim();
      return masterUnitKerjaList.value.filter(u =>
        (u.nama_unit && u.nama_unit.toLowerCase().includes(q)) ||
        (u.nama && u.nama.toLowerCase().includes(q)) ||
        (u.kode_unit && String(u.kode_unit).toLowerCase().includes(q)) ||
        (u.kode && String(u.kode).toLowerCase().includes(q))
      );
    });

    const showUnitKerjaModal = ref(false);
    const unitKerjaFormMode = ref('add');
    const unitKerjaForm = reactive({
      id: null,
      kode_unit: '',
      nama_unit: ''
    });

    function openUnitKerjaModal() {
      if (!hasPermission('manage_masters')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses untuk mengelola data master unit kerja.', 'warning');
        return;
      }
      unitKerjaFormMode.value = 'add';
      unitKerjaForm.id = null;
      unitKerjaForm.kode_unit = '';
      unitKerjaForm.nama_unit = '';
      showUnitKerjaModal.value = true;
    }

    function editUnitKerja(u) {
      unitKerjaFormMode.value = 'edit';
      unitKerjaForm.id = u.id;
      unitKerjaForm.kode_unit = u.kode_unit || u.kode || '';
      unitKerjaForm.nama_unit = u.nama_unit || u.nama || '';
      showUnitKerjaModal.value = true;
    }

    async function saveUnitKerja() {
      if (!unitKerjaForm.nama_unit || !unitKerjaForm.nama_unit.trim()) {
        showToast('Nama Unit Kerja wajib diisi!', 'warning');
        return;
      }

      const payload = {
        kode_unit: (unitKerjaForm.kode_unit || '').trim().toUpperCase(),
        nama_unit: unitKerjaForm.nama_unit.trim(),
        kode: (unitKerjaForm.kode_unit || '').trim().toUpperCase(),
        nama: unitKerjaForm.nama_unit.trim()
      };

      if (unitKerjaFormMode.value === 'add') {
        let insertedId = null;
        if (isOnline.value) {
          try {
            const res = await fetch(`${API_BASE}/masters/unit-kerja`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const rJson = await res.json();
            if (rJson && rJson.data && rJson.data.id) insertedId = rJson.data.id;
          } catch (errApi) {
            console.warn('Gagal simpan unit kerja ke database:', errApi);
          }
        }

        const newUker = {
          id: insertedId || (masterUnitKerjaList.value.length ? Math.max(...masterUnitKerjaList.value.map(u => u.id || 0)) + 1 : 1),
          kode_unit: payload.kode_unit,
          nama_unit: payload.nama_unit,
          kode: payload.kode_unit,
          nama: payload.nama_unit
        };
        masterUnitKerjaList.value.push(newUker);
        if (!ukerList.value.includes(newUker.nama_unit)) {
          ukerList.value.push(newUker.nama_unit);
        }
        showToast(`Unit Kerja "${newUker.nama_unit}" berhasil ditambahkan!`, 'success');
      } else {
        if (isOnline.value && unitKerjaForm.id) {
          try {
            await fetch(`${API_BASE}/masters/unit-kerja/${unitKerjaForm.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } catch (errApi) {
            console.warn('Gagal update unit kerja:', errApi);
          }
        }
        const item = masterUnitKerjaList.value.find(u => u.id === unitKerjaForm.id);
        if (item) {
          const oldName = item.nama_unit || item.nama;
          item.kode_unit = payload.kode_unit;
          item.nama_unit = payload.nama_unit;
          item.kode = payload.kode_unit;
          item.nama = payload.nama_unit;

          const uIdx = ukerList.value.indexOf(oldName);
          if (uIdx !== -1) {
            ukerList.value[uIdx] = payload.nama_unit;
          } else if (!ukerList.value.includes(payload.nama_unit)) {
            ukerList.value.push(payload.nama_unit);
          }
          showToast(`Data unit kerja "${item.nama_unit}" berhasil diperbarui!`, 'success');
        }
      }

      showUnitKerjaModal.value = false;
    }

    async function deleteUnitKerja(id) {
      const item = masterUnitKerjaList.value.find(u => u.id === id);
      const name = item ? (item.nama_unit || item.nama) : 'Unit Kerja';
      const confirmed = await showSweetConfirm({
        title: 'Hapus Unit Kerja?',
        html: `Apakah Anda yakin ingin menghapus data unit kerja <b>"${name}"</b> dari database master?`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      if (isOnline.value) {
        try {
          await fetch(`${API_BASE}/masters/unit-kerja/${id}`, { method: 'DELETE' });
        } catch (errApi) {
          console.warn('Gagal hapus unit kerja di server:', errApi);
        }
      }
      masterUnitKerjaList.value = masterUnitKerjaList.value.filter(u => u.id !== id);
      ukerList.value = ukerList.value.filter(uName => uName !== name);
      showToast(`Unit Kerja "${name}" berhasil dihapus.`, 'info');
    }

    const rekananSearch = ref('');
    const filteredRekananList = computed(() => {
      if (!rekananSearch.value || !rekananSearch.value.trim()) return rekananPresets.value;
      const q = rekananSearch.value.toLowerCase().trim();
      return rekananPresets.value.filter(r =>
        (r.nama && r.nama.toLowerCase().includes(q)) ||
        (r.alamat && r.alamat.toLowerCase().includes(q)) ||
        (r.nikNpwp && r.nikNpwp.toLowerCase().includes(q)) ||
        (r.namaWp && r.namaWp.toLowerCase().includes(q)) ||
        (r.bank && r.bank.toLowerCase().includes(q)) ||
        (r.rekening && r.rekening.toLowerCase().includes(q))
      );
    });

    const showRekananModal = ref(false);
    const rekananFormMode = ref('add');
    const rekananForm = reactive({
      id: null,
      nama: '',
      alamat: '',
      nikNpwp: '',
      namaWp: '',
      bank: 'Bank Mandiri',
      rekening: '',
      atasNama: ''
    });

    // Searchable Dropdown Bank pada Form Rekanan
    const isRekananBankDropdownOpen = ref(false);
    const rekananBankSearchText = ref(rekananForm.bank || '');
    const activeRekananBankIndex = ref(-1);

    const allBankOptions = computed(() => {
      const list = [];
      const seen = new Set();
      if (masterBankList.value && masterBankList.value.length > 0) {
        for (const b of masterBankList.value) {
          if (b && b.nama && !seen.has(b.nama.toLowerCase())) {
            seen.add(b.nama.toLowerCase());
            list.push({
              nama: b.nama,
              kode: b.kode || '',
              singkatan: b.singkatan || '',
              jenis: b.jenis || ''
            });
          }
        }
      }
      if (bankList.value && bankList.value.length > 0) {
        for (const name of bankList.value) {
          if (name && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            list.push({
              nama: name,
              kode: '',
              singkatan: '',
              jenis: ''
            });
          }
        }
      }
      return list;
    });

    const filteredRekananBankOptions = computed(() => {
      const query = (rekananBankSearchText.value || '').toLowerCase().trim();
      if (!query) return allBankOptions.value;
      return allBankOptions.value.filter(b =>
        b.nama.toLowerCase().includes(query) ||
        (b.kode && String(b.kode).toLowerCase().includes(query)) ||
        (b.singkatan && b.singkatan.toLowerCase().includes(query)) ||
        (b.jenis && b.jenis.toLowerCase().includes(query))
      );
    });

    const displayedRekananBankOptions = computed(() => {
      return filteredRekananBankOptions.value.slice(0, 50);
    });

    function openRekananBankDropdown() {
      isRekananBankDropdownOpen.value = true;
      activeRekananBankIndex.value = -1;
    }

    function toggleRekananBankDropdown() {
      isRekananBankDropdownOpen.value = !isRekananBankDropdownOpen.value;
      if (isRekananBankDropdownOpen.value) {
        activeRekananBankIndex.value = -1;
      }
    }

    function onRekananBankInput() {
      isRekananBankDropdownOpen.value = true;
      activeRekananBankIndex.value = -1;
      rekananForm.bank = rekananBankSearchText.value;
    }

    function selectRekananBank(bankItemOrName) {
      const bName = typeof bankItemOrName === 'string' ? bankItemOrName : (bankItemOrName ? bankItemOrName.nama : '');
      rekananForm.bank = bName;
      rekananBankSearchText.value = bName;
      isRekananBankDropdownOpen.value = false;
      activeRekananBankIndex.value = -1;
    }

    function clearRekananBank() {
      rekananForm.bank = '';
      rekananBankSearchText.value = '';
      activeRekananBankIndex.value = -1;
      isRekananBankDropdownOpen.value = true;
    }

    function onRekananBankKeydown(e) {
      if (!isRekananBankDropdownOpen.value) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
          isRekananBankDropdownOpen.value = true;
          return;
        }
      }
      const total = displayedRekananBankOptions.value.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeRekananBankIndex.value < total - 1) activeRekananBankIndex.value++;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeRekananBankIndex.value > 0) activeRekananBankIndex.value--;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeRekananBankIndex.value >= 0 && activeRekananBankIndex.value < total) {
          selectRekananBank(displayedRekananBankOptions.value[activeRekananBankIndex.value]);
        } else if (total > 0) {
          selectRekananBank(displayedRekananBankOptions.value[0]);
        }
      } else if (e.key === 'Escape') {
        isRekananBankDropdownOpen.value = false;
      }
    }

    watch(() => rekananForm.bank, (val) => {
      if (val !== undefined && val !== null) {
        rekananBankSearchText.value = val;
      }
    });

    function openRekananModal() {
      if (!hasPermission('manage_masters')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses untuk mengelola data master rekanan.', 'warning');
        return;
      }
      rekananFormMode.value = 'add';
      rekananForm.id = null;
      rekananForm.nama = '';
      rekananForm.alamat = '';
      rekananForm.nikNpwp = '';
      rekananForm.namaWp = '';
      rekananForm.bank = bankList.value[0] || 'Bank Mandiri';
      rekananBankSearchText.value = rekananForm.bank;
      isRekananBankDropdownOpen.value = false;
      activeRekananBankIndex.value = -1;
      rekananForm.rekening = '';
      rekananForm.atasNama = '';
      showRekananModal.value = true;
    }

    function editRekanan(r) {
      rekananFormMode.value = 'edit';
      rekananForm.id = r.id;
      rekananForm.nama = r.nama;
      rekananForm.alamat = r.alamat;
      rekananForm.nikNpwp = r.nikNpwp;
      rekananForm.namaWp = r.namaWp;
      rekananForm.bank = r.bank || bankList.value[0] || '';
      rekananBankSearchText.value = rekananForm.bank;
      isRekananBankDropdownOpen.value = false;
      activeRekananBankIndex.value = -1;
      rekananForm.rekening = r.rekening || '';
      rekananForm.atasNama = r.atasNama || r.nama;
      showRekananModal.value = true;
    }

    function saveRekanan() {
      if (!rekananForm.nama || !rekananForm.nama.trim()) {
        showToast('Nama Rekanan wajib diisi!', 'warning');
        return;
      }
      if (!rekananForm.alamat || !rekananForm.alamat.trim()) {
        showToast('Alamat Rekanan wajib diisi!', 'warning');
        return;
      }
      if (!rekananForm.nikNpwp || !rekananForm.nikNpwp.trim()) {
        showToast('NIK/NPWP Rekanan wajib diisi!', 'warning');
        return;
      }
      if (!rekananForm.namaWp || !rekananForm.namaWp.trim()) {
        showToast('Nama NPWP (Nama Wajib Pajak) wajib diisi!', 'warning');
        return;
      }
      if (!rekananForm.bank || !rekananForm.bank.trim()) {
        showToast('Bank Rekening Tujuan wajib dipilih!', 'warning');
        return;
      }

      if (rekananFormMode.value === 'add') {
        const nextId = rekananPresets.value.length ? Math.max(...rekananPresets.value.map(r => r.id || 0)) + 1 : 1;
        const newRekanan = {
          id: nextId,
          nama: rekananForm.nama.trim(),
          alamat: rekananForm.alamat.trim(),
          nikNpwp: rekananForm.nikNpwp.trim(),
          namaWp: rekananForm.namaWp.trim(),
          bank: rekananForm.bank,
          rekening: rekananForm.rekening.trim(),
          atasNama: (rekananForm.atasNama || rekananForm.nama).trim()
        };
        rekananPresets.value.unshift(newRekanan);
        showToast(`Rekanan ${newRekanan.nama} berhasil ditambahkan ke Data Master!`, 'success');
      } else {
        const item = rekananPresets.value.find(r => r.id === rekananForm.id);
        if (item) {
          item.nama = rekananForm.nama.trim();
          item.alamat = rekananForm.alamat.trim();
          item.nikNpwp = rekananForm.nikNpwp.trim();
          item.namaWp = rekananForm.namaWp.trim();
          item.bank = rekananForm.bank;
          item.rekening = rekananForm.rekening.trim();
          item.atasNama = (rekananForm.atasNama || rekananForm.nama).trim();
          showToast(`Data rekanan ${item.nama} berhasil diperbarui!`, 'success');
        }
      }
      isRekananBankDropdownOpen.value = false;
      showRekananModal.value = false;
    }

    async function deleteRekanan(id) {
      const item = rekananPresets.value.find(r => r.id === id);
      const name = item ? item.nama : 'Rekanan';
      const confirmed = await showSweetConfirm({
        title: 'Hapus Data Rekanan?',
        html: `Apakah Anda yakin ingin menghapus data rekanan / vendor <b>"${name}"</b> dari database master?`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      rekananPresets.value = rekananPresets.value.filter(r => r.id !== id);
      showToast(`Data rekanan ${name} berhasil dihapus.`, 'info');
    }

    const dhaSearch = ref('');
    const filteredDhaList = computed(() => {
      if (!dhaSearch.value || !dhaSearch.value.trim()) return dhaList.value;
      const q = dhaSearch.value.toLowerCase().trim();
      return dhaList.value.filter(d =>
        ((d.dha || d.nama || '').toLowerCase().includes(q)) ||
        ((d.rangkaianCoa || '').toLowerCase().includes(q)) ||
        ((d.naturalAkun || '').toLowerCase().includes(q)) ||
        (String(d.anggaran !== undefined ? d.anggaran : (d.saldo || '')).includes(q))
      );
    });

    const totalAnggaranDha = computed(() => {
      return dhaList.value.reduce((acc, d) => acc + (Number(d.anggaran !== undefined ? d.anggaran : d.saldo) || 0), 0);
    });

    const uniqueNaturalAkunCount = computed(() => {
      const set = new Set(dhaList.value.map(d => d.naturalAkun).filter(Boolean));
      return set.size;
    });

    const showDhaModal = ref(false);
    const dhaFormMode = ref('add');
    const dhaForm = reactive({
      id: null,
      dha: '',
      rangkaianCoa: '',
      anggaran: 0,
      naturalAkun: ''
    });

    function openDhaModal() {
      if (!hasPermission('manage_masters')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses untuk mengelola data master DHA.', 'warning');
        return;
      }
      dhaFormMode.value = 'add';
      dhaForm.id = null;
      dhaForm.dha = '';
      dhaForm.rangkaianCoa = '';
      dhaForm.anggaran = 0;
      dhaForm.naturalAkun = 'Penyediaan Sarana dan Prasarana Pendukung';
      showDhaModal.value = true;
    }

    function editDha(d) {
      dhaFormMode.value = 'edit';
      dhaForm.id = d.id || null;
      dhaForm.dha = d.dha || d.nama || '';
      dhaForm.rangkaianCoa = d.rangkaianCoa || '';
      dhaForm.anggaran = d.anggaran !== undefined ? d.anggaran : (d.saldo || 0);
      dhaForm.naturalAkun = d.naturalAkun || '';
      showDhaModal.value = true;
    }

    function saveDha() {
      if (!dhaForm.dha || !dhaForm.dha.trim()) {
        showToast('Field DHA wajib diisi!', 'warning');
        return;
      }
      if (!dhaForm.rangkaianCoa || !dhaForm.rangkaianCoa.trim()) {
        showToast('Field Rangkaian COA wajib diisi!', 'warning');
        return;
      }
      if (dhaForm.anggaran < 0) {
        showToast('Nominal Anggaran tidak boleh negatif!', 'warning');
        return;
      }
      if (!dhaForm.naturalAkun || !dhaForm.naturalAkun.trim()) {
        showToast('Field Natural Akun wajib diisi!', 'warning');
        return;
      }

      const cleanDha = dhaForm.dha.trim();
      const cleanCoa = dhaForm.rangkaianCoa.trim();
      const cleanAnggaran = Number(dhaForm.anggaran) || 0;
      const cleanNatural = dhaForm.naturalAkun.trim();

      if (dhaFormMode.value === 'add') {
        const nextId = dhaList.value.length ? Math.max(...dhaList.value.map(d => d.id || 0)) + 1 : 1;
        const newDha = {
          id: nextId,
          dha: cleanDha,
          nama: cleanDha,
          rangkaianCoa: cleanCoa,
          anggaran: cleanAnggaran,
          saldo: cleanAnggaran,
          naturalAkun: cleanNatural
        };
        dhaList.value.push(newDha);
        if (isOnline.value) {
          fetch('/api/masters/dha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDha)
          }).then(res => res.json()).then(res => {
            if (res && res.data && res.data.id) newDha.id = res.data.id;
          }).catch(e => console.warn('Gagal sync tambah DHA ke API:', e.message));
        }
        showToast('Data DHA berhasil ditambahkan ke Data Master!', 'success');
      } else {
        const item = dhaList.value.find(d => (dhaForm.id && d.id === dhaForm.id) || d.dha === cleanDha || d.nama === cleanDha);
        if (item) {
          item.dha = cleanDha;
          item.nama = cleanDha;
          item.rangkaianCoa = cleanCoa;
          item.anggaran = cleanAnggaran;
          item.saldo = cleanAnggaran;
          item.naturalAkun = cleanNatural;
          if (isOnline.value && item.id) {
            fetch(`/api/masters/dha/${item.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            }).catch(e => console.warn('Gagal sync edit DHA ke API:', e.message));
          }
          showToast('Data DHA berhasil diperbarui!', 'success');
        }
      }
      try {
        const cached = JSON.parse(localStorage.getItem('bi_erp_cached_masters') || '{}');
        cached.dhaList = dhaList.value;
        localStorage.setItem('bi_erp_cached_masters', JSON.stringify(cached));
      } catch (eCache) {}
      showDhaModal.value = false;
    }

    async function deleteDha(identifier) {
      const item = dhaList.value.find(d => d.id === identifier || d.dha === identifier || d.nama === identifier);
      const name = item ? (item.dha || item.nama) : 'Data DHA';
      const confirmed = await showSweetConfirm({
        title: 'Hapus Pos Anggaran DHA?',
        html: `Apakah Anda yakin ingin menghapus data pos DHA <b>"${name}"</b> dari database master?`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      if (isOnline.value && item && item.id) {
        fetch(`/api/masters/dha/${item.id}`, { method: 'DELETE' }).catch(e => console.warn('Gagal sync hapus DHA ke API:', e.message));
      }
      dhaList.value = dhaList.value.filter(d => !(d.id === identifier || d.dha === identifier || d.nama === identifier));
      try {
        const cached = JSON.parse(localStorage.getItem('bi_erp_cached_masters') || '{}');
        cached.dhaList = dhaList.value;
        localStorage.setItem('bi_erp_cached_masters', JSON.stringify(cached));
      } catch (eCache) {}
      showToast(`Data DHA berhasil dihapus dari master!`, 'info');
    }

    // ========================================================
    // EXPORT & IMPORT EXCEL DATA MASTER DHA
    // ========================================================
    const showImportDhaModal = ref(false);
    const importDhaFile = ref(null);
    const importDhaFileName = ref('');
    const importDhaParsedData = ref([]);
    const importDhaMode = ref('upsert');
    const isImportingDha = ref(false);
    const importDhaError = ref('');
    const dhaFileInput = ref(null);

    const importDhaTotalAnggaran = computed(() => {
      return importDhaParsedData.value.reduce((acc, r) => acc + (Number(r.anggaran) || 0), 0);
    });

    const importDhaPreviewRows = computed(() => {
      return importDhaParsedData.value.slice(0, 5);
    });

    async function getExcelLib() {
      if (typeof window !== 'undefined' && window.XLSX) return window.XLSX;
      return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[src*="xlsx"]');
        if (existing) {
          if (window.XLSX) return resolve(window.XLSX);
          existing.addEventListener('load', () => resolve(window.XLSX));
          existing.addEventListener('error', () => reject(new Error('Gagal memuat modul Excel')));
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error('Gagal memuat modul Excel dari CDN'));
        document.head.appendChild(script);
      });
    }

    async function exportDhaToExcel() {
      try {
        if (!dhaList.value || dhaList.value.length === 0) {
          showToast('Tidak ada data DHA untuk diekspor!', 'warning');
          return;
        }

        const XLSX = await getExcelLib().catch(() => null);

        const rows = dhaList.value.map((d, index) => ({
          'No': index + 1,
          'DHA (Uraian Kegiatan / Anggaran)': d.dha || d.nama || '',
          'Rangkaian COA': String(d.rangkaianCoa || ''),
          'Anggaran (Rp)': Number(d.anggaran !== undefined ? d.anggaran : d.saldo) || 0,
          'Natural Akun': d.naturalAkun || ''
        }));

        if (XLSX) {
          const ws = XLSX.utils.json_to_sheet(rows);
          ws['!cols'] = [
            { wch: 6 },
            { wch: 60 },
            { wch: 45 },
            { wch: 22 },
            { wch: 35 }
          ];

          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data Master DHA');

          const nowStr = new Date().toISOString().split('T')[0];
          XLSX.writeFile(wb, `Data_Master_DHA_${nowStr}.xlsx`);
          showToast(`Berhasil mengekspor ${rows.length} data Master DHA ke file Excel (.xlsx)!`, 'success');
        } else {
          const headers = ['No', 'DHA (Uraian Kegiatan / Anggaran)', 'Rangkaian COA', 'Anggaran (Rp)', 'Natural Akun'];
          const csvLines = rows.map(r => [
            r['No'],
            `"${(r['DHA (Uraian Kegiatan / Anggaran)'] || '').replace(/"/g, '""')}"`,
            `"${(r['Rangkaian COA'] || '').replace(/"/g, '""')}"`,
            r['Anggaran (Rp)'],
            `"${(r['Natural Akun'] || '').replace(/"/g, '""')}"`
          ].join(';'));

          const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...csvLines].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', `Data_Master_DHA_${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast(`Berhasil mengekspor ${rows.length} data Master DHA ke file CSV!`, 'success');
        }
      } catch (err) {
        console.error('Export DHA error:', err);
        showToast('Gagal mengekspor data DHA: ' + err.message, 'danger');
      }
    }

    function parseCurrencyNumber(val) {
      if (val === null || val === undefined || val === '') return 0;
      if (typeof val === 'number') return isNaN(val) ? 0 : val;
      let str = String(val).trim();
      if (!str || str === '-' || str === '–' || str === '—') return 0;

      let isNegative = false;
      if (/^\(.*\)$/.test(str)) {
        isNegative = true;
        str = str.slice(1, -1).trim();
      } else if (str.startsWith('-')) {
        isNegative = true;
        str = str.slice(1).trim();
      }

      str = str.replace(/^(rp\.?|idr|\$)\s*/i, '').replace(/\s+/g, '').replace(/\u00a0/g, '').trim();
      if (!/\d/.test(str)) return 0;

      const lastDot = str.lastIndexOf('.');
      const lastComma = str.lastIndexOf(',');

      if (lastDot > -1 && lastComma > -1) {
        if (lastDot > lastComma) {
          str = str.replace(/,/g, '');
        } else {
          str = str.replace(/\./g, '').replace(',', '.');
        }
      } else if (lastComma > -1 && lastDot === -1) {
        const parts = str.split(',');
        if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
          str = str.replace(/,/g, '');
        } else {
          str = str.replace(',', '.');
        }
      } else if (lastDot > -1 && lastComma === -1) {
        const parts = str.split('.');
        if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
          str = str.replace(/\./g, '');
        }
      }

      const cleanNum = str.replace(/[^0-9.-]/g, '');
      const num = parseFloat(cleanNum);
      if (isNaN(num)) return 0;
      return isNegative ? -num : num;
    }

    function detectDhaColumns(headers) {
      let dhaIdx = -1;
      let coaIdx = -1;
      let anggaranIdx = -1;
      let naturalIdx = -1;

      const cleans = headers.map(h => String(h || '').trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

      // 1. Identify COA column
      coaIdx = cleans.findIndex(c => 
        !c.includes('bank') && (
          c === 'rangkaiancoa' || c === 'kodecoa' || c === 'coa' || 
          c.includes('rangkaian') || (c.includes('rekening') && !c.includes('nama'))
        )
      );

      // 2. Identify Anggaran (Nominal Rupiah) column
      // CRITICAL: Disqualify columns that describe DHA/kegiatan/uraian, account, or bank
      const strongAnggaranAliases = [
        'anggaranrp', 'anggaran', 'pagu', 'paguanggaran', 'pagurp', 'paguawal',
        'nominal', 'nominalrp', 'nominalanggaran', 'totalanggaran', 'nilaianggaran',
        'saldo', 'saldorp', 'saldoawal', 'saldotersedia', 'alokasi', 'alokasidana',
        'alokasianggaran', 'plafon', 'plafond', 'jumlahanggaran', 'jumlahnominal',
        'nilaipagu', 'biaya', 'biayarp'
      ];

      anggaranIdx = cleans.findIndex((c, i) => {
        if (i === coaIdx) return false;
        const isDescription = c.includes('dha') || c.includes('uraian') || c.includes('kegiatan') || 
                              c.includes('himpunan') || c.includes('deskripsi') || c.includes('nama') ||
                              c.includes('subkegiatan') || c.includes('program');
        if (isDescription) return false;
        if (c.includes('bank') || c.includes('coa') || c.includes('rangkaian') || (c.includes('akun') && !c.includes('nominal'))) return false;
        return strongAnggaranAliases.includes(c);
      });

      if (anggaranIdx === -1) {
        anggaranIdx = cleans.findIndex((c, i) => {
          if (i === coaIdx) return false;
          const isDescription = c.includes('dha') || c.includes('uraian') || c.includes('kegiatan') || 
                                c.includes('himpunan') || c.includes('deskripsi') || c.includes('nama') ||
                                c.includes('subkegiatan') || c.includes('program');
          if (isDescription) return false;
          if (c.includes('bank') || c.includes('coa') || c.includes('rangkaian') || (c.includes('akun') && !c.includes('nominal'))) return false;
          return c.includes('anggaran') || c.includes('pagu') || c.includes('nominal') || c.includes('saldo') || c.includes('plafon') || c.includes('alokasi');
        });
      }

      // 3. Identify Natural Akun column
      naturalIdx = cleans.findIndex((c, i) => {
        if (i === coaIdx || i === anggaranIdx) return false;
        return c === 'naturalakun' || c === 'kategoriakun' || c === 'namaakun' || 
               c === 'natural' || c.includes('kategori') || 
               (c.includes('akun') && !c.includes('coa') && !c.includes('rekening') && !c.includes('bank'));
      });

      // 4. Identify DHA / Uraian Kegiatan column
      dhaIdx = cleans.findIndex((c, i) => {
        if (i === coaIdx || i === anggaranIdx || i === naturalIdx) return false;
        return c.includes('dha') || c.includes('uraian') || c.includes('kegiatan') || 
               c.includes('himpunan') || c === 'nama' || c.includes('deskripsi') || c.includes('program');
      });

      return { dhaIdx, coaIdx, anggaranIdx, naturalIdx };
    }

    async function downloadDhaTemplate() {
      try {
        const XLSX = await getExcelLib().catch(() => null);
        const templateData = [
          {
            'No': 1,
            'DHA (Uraian Kegiatan / Anggaran)': 'Pelaksanaan pengawasan KUPVA BB dalam rangka implementasi dan optimaliasi kebijakan pengawasan SP',
            'Rangkaian COA': '1-731001-713001-35-4100-063-011-040-8000-001-00000',
            'Anggaran (Rp)': 450000000,
            'Natural Akun': 'Administrasi Bank - Rupiah'
          },
          {
            'No': 2,
            'DHA (Uraian Kegiatan / Anggaran)': 'Memperkuat Pengendalian Inflasi & Ketahanan Pangan dalam rangka terjaganya stabilitas harga pangan',
            'Rangkaian COA': '1-731001-713012-07-4100-021-011-040-2500-945-00000',
            'Anggaran (Rp)': 1119622455,
            'Natural Akun': 'Penyediaan Sarana dan Prasarana Pendukung'
          },
          {
            'No': 3,
            'DHA (Uraian Kegiatan / Anggaran)': 'Penyelenggaraan Forum Komunikasi Kebijakan Moneter & Perbankan Daerah',
            'Rangkaian COA': '1-731001-861001-99-4500-102-014-040-1810-001-00000',
            'Anggaran (Rp)': 250000000,
            'Natural Akun': 'Beban Acara & Rapat'
          }
        ];

        if (XLSX) {
          const ws = XLSX.utils.json_to_sheet(templateData);
          ws['!cols'] = [
            { wch: 6 },
            { wch: 60 },
            { wch: 45 },
            { wch: 20 },
            { wch: 35 }
          ];
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Template Master DHA');
          XLSX.writeFile(wb, 'Template_Import_Master_DHA.xlsx');
          showToast('Template Excel Master DHA berhasil diunduh!', 'success');
        } else {
          const headers = ['No', 'DHA (Uraian Kegiatan / Anggaran)', 'Rangkaian COA', 'Anggaran (Rp)', 'Natural Akun'];
          const csvLines = templateData.map(r => [
            r['No'],
            `"${r['DHA (Uraian Kegiatan / Anggaran)']}"`,
            `"${r['Rangkaian COA']}"`,
            r['Anggaran (Rp)'],
            `"${r['Natural Akun']}"`
          ].join(';'));
          const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...csvLines].join('\n');
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute('download', 'Template_Import_Master_DHA.csv');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('Template CSV Master DHA berhasil diunduh!', 'success');
        }
      } catch (err) {
        showToast('Gagal mengunduh template: ' + err.message, 'danger');
      }
    }

    function openImportDhaModal() {
      showImportDhaModal.value = true;
      importDhaFile.value = null;
      importDhaFileName.value = '';
      importDhaParsedData.value = [];
      importDhaError.value = '';
      isImportingDha.value = false;
    }

    function closeImportDhaModal() {
      showImportDhaModal.value = false;
      importDhaParsedData.value = [];
      importDhaFile.value = null;
      importDhaFileName.value = '';
      importDhaError.value = '';
    }

    function triggerFileInput() {
      if (dhaFileInput.value) dhaFileInput.value.click();
    }

    function handleFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (file) parseDhaFile(file);
      e.target.value = '';
    }

    function handleFileDrop(e) {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) parseDhaFile(file);
    }

    async function parseDhaFile(file) {
      importDhaFile.value = file;
      importDhaFileName.value = file.name;
      importDhaError.value = '';
      importDhaParsedData.value = [];

      try {
        const XLSX = await getExcelLib();
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // 1. Try reading as 2D array first to support multi-row titles & custom headers
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
            if (!rawRows || rawRows.length === 0) {
              importDhaError.value = 'File Excel kosong atau tidak memiliki baris data.';
              return;
            }

            let headerRowIndex = -1;
            let colMap = { dhaIdx: -1, coaIdx: -1, anggaranIdx: -1, naturalIdx: -1 };

            for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
              const row = rawRows[r];
              if (!Array.isArray(row) || row.length === 0) continue;
              const det = detectDhaColumns(row);
              let score = 0;
              if (det.dhaIdx !== -1) score++;
              if (det.coaIdx !== -1) score++;
              if (det.anggaranIdx !== -1) score++;
              if (det.naturalIdx !== -1) score++;

              if (score >= 2) {
                headerRowIndex = r;
                colMap = det;
                break;
              }
            }

            const parsed = [];

            if (headerRowIndex !== -1) {
              // Safety fallback: if Anggaran column header wasn't matched by name, check numeric columns in data
              if (colMap.anggaranIdx === -1) {
                const headerRow = rawRows[headerRowIndex] || [];
                let bestCol = -1;
                let maxNumeric = 0;
                for (let c = 0; c < headerRow.length; c++) {
                  if (c === colMap.dhaIdx || c === colMap.coaIdx || c === colMap.naturalIdx) continue;
                  let numericCount = 0;
                  for (let r = headerRowIndex + 1; r < Math.min(rawRows.length, headerRowIndex + 15); r++) {
                    const cellVal = rawRows[r] && rawRows[r][c];
                    const num = parseCurrencyNumber(cellVal);
                    if (typeof cellVal === 'number' || (cellVal && num > 0)) {
                      numericCount++;
                    }
                  }
                  if (numericCount > maxNumeric) {
                    maxNumeric = numericCount;
                    bestCol = c;
                  }
                }
                if (bestCol !== -1 && maxNumeric >= 2) {
                  colMap.anggaranIdx = bestCol;
                }
              }

              for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
                const row = rawRows[i];
                if (!row || !Array.isArray(row)) continue;

                const rawDha = colMap.dhaIdx !== -1 ? row[colMap.dhaIdx] : '';
                const rawCoa = colMap.coaIdx !== -1 ? row[colMap.coaIdx] : '';
                const rawAnggaran = colMap.anggaranIdx !== -1 ? row[colMap.anggaranIdx] : 0;
                const rawNatural = colMap.naturalIdx !== -1 ? row[colMap.naturalIdx] : '';

                const dha = String(rawDha || '').trim();
                const rangkaianCoa = String(rawCoa || '').trim();
                const anggaran = parseCurrencyNumber(rawAnggaran);
                const naturalAkun = String(rawNatural || '').trim();

                if (dha || rangkaianCoa) {
                  parsed.push({
                    dha: dha || rangkaianCoa,
                    nama: dha || rangkaianCoa,
                    rangkaianCoa,
                    anggaran,
                    saldo: anggaran,
                    naturalAkun
                  });
                }
              }
            } else {
              // Fallback to standard sheet_to_json object format
              const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
              if (jsonRows && jsonRows.length > 0) {
                const keys = Object.keys(jsonRows[0]);
                const det = detectDhaColumns(keys);

                for (const row of jsonRows) {
                  const rawDha = det.dhaIdx !== -1 ? row[keys[det.dhaIdx]] : '';
                  const rawCoa = det.coaIdx !== -1 ? row[keys[det.coaIdx]] : '';
                  const rawAnggaran = det.anggaranIdx !== -1 ? row[keys[det.anggaranIdx]] : 0;
                  const rawNatural = det.naturalIdx !== -1 ? row[keys[det.naturalIdx]] : '';

                  const dha = String(rawDha || '').trim();
                  const rangkaianCoa = String(rawCoa || '').trim();
                  const anggaran = parseCurrencyNumber(rawAnggaran);
                  const naturalAkun = String(rawNatural || '').trim();

                  if (dha || rangkaianCoa) {
                    parsed.push({
                      dha: dha || rangkaianCoa,
                      nama: dha || rangkaianCoa,
                      rangkaianCoa,
                      anggaran,
                      saldo: anggaran,
                      naturalAkun
                    });
                  }
                }
              }
            }

            if (parsed.length === 0) {
              importDhaError.value = 'Tidak ada baris data DHA atau Rangkaian COA yang valid ditemukan di file ini.';
              return;
            }

            importDhaParsedData.value = parsed;
          } catch (err) {
            importDhaError.value = 'Gagal membaca format isi file: ' + err.message;
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        importDhaError.value = 'Gagal memproses file: ' + err.message;
      }
    }

    async function processImportDha() {
      if (importDhaParsedData.value.length === 0) {
        showToast('Tidak ada data yang dapat diimpor!', 'warning');
        return;
      }

      isImportingDha.value = true;
      const count = importDhaParsedData.value.length;
      const mode = importDhaMode.value;

      try {
        let apiSuccess = false;
        let apiErrorMsg = '';
        if (isOnline.value) {
          try {
            const res = await fetch('/api/masters/dha/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: importDhaParsedData.value, mode })
            });
            const data = await res.json();
            if (res.ok && data.success) {
              apiSuccess = true;
              // Sync fresh data from server
              const mRes = await fetch('/api/masters');
              if (mRes.ok) {
                const mData = await mRes.json();
                if (mData.data && mData.data.dhaList && mData.data.dhaList.length > 0) {
                  dhaList.value = mData.data.dhaList;
                }
              }
            }
          } catch (errApi) {
            apiErrorMsg = errApi.message;
            console.warn('[Import DHA] Gagal simpan ke backend, lanjut ke update state lokal:', errApi.message);
          }
        }

        if (!apiSuccess) {
          if (mode === 'replace') {
            dhaList.value = importDhaParsedData.value.map((item, idx) => ({
              id: idx + 1,
              ...item
            }));
          } else if (mode === 'upsert') {
            let maxId = dhaList.value.length ? Math.max(...dhaList.value.map(d => d.id || 0)) : 0;
            for (const newItem of importDhaParsedData.value) {
              const existing = dhaList.value.find(d => 
                (newItem.rangkaianCoa && d.rangkaianCoa && d.rangkaianCoa.trim() === newItem.rangkaianCoa.trim()) ||
                (newItem.dha && ((d.dha && d.dha.trim() === newItem.dha.trim()) || (d.nama && d.nama.trim() === newItem.dha.trim())))
              );
              if (existing) {
                existing.dha = newItem.dha;
                existing.nama = newItem.dha;
                if (newItem.rangkaianCoa) existing.rangkaianCoa = newItem.rangkaianCoa;
                existing.anggaran = newItem.anggaran;
                existing.saldo = newItem.anggaran;
                if (newItem.naturalAkun) existing.naturalAkun = newItem.naturalAkun;
              } else {
                maxId++;
                dhaList.value.push({
                  id: maxId,
                  ...newItem
                });
              }
            }
          } else {
            let maxId = dhaList.value.length ? Math.max(...dhaList.value.map(d => d.id || 0)) : 0;
            for (const newItem of importDhaParsedData.value) {
              maxId++;
              dhaList.value.push({
                id: maxId,
                ...newItem
              });
            }
          }
        }

        try {
          const cached = JSON.parse(localStorage.getItem('bi_erp_cached_masters') || '{}');
          cached.dhaList = dhaList.value;
          localStorage.setItem('bi_erp_cached_masters', JSON.stringify(cached));
        } catch (eCache) {}

        const modeText = mode === 'replace' ? 'diganti seluruhnya' : (mode === 'upsert' ? 'disinkronkan/diperbarui' : 'ditambahkan');
        const dbStatus = apiSuccess ? ' dan tersimpan permanen di database MySQL' : (apiErrorMsg ? ` (Penyimpanan lokal: ${apiErrorMsg})` : '');
        showToast(`Berhasil mengimpor ${count} data DHA (${modeText}${dbStatus})!`, 'success');

        closeImportDhaModal();
      } catch (err) {
        console.error('Error saat impor DHA:', err);
        showToast('Terjadi kesalahan saat mengimpor data: ' + err.message, 'danger');
      } finally {
        isImportingDha.value = false;
      }
    }

    // ================= STEP 4: SEARCHABLE DROPDOWN UNTUK DHA & COA =================
    const isDhaDropdownOpen = ref(false);
    const dhaFilterText = ref('');
    const dhaSearchInputRef = ref(null);

    const isCoaDropdownOpen = reactive([false, false, false]);
    const coaFilterText = reactive(['', '', '']);

    // Daftar nama DHA unik dari master database
    const uniqueDhaList = computed(() => {
      const map = new Map();
      if (Array.isArray(dhaList.value)) {
        for (const item of dhaList.value) {
          const rawName = String(item.nama || item.dha || '').trim();
          if (!rawName) continue;
          if (!map.has(rawName)) {
            map.set(rawName, {
              nama: rawName,
              dha: rawName,
              anggaran: Number(item.anggaran || item.saldo || 0),
              saldo: Number(item.saldo || item.anggaran || 0),
              coaCount: 1,
              coas: item.rangkaianCoa ? [item] : []
            });
          } else {
            const existing = map.get(rawName);
            existing.coaCount += 1;
            if (item.rangkaianCoa && !existing.coas.some(c => c.rangkaianCoa === item.rangkaianCoa)) {
              existing.coas.push(item);
            }
          }
        }
      }
      return Array.from(map.values());
    });

    const filteredDhaOptions = computed(() => {
      if (!dhaFilterText.value.trim()) {
        return uniqueDhaList.value.slice(0, 60);
      }
      const q = dhaFilterText.value.toLowerCase().trim();
      return uniqueDhaList.value.filter(d => d.nama.toLowerCase().includes(q)).slice(0, 60);
    });

    function toggleDhaDropdown() {
      isDhaDropdownOpen.value = !isDhaDropdownOpen.value;
      if (isDhaDropdownOpen.value) {
        isCoaDropdownOpen[0] = false;
        isCoaDropdownOpen[1] = false;
        isCoaDropdownOpen[2] = false;
        setTimeout(() => {
          if (dhaSearchInputRef.value) {
            dhaSearchInputRef.value.focus();
          }
        }, 50);
      }
    }

    function selectDha(dhaItem) {
      form.namaDha = dhaItem.nama;
      form.dhaBalance = dhaItem.anggaran || dhaItem.saldo || 0;
      isDhaDropdownOpen.value = false;
      dhaFilterText.value = '';
      showToast(`DHA "${dhaItem.nama.slice(0, 35)}..." dipilih.`, 'info');
    }

    function clearDhaSelection() {
      form.namaDha = '';
      form.dhaBalance = 0;
      dhaFilterText.value = '';
    }

    function toggleCoaDropdown(slotIdx) {
      const nextState = !isCoaDropdownOpen[slotIdx];
      isDhaDropdownOpen.value = false;
      isCoaDropdownOpen[0] = false;
      isCoaDropdownOpen[1] = false;
      isCoaDropdownOpen[2] = false;
      isCoaDropdownOpen[slotIdx] = nextState;
    }

    function getFilteredCoaOptions(slotIdx) {
      const query = (coaFilterText[slotIdx] || '').toLowerCase().trim();

      if (query) {
        const seen = new Set();
        const results = [];
        for (const item of dhaList.value) {
          if (!item.rangkaianCoa) continue;
          const matchCode = item.rangkaianCoa.toLowerCase().includes(query);
          const matchNatural = (item.naturalAkun || '').toLowerCase().includes(query);
          if ((matchCode || matchNatural) && !seen.has(item.rangkaianCoa)) {
            seen.add(item.rangkaianCoa);
            results.push(item);
            if (results.length >= 40) break;
          }
        }
        return results;
      }

      if (form.namaDha) {
        const matching = dhaList.value.filter(d =>
          (d.nama === form.namaDha || d.dha === form.namaDha) && d.rangkaianCoa
        );
        if (matching.length > 0) {
          return matching;
        }
      }

      const seen = new Set();
      const results = [];
      for (const item of dhaList.value) {
        if (item.rangkaianCoa && !seen.has(item.rangkaianCoa)) {
          seen.add(item.rangkaianCoa);
          results.push(item);
          if (results.length >= 30) break;
        }
      }
      return results;
    }

    function selectCoa(slotIdx, coaItem) {
      form.coas[slotIdx].rangkaianCoa = coaItem.rangkaianCoa;
      form.coas[slotIdx].naturalAkun = coaItem.naturalAkun || '';
      isCoaDropdownOpen[slotIdx] = false;
      coaFilterText[slotIdx] = '';
    }

    function clearCoaSelection(slotIdx) {
      form.coas[slotIdx].rangkaianCoa = '';
      form.coas[slotIdx].naturalAkun = '';
      form.coas[slotIdx].nominal = 0;
      coaFilterText[slotIdx] = '';
    }

    function closeAllSearchableDropdowns() {
      isPartnerDropdownOpen.value = false;
      isPengajuDropdownOpen.value = false;
      isPenyetujuDropdownOpen.value = false;
      isRekananBankDropdownOpen.value = false;
      isDhaDropdownOpen.value = false;
      isCoaDropdownOpen[0] = false;
      isCoaDropdownOpen[1] = false;
      isCoaDropdownOpen[2] = false;
    }

    function loadBatchToForm(item) {
      previousView.value = currentView.value;
      selectedBatchId.value = item.id;
      form.id = item.id;
      form.noBatch = item.noBatch;
      form.noDokumen = item.noDokumen;
      form.tglTransaksi = item.tglTransaksi;
      form.dariUker = item.dariUker;
      form.kepadaUker = item.kepadaUker;
      form.perihal = item.perihal;

      form.invoices = JSON.parse(JSON.stringify(item.invoices || []));
      while (form.invoices.length < 4) {
        form.invoices.push({ noInvoice: '', tglInvoice: '', nominal: 0 });
      }

      form.noFakturPajak = item.noFakturPajak || '';
      form.tglFakturPajak = item.tglFakturPajak || '';
      form.namaRekanan = item.namaRekanan;
      form.alamatRekanan = item.alamatRekanan;
      form.nikNpwp = item.nikNpwp;
      form.namaWpRekanan = item.namaWpRekanan;
      form.tipePembayaran = item.tipePembayaran;
      form.namaBank = item.namaBank;
      form.namaRekening = item.namaRekening;
      form.nomorRekening = String(item.nomorRekening || '');
      form.bebanAnggaranUker = item.bebanAnggaranUker;
      form.jenisInvoice = item.jenisInvoice;
      form.namaDha = item.namaDha;

      form.coas = JSON.parse(JSON.stringify(item.coas || [])).map(c => ({
        rangkaianCoa: c.rangkaianCoa || '',
        naturalAkun: c.naturalAkun || '',
        nominal: Number(c.nominal) || 0
      }));
      while (form.coas.length < 3) {
        form.coas.push({ rangkaianCoa: '', naturalAkun: '', nominal: 0 });
      }

      form.yangMengajukan = item.yangMengajukan;
      form.pangkatMengajukan = item.pangkatMengajukan;
      form.yangMenyetujui = item.yangMenyetujui;
      form.pangkatMenyetujui = item.pangkatMenyetujui;
      form.status = item.status || 'Diajukan';

      currentView.value = 'form';
      showToast(`Data batch ${item.noBatch} berhasil dimuat ke formulir`, 'info');
    }

    async function saveBatch() {
      if (!form.noDokumen || !form.perihal) {
        showToast('Nomor Dokumen dan Perihal transaksi wajib diisi!', 'warning');
        return;
      }
      if (totalNominalInvoice.value <= 0) {
        showToast('Total nominal invoice harus lebih dari Rp 0!', 'warning');
        return;
      }
      if (!isCoaBalanced.value) {
        showToast(`Rangkaian COA belum seimbang! Selisih: ${formatCurrency(selisihCoa.value)}`, 'warning');
        return;
      }

      isSubmitting.value = true;
      try {
        if (isOnline.value) {
          const res = await fetch(`${API_BASE}/batches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Gagal menyimpan ke server');

          showToast(data.message, 'success');
          checkOnlineStatus();
        } else {

          const nextId = batchList.value.length ? Math.max(...batchList.value.map(b => b.id)) + 1 : 1;
          const prefix = appSettings.prefixBatch || 'JR25 0';
          const newBatchNo = form.noBatch || `${prefix}${1474 + nextId}`;
          const newRecord = {
            ...JSON.parse(JSON.stringify(form)),
            id: nextId,
            noBatch: newBatchNo
          };

          batchList.value.unshift(newRecord);
          selectedBatchId.value = nextId;
          form.id = nextId;
          form.noBatch = newBatchNo;
          showToast(`Batch ${newBatchNo} berhasil disimpan ke database ERP!`, 'success');
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        isSubmitting.value = false;
      }
    }

    const showReplaceModal = ref(false);
    function confirmReplace() {
      if (!form.id) {
        showToast('Data batch baru belum tersimpan. Gunakan tombol SAVE terlebih dahulu.', 'warning');
        return;
      }
      showReplaceModal.value = true;
    }

    async function executeReplace() {
      showReplaceModal.value = false;
      try {
        if (isOnline.value) {
          const res = await fetch(`${API_BASE}/batches/${form.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Gagal update di server');
          showToast(data.message, 'success');
          checkOnlineStatus();
        } else {
          const idx = batchList.value.findIndex(b => b.id === form.id);
          if (idx !== -1) {
            batchList.value[idx] = JSON.parse(JSON.stringify(form));
            showToast(`Data Batch ${form.noBatch} berhasil diperbarui (Replace)!`, 'success');
          }
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
    }

    function resetFormFields() {
      const nextNum = 1475 + batchList.value.length;
      const prefix = appSettings.prefixBatch || 'JR25 0';
      form.id = null;
      form.noBatch = `${prefix}${nextNum}`;
      form.noDokumen = '';
      form.tglTransaksi = new Date().toISOString().split('T')[0];
      form.perihal = '';
      form.invoices = [
        { noInvoice: '', tglInvoice: form.tglTransaksi, nominal: 0 },
        { noInvoice: '', tglInvoice: '', nominal: 0 },
        { noInvoice: '', tglInvoice: '', nominal: 0 },
        { noInvoice: '', tglInvoice: '', nominal: 0 }
      ];
      form.noFakturPajak = '';
      form.tglFakturPajak = '';
      form.namaRekanan = '';
      form.alamatRekanan = '';
      form.nikNpwp = '';
      form.namaWpRekanan = '';
      form.namaRekening = '';
      form.nomorRekening = '';
      form.coas = [
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
        { rangkaianCoa: '', naturalAkun: '', nominal: 0 }
      ];
      form.yangMengajukan = '';
      form.pangkatMengajukan = '';
      form.yangMenyetujui = '';
      form.pangkatMenyetujui = '';
      pengajuSearchText.value = '';
      penyetujuSearchText.value = '';
      form.status = 'Draft';
      selectedBatchId.value = null;
    }

    function confirmClear() {
      if (confirm('Kosongkan formulir untuk menginput batch baru?')) {
        resetFormFields();
        showToast('Formulir berhasil dikosongkan. Siap input batch baru.', 'info');
      }
    }

    const showDeleteModal = ref(false);
    const batchToDelete = ref(null);

    async function confirmDelete(batch = null) {
      let target = batch;
      if (!target || !target.id) {
        if (!form.id) {
          showToast('Pilih data batch dari tabel yang ingin dihapus terlebih dahulu.', 'warning');
          return;
        }
        target = batchList.value.find(b => b.id === form.id) || { id: form.id, noBatch: form.noBatch, noDokumen: form.noDokumen, perihal: form.perihal };
      }
      const targetNo = target?.noBatch || form.noBatch || 'transaksi ini';
      const confirmed = await showSweetConfirm({
        title: 'Hapus Dokumen Batch?',
        html: `Apakah Anda yakin ingin menghapus data <b>Batch ${targetNo}</b>?<br><small class="text-danger">Dokumen batch akan dihapus dari sistem ERP.</small>`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, Hapus Batch',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      batchToDelete.value = target;
      await executeDelete();
    }

    async function executeDelete() {
      showDeleteModal.value = false;
      const target = batchToDelete.value || form;
      const targetId = target?.id;
      const targetNoBatch = target?.noBatch || form.noBatch || 'transaksi';

      if (!targetId) return;

      try {
        if (isOnline.value) {
          const res = await fetch(`${API_BASE}/batches/${targetId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: currentUser.name })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Gagal menghapus di server');
        }
        batchList.value = batchList.value.filter(b => b.id !== targetId);
        showToast(`Batch ${targetNoBatch} berhasil dihapus dari sistem!`, 'success');

        if (form.id === targetId) {
          resetFormFields();
        }
        if (selectedDetailBatch.value && selectedDetailBatch.value.id === targetId) {
          closeDetailModal();
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        batchToDelete.value = null;
      }
    }

    const showChecklistModal = ref(false);
    const checklistItems = reactive([
      { id: 1, title: 'Invoice / Kuitansi Asli Bermaterai', desc: 'Sesuai UU Bea Meterai untuk transaksi di atas Rp 5.000.000', checked: true },
      { id: 2, title: 'Faktur Pajak Elektronik (e-Faktur DJP)', desc: 'Validasi QR Code DJP dan kesesuaian Nomor Seri Faktur Pajak', checked: true },
      { id: 3, title: 'Berita Acara Serah Terima (BAST) / SPK', desc: 'Ditandatangani oleh Pengawas Pekerjaan & Rekanan Penyedia', checked: true },
      { id: 4, title: 'Kesesuaian Kode Pembebanan COA & DHA', desc: 'Verifikasi pagu anggaran mencukupi pada SI-Anggaran BI', checked: true },
      { id: 5, title: 'Verifikasi Nomor Rekening Tujuan & NPWP', desc: 'Konfirmasi rekening bank aktif dan sesuai nama pada master rekanan', checked: true }
    ]);

    function openChecklistModal() {
      if (!hasPermission('batch_verify')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses verifikasi checklist kepatuhan (wewenang Checker / Super Admin).', 'warning');
        return;
      }
      showChecklistModal.value = true;
    }

    const showMasterModal = ref(false);
    const masterModalType = ref('rekanan');
    const masterModalTitle = computed(() => {
      if (masterModalType.value === 'rekanan') return 'Master Rekanan & Vendor';
      if (masterModalType.value === 'dha') return 'Daftar Himpunan Anggaran (DHA) & COA';
      return 'Daftar Pejabat Penandatangan';
    });

    function openMasterModal(type) {
      masterModalType.value = type;
      showMasterModal.value = true;
    }

    async function confirmExit() {
      const confirmed = await showSweetConfirm({
        title: 'Tutup Sesi Kerja?',
        html: 'Apakah Anda yakin ingin menutup sesi kerja <strong>Form Batch ERP</strong> dan keluar ke halaman login?',
        icon: 'question',
        confirmButtonText: '<i class="bi bi-box-arrow-right me-1"></i> Ya, Logout',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#e11d48',
        cancelButtonColor: '#64748b'
      });
      if (confirmed) {
        logoutUser();
      }
    }

    function printVoucher() {
      applyPrintSettingsToDOM();
      if (!form.noDokumen || totalNominalInvoice.value <= 0) {
        showToast('Lengkapi data dokumen dan nominal sebelum mencetak!', 'warning');
        return;
      }
      currentView.value = 'print';
      setTimeout(() => {
        window.print();
      }, 350);
    }

    function exportToCSV() {
      if (batchList.value.length === 0) {
        showToast('Tidak ada data batch untuk diekspor', 'warning');
        return;
      }
      const headers = ['No. Batch', 'No. Dokumen', 'Perihal', 'Tanggal', 'Dari Uker', 'Kepada Uker', 'Rekanan', 'Bank', 'No. Rekening', 'Nominal Total', 'Status'];
      const rows = batchList.value.map(b => [
        `"${b.noBatch}"`, `"${b.noDokumen}"`, `"${b.perihal.replace(/"/g, '""')}"`,
        `"${b.tglTransaksi}"`, `"${b.dariUker}"`, `"${b.kepadaUker}"`,
        `"${b.namaRekanan}"`, `"${b.namaBank}"`, `"'${b.nomorRekening}"`,
        calcBatchTotal(b), `"${b.status}"`
      ].join(','));
      const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `Batch_ERP_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Data batch berhasil diekspor ke file CSV!', 'success');
    }

    // Pengaturan Methods
    function saveSettings() {
      try {
        localStorage.setItem('bi_erp_user', JSON.stringify(currentUser));
        localStorage.setItem('bi_erp_settings', JSON.stringify(appSettings));
        showToast('Pengaturan sistem & profil operator berhasil disimpan!', 'success');
      } catch (e) {
        showToast('Gagal menyimpan pengaturan: ' + e.message, 'error');
      }
    }

    async function testServerConnection() {
      showToast('Memeriksa konektivitas REST API server & database...', 'info');
      try {
        const res = await fetch(`${API_BASE}/health`);
        if (res.ok) {
          isOnline.value = true;
          showToast('Koneksi ke backend REST API (port 5000) & database MySQL berhasil terhubung!', 'success');
        } else {
          isOnline.value = false;
          showToast('Backend REST API tidak merespons (Offline). Berjalan di Standalone Mode.', 'warning');
        }
      } catch (err) {
        isOnline.value = false;
        showToast('Gagal terhubung ke backend server: ' + err.message, 'error');
      }
    }

    async function refreshAllMasters() {
      showToast('Memuat ulang seluruh data master dari database...', 'info');
      await checkOnlineStatus();
      showToast('Seluruh data master (Pegawai, Bank, DHA, Rekanan) berhasil dimuat ulang!', 'success');
    }

    function exportAllDataJson() {
      try {
        const fullBackup = {
          exportDate: new Date().toISOString(),
          system: 'Bank Indonesia - Form Batch ERP',
          user: currentUser,
          settings: appSettings,
          batches: batchList.value,
          masters: {
            bankList: masterBankList.value,
            pegawaiList: pegawaiList.value,
            dhaList: dhaList.value,
            rekananPresets: rekananPresets.value,
            unitKerjaList: masterUnitKerjaList.value
          }
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `Backup_BI_ERP_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Full backup data sistem (JSON) berhasil diunduh!', 'success');
      } catch (e) {
        showToast('Gagal mengekspor data backup: ' + e.message, 'error');
      }
    }

    async function clearLocalCache() {
      const confirmed = await showSweetConfirm({
        title: 'Bersihkan Cache Lokal?',
        html: 'Apakah Anda yakin ingin membersihkan cache lokal browser? Data batch offline akan dibersihkan, namun data pada database server tetap aman.',
        icon: 'warning',
        confirmButtonText: 'Ya, Bersihkan Cache',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (!confirmed) return;
      localStorage.removeItem('bi_erp_batches');
      localStorage.removeItem('bi_erp_settings');
      showToast('Cache lokal browser berhasil dibersihkan!', 'info');
    }

    // ================= LAPORAN 1: LAPORAN INVOICE =================
    const laporanInvoiceSearch = ref('');
    const laporanInvoiceStatusFilter = ref('ALL');
    const laporanInvoiceUkerFilter = ref('ALL');

    const filteredLaporanInvoiceList = computed(() => {
      let list = batchList.value;
      if (laporanInvoiceStatusFilter.value !== 'ALL') {
        const filterVal = (laporanInvoiceStatusFilter.value || '').toLowerCase();
        if (filterVal === 'disetujui' || filterVal === 'approved') {
          list = list.filter(b => {
            const s = (b.status || '').toLowerCase();
            return s === 'approved' || s === 'disetujui' || s === 'selesai' || s === 'cair';
          });
        } else if (filterVal === 'ditolak') {
          list = list.filter(b => {
            const s = (b.status || '').toLowerCase();
            return s === 'ditolak' || s === 'rejected';
          });
        } else if (filterVal === 'draft') {
          list = list.filter(b => {
            const s = (b.status || '').toLowerCase();
            return s === 'draft' || s === 'diajukan' || s === 'menunggu proses' || !s;
          });
        } else {
          list = list.filter(b => (b.status || 'Draft').toLowerCase() === filterVal);
        }
      }
      if (laporanInvoiceUkerFilter.value !== 'ALL') {
        list = list.filter(b => b.dariUker === laporanInvoiceUkerFilter.value);
      }
      if (laporanInvoiceSearch.value && laporanInvoiceSearch.value.trim()) {
        const q = laporanInvoiceSearch.value.toLowerCase().trim();
        list = list.filter(b =>
          (b.noBatch && b.noBatch.toLowerCase().includes(q)) ||
          (b.noDokumen && b.noDokumen.toLowerCase().includes(q)) ||
          (b.perihal && b.perihal.toLowerCase().includes(q)) ||
          (b.namaRekanan && b.namaRekanan.toLowerCase().includes(q)) ||
          (b.namaDha && b.namaDha.toLowerCase().includes(q))
        );
      }
      return list;
    });

    const totalNominalLaporanInvoice = computed(() => {
      return filteredLaporanInvoiceList.value.reduce((acc, b) => acc + calcBatchTotal(b), 0);
    });

    const countLaporanInvoiceApproved = computed(() => {
      return filteredLaporanInvoiceList.value.filter(b => {
        const s = (b.status || '').toLowerCase();
        return s === 'approved' || s === 'disetujui' || s === 'selesai' || s === 'cair';
      }).length;
    });

    const countLaporanInvoicePending = computed(() => {
      return filteredLaporanInvoiceList.value.filter(b => {
        const s = (b.status || '').toLowerCase();
        return s !== 'approved' && s !== 'disetujui' && s !== 'selesai' && s !== 'cair' && s !== 'ditolak';
      }).length;
    });

    function exportLaporanInvoiceCSV() {
      if (filteredLaporanInvoiceList.value.length === 0) {
        showToast('Tidak ada data Laporan Invoice untuk diekspor', 'warning');
        return;
      }
      const headers = ['No. Batch', 'No. Dokumen', 'Tanggal Transaksi', 'Dari Uker', 'Kepada Uker', 'Perihal', 'Rekanan', 'Bank', 'No. Rekening', 'Nominal Total (Rp)', 'Status'];
      const rows = filteredLaporanInvoiceList.value.map(b => [
        `"${b.noBatch || ''}"`, `"${b.noDokumen || ''}"`, `"${b.tglTransaksi || ''}"`,
        `"${b.dariUker || ''}"`, `"${b.kepadaUker || ''}"`, `"${(b.perihal || '').replace(/"/g, '""')}"`,
        `"${b.namaRekanan || ''}"`, `"${b.namaBank || ''}"`, `"'${b.nomorRekening || ''}"`,
        calcBatchTotal(b), `"${b.status || 'Draft'}"`
      ].join(','));
      const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `Laporan_Invoice_AP_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Laporan Invoice berhasil diekspor ke CSV!', 'success');
    }

    // ================= LAPORAN 2: LAPORAN TRAVEL =================
    const laporanTravelSearch = ref('');
    const laporanTravelStatusFilter = ref('ALL');
    const laporanTravelList = ref([
      {
        id: 1,
        noSuratTugas: 'ST/01/JBR/2026',
        namaPegawai: 'Ahmad Fauzi',
        nip: '19880412 201202 1 002',
        satker: 'Unit Manajemen Keuangan KPw BI Jember',
        tglBerangkat: '2026-02-10',
        tglKembali: '2026-02-12',
        kotaTujuan: 'Surabaya, Jawa Timur',
        uraianTugas: 'Rapat Koordinasi Evaluasi Realisasi Anggaran KPw se-Jawa Timur',
        totalBiaya: 4850000,
        status: 'Selesai'
      },
      {
        id: 2,
        noSuratTugas: 'ST/04/JBR/2026',
        namaPegawai: 'Gunawan Prasetyo',
        nip: '19750820 199903 1 001',
        satker: 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)',
        tglBerangkat: '2026-02-18',
        tglKembali: '2026-02-20',
        kotaTujuan: 'Banyuwangi & Situbondo',
        uraianTugas: 'Monitoring Distribusi Kas Keliling & Sosialisasi CBP Rupiah Wilayah Kerja',
        totalBiaya: 6200000,
        status: 'Terverifikasi'
      },
      {
        id: 3,
        noSuratTugas: 'ST/07/JBR/2026',
        namaPegawai: 'Siti Rahmawati, S.E.',
        nip: '19830615 200812 2 001',
        satker: 'Unit Manajemen Keuangan KPw BI Jember',
        tglBerangkat: '2026-03-02',
        tglKembali: '2026-03-05',
        kotaTujuan: 'Jakarta Pusat (Kantor Pusat BI)',
        uraianTugas: 'Pelatihan Implementasi Modul Baru ERPHRIS & Rekonsiliasi AP Nasional',
        totalBiaya: 8950000,
        status: 'Disetujui'
      },
      {
        id: 4,
        noSuratTugas: 'ST/11/JBR/2026',
        namaPegawai: 'Dra. Endang Sulistiyowati',
        nip: '19701105 199603 2 001',
        satker: 'Unit Manajemen Logistik & Rumah Tangga',
        tglBerangkat: '2026-03-12',
        tglKembali: '2026-03-13',
        kotaTujuan: 'Malang, Jawa Timur',
        uraianTugas: 'Survey Pengadaan Sarpras Penunjang Operasional Gedung Kantor',
        totalBiaya: 3400000,
        status: 'Sedang Berjalan'
      }
    ]);

    const filteredLaporanTravelList = computed(() => {
      let list = laporanTravelList.value;
      if (laporanTravelStatusFilter.value !== 'ALL') {
        list = list.filter(t => t.status === laporanTravelStatusFilter.value);
      }
      if (laporanTravelSearch.value && laporanTravelSearch.value.trim()) {
        const q = laporanTravelSearch.value.toLowerCase().trim();
        list = list.filter(t =>
          t.noSuratTugas.toLowerCase().includes(q) ||
          t.namaPegawai.toLowerCase().includes(q) ||
          t.kotaTujuan.toLowerCase().includes(q) ||
          t.uraianTugas.toLowerCase().includes(q) ||
          t.satker.toLowerCase().includes(q)
        );
      }
      return list;
    });

    const totalNominalLaporanTravel = computed(() => {
      return filteredLaporanTravelList.value.reduce((acc, t) => acc + (t.totalBiaya || 0), 0);
    });

    function exportLaporanTravelCSV() {
      if (filteredLaporanTravelList.value.length === 0) {
        showToast('Tidak ada data Laporan Travel untuk diekspor', 'warning');
        return;
      }
      const headers = ['No. Surat Tugas', 'Nama Pegawai', 'NIP', 'Satker', 'Tgl Berangkat', 'Tgl Kembali', 'Kota Tujuan', 'Uraian Tugas', 'Total Biaya (Rp)', 'Status'];
      const rows = filteredLaporanTravelList.value.map(t => [
        `"${t.noSuratTugas}"`, `"${t.namaPegawai}"`, `"'${t.nip}"`,
        `"${t.satker}"`, `"${t.tglBerangkat}"`, `"${t.tglKembali}"`,
        `"${t.kotaTujuan}"`, `"${t.uraianTugas.replace(/"/g, '""')}"`,
        t.totalBiaya, `"${t.status}"`
      ].join(','));
      const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `Laporan_Travel_ERPHRIS_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Laporan Travel berhasil diekspor ke CSV!', 'success');
    }

    // ================= LAPORAN 3: LAPORAN PENARIKAN =================
    const laporanPenarikanSearch = ref('');
    const laporanPenarikanStatusFilter = ref('ALL');
    const laporanPenarikanList = ref([
      {
        id: 1,
        noPenarikan: 'UM-2026/001',
        tglPenarikan: '2026-01-15',
        penerima: 'Bambang Setyawan, S.Kom.',
        satker: 'Unit Operasional Sistem Pembayaran & PUR',
        keperluan: 'Uang Muka Operasional Kas Titipan & Edukasi BI-FAST Masyarakat',
        nominal: 15000000,
        batasPjum: '2026-02-14',
        status: 'Lunas'
      },
      {
        id: 2,
        noPenarikan: 'UM-2026/002',
        tglPenarikan: '2026-02-01',
        penerima: 'Dewi Lestari, M.M.',
        satker: 'Fungsi Kehumasan & Komunikasi Kebijakan',
        keperluan: 'Uang Muka Penyelenggaraan Temu Media & Diseminasi Laporan Perekonomian',
        nominal: 25000000,
        batasPjum: '2026-03-03',
        status: 'Lunas'
      },
      {
        id: 3,
        noPenarikan: 'UM-2026/003',
        tglPenarikan: '2026-02-25',
        penerima: 'Ahmad Fauzi',
        satker: 'Unit Manajemen Keuangan KPw BI Jember',
        keperluan: 'Uang Muka Operasional Audit Kepatuhan Administrasi Keuangan Triwulan I',
        nominal: 12500000,
        batasPjum: '2026-03-27',
        status: 'Menunggu PJUM'
      },
      {
        id: 4,
        noPenarikan: 'UM-2026/004',
        tglPenarikan: '2026-03-10',
        penerima: 'Hendri Kurniawan, S.T.',
        satker: 'Unit Manajemen Logistik & Rumah Tangga',
        keperluan: 'Uang Muka Pemeliharaan Insidental Generator Listrik & Plumbing Kantor',
        nominal: 18000000,
        batasPjum: '2026-04-09',
        status: 'Aktif / Berjalan'
      }
    ]);

    const filteredLaporanPenarikanList = computed(() => {
      let list = laporanPenarikanList.value;
      if (laporanPenarikanStatusFilter.value !== 'ALL') {
        list = list.filter(p => p.status === laporanPenarikanStatusFilter.value);
      }
      if (laporanPenarikanSearch.value && laporanPenarikanSearch.value.trim()) {
        const q = laporanPenarikanSearch.value.toLowerCase().trim();
        list = list.filter(p =>
          p.noPenarikan.toLowerCase().includes(q) ||
          p.penerima.toLowerCase().includes(q) ||
          p.satker.toLowerCase().includes(q) ||
          p.keperluan.toLowerCase().includes(q)
        );
      }
      return list;
    });

    const totalNominalLaporanPenarikan = computed(() => {
      return filteredLaporanPenarikanList.value.reduce((acc, p) => acc + (p.nominal || 0), 0);
    });

    function exportLaporanPenarikanCSV() {
      if (filteredLaporanPenarikanList.value.length === 0) {
        showToast('Tidak ada data Laporan Penarikan untuk diekspor', 'warning');
        return;
      }
      const headers = ['No. Penarikan UM', 'Tanggal Cair', 'Penerima UMK', 'Satker', 'Keperluan', 'Nominal UMK (Rp)', 'Batas Waktu PJUM', 'Status'];
      const rows = filteredLaporanPenarikanList.value.map(p => [
        `"${p.noPenarikan}"`, `"${p.tglPenarikan}"`, `"${p.penerima}"`,
        `"${p.satker}"`, `"${p.keperluan.replace(/"/g, '""')}"`,
        p.nominal, `"${p.batasPjum}"`, `"${p.status}"`
      ].join(','));
      const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `Laporan_Penarikan_UMK_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Laporan Penarikan berhasil diekspor ke CSV!', 'success');
    }

    // ================= LAPORAN 4: LAPORAN PERTANGGUNGJAWABAN UANG =================
    const laporanPjumSearch = ref('');
    const laporanPjumStatusFilter = ref('ALL');
    const laporanPjumList = ref([
      {
        id: 1,
        noPjum: 'PJUM-2026/001',
        noRefPenarikan: 'UM-2026/001',
        tglPjum: '2026-02-10',
        penanggungJawab: 'Bambang Setyawan, S.Kom.',
        satker: 'Unit Operasional Sistem Pembayaran & PUR',
        nominalUm: 15000000,
        realisasi: 14750000,
        sisaKas: 250000,
        verifikator: 'Rina Marlina, S.E.',
        status: 'Terverifikasi Lengkap'
      },
      {
        id: 2,
        noPjum: 'PJUM-2026/002',
        noRefPenarikan: 'UM-2026/002',
        tglPjum: '2026-02-28',
        penanggungJawab: 'Dewi Lestari, M.M.',
        satker: 'Fungsi Kehumasan & Komunikasi Kebijakan',
        nominalUm: 25000000,
        realisasi: 25000000,
        sisaKas: 0,
        verifikator: 'Rina Marlina, S.E.',
        status: 'Terverifikasi Lengkap'
      },
      {
        id: 3,
        noPjum: 'PJUM-2026/003',
        noRefPenarikan: 'UM-2026/003',
        tglPjum: '2026-03-20',
        penanggungJawab: 'Ahmad Fauzi',
        satker: 'Unit Manajemen Keuangan KPw BI Jember',
        nominalUm: 12500000,
        realisasi: 11900000,
        sisaKas: 600000,
        verifikator: 'Siti Rahmawati, S.E.',
        status: 'Dalam Audit Rekonsiliasi'
      }
    ]);

    const filteredLaporanPjumList = computed(() => {
      let list = laporanPjumList.value;
      if (laporanPjumStatusFilter.value !== 'ALL') {
        list = list.filter(p => p.status === laporanPjumStatusFilter.value);
      }
      if (laporanPjumSearch.value && laporanPjumSearch.value.trim()) {
        const q = laporanPjumSearch.value.toLowerCase().trim();
        list = list.filter(p =>
          p.noPjum.toLowerCase().includes(q) ||
          p.noRefPenarikan.toLowerCase().includes(q) ||
          p.penanggungJawab.toLowerCase().includes(q) ||
          p.satker.toLowerCase().includes(q) ||
          p.verifikator.toLowerCase().includes(q)
        );
      }
      return list;
    });

    const totalNominalLaporanPjum = computed(() => {
      return filteredLaporanPjumList.value.reduce((acc, p) => acc + (p.realisasi || 0), 0);
    });

    const totalSisaLaporanPjum = computed(() => {
      return filteredLaporanPjumList.value.reduce((acc, p) => acc + (p.sisaKas || 0), 0);
    });

    function exportLaporanPjumCSV() {
      if (filteredLaporanPjumList.value.length === 0) {
        showToast('Tidak ada data Laporan PJUM untuk diekspor', 'warning');
        return;
      }
      const headers = ['No. Dokumen PJUM', 'Ref No. Penarikan', 'Tanggal PJUM', 'Penanggung Jawab', 'Satker', 'Nominal UM Awal (Rp)', 'Realisasi Belanja (Rp)', 'Sisa Setor Kas (Rp)', 'Verifikator', 'Status'];
      const rows = filteredLaporanPjumList.value.map(p => [
        `"${p.noPjum}"`, `"${p.noRefPenarikan}"`, `"${p.tglPjum}"`,
        `"${p.penanggungJawab}"`, `"${p.satker}"`,
        p.nominalUm, p.realisasi, p.sisaKas,
        `"${p.verifikator}"`, `"${p.status}"`
      ].join(','));
      const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
      const uri = encodeURI(csv);
      const link = document.createElement('a');
      link.setAttribute('href', uri);
      link.setAttribute('download', `Laporan_PJUM_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Laporan PJUM berhasil diekspor ke CSV!', 'success');
    }

    const toasts = ref([]);
    function showToast(message, type = 'info') {
      let finalMsg = message;
      let finalType = type;

      const lower = String(message || '').trim().toLowerCase();
      if (lower === 'logout' || lower === 'berhasil logout' || lower === 'sesi keluar') {
        finalMsg = 'Berhasil logout dari sistem.';
        finalType = 'logout';
      } else if (lower === 'login berhasil' || lower === 'berhasil login' || lower === 'login') {
        finalMsg = 'Login berhasil! Selamat datang di Sistem PERKUSI.';
        finalType = 'success';
      } else if (lower === 'berhasil tersimpan' || lower === 'tersimpan' || lower === 'data berhasil disimpan' || lower === 'simpan berhasil' || lower === 'berhasil disimpan') {
        finalMsg = 'Data berhasil disimpan.';
        finalType = 'success';
      } else if (lower === 'data belum lengkap' || lower === 'belum lengkap' || lower === 'form belum lengkap') {
        finalMsg = 'Data belum lengkap! Harap periksa kolom yang wajib diisi.';
        finalType = 'warning';
      }

      const id = Date.now() + Math.random();
      toasts.value.push({ id, message: finalMsg, type: finalType });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 4000);
    }
    function removeToast(id) {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }

    if (typeof window !== 'undefined') {
      window.showToast = showToast;
    }


    onMounted(() => {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('bi_erp_theme', 'light');
      applyPrintSettingsToDOM();
      // Load saved settings & user
      try {
        const savedAuth = localStorage.getItem('bi_erp_auth_user') || sessionStorage.getItem('bi_erp_auth_user');
        if (savedAuth) {
          const authUser = JSON.parse(savedAuth);
          if (authUser && (authUser.namaLengkap || authUser.username)) {
            currentUser.name = authUser.namaLengkap || currentUser.name;
            currentUser.nip = authUser.nip || currentUser.nip;
            currentUser.role = authUser.roleName || currentUser.role;
            currentUser.satker = authUser.satker || currentUser.satker;
            currentUser.email = authUser.email || currentUser.email;
            currentUser.roleKey = authUser.roleKey || currentUser.roleKey;
            currentUser.username = authUser.username || currentUser.username;
            isLoggedIn.value = true;
          }
        } else {
          isLoggedIn.value = false;
        }

        const savedUser = localStorage.getItem('bi_erp_user');
        if (savedUser && !savedAuth) {
          Object.assign(currentUser, JSON.parse(savedUser));
        }
        const savedSettings = localStorage.getItem('bi_erp_settings');
        if (savedSettings) {
          Object.assign(appSettings, JSON.parse(savedSettings));
        }
      } catch (e) {}
      if (!batchList.value || batchList.value.length === 0) {
        batchList.value = JSON.parse(JSON.stringify(initialBatches));
      }
      checkOnlineStatus();
      window.addEventListener('click', closeAllSearchableDropdowns);
      window.addEventListener('popstate', (event) => {
        const v = (event && event.state && event.state.view) || getViewFromUrl();
        if (v && validViews.includes(v)) {
          currentView.value = v;
          ensureMenuOpenForView(v);
        } else if (!v) {
          currentView.value = 'dashboard';
        }
      });
    });

    return {
      isLoggedIn, isLoggingIn, loginForm, loginErrorMessage, loginSuccessMessage,
      showLoginPassword, isLoginFocusedField, isCapsLockActive, showForgotModal,
      showQuickRolesLogin, defaultQuickUsers, applyQuickLoginUser, submitLogin,
      logoutUser, handleLoginSuccess,
      currentView, activeTab, isSidebarCollapsed, showUserMenu, currentTheme, isOnline, isSubmitting, currentUser, liveTime, toggleTheme,
      getViewUrl, navigateView, handleDropdownToggle,
      userRoles, rbacMatrixItems, isMatrixDirty, matrixSearchKeyword, matrixRoleFilter, filteredRbacMatrixItems,
      toggleRolePermission, bulkSetRolePermissions, saveRbacMatrix, resetRbacMatrixToDefault, switchTestRole, exportRbacMatrixCSV, hasPermission,
      canAccessView, getViewRequiredPermission, getPermissionName,
      ukerList, rekananPresets, bankList, tipePembayaranList, jenisInvoiceList, dhaList, coaList,
      pejabatPengajuList, pejabatPenyetujuList, form, batchList, selectedBatchId,
      totalNominalInvoice, filledInvoicesCount, totalNominalCoa, selisihCoa, isCoaBalanced,
      terbilangInvoice, currentDha, sisaSaldoDha, persentaseDha, activeInvoices, activeCoas,
      stats, approvedBatchCount, pendingBatchCount, calcBatchTotal, formatCurrency, formatDateIndo,
      formatIsoToDmy, parseDmyToIso, handleDateTextInput, handleDateBlur, openDatePickerNative,
      clearInvoiceSlot, clearCoaSlot,
      autoBalanceCoa, onSelectRekanan, onSelectPengaju, onSelectPenyetuju, checkDocUniqueness,
      docDuplicateWarning, tableSearchKeyword, tableCriteria, tableStatusFilter, tableSortBy,
      tableSortOrder, currentPage, pageSize, filteredBatches, totalPages, paginatedBatches,
      changeSort, loadBatchToForm, startNewBatch, saveBatch, showReplaceModal, confirmReplace, executeReplace,
      confirmClear, showDeleteModal, batchToDelete, confirmDelete, executeDelete, showChecklistModal,
      checklistItems, openChecklistModal, showMasterModal, masterModalType, masterModalTitle, openMasterModal,
      confirmExit, triggerPrint, printVoucher, exportToCSV,
      printSettings, showPrintConfigModal, openPrintConfigModal, closePrintConfigModal,
      savePrintSettings, resetPrintSettings, applyMarginPreset, onCustomMarginChange,
      applyPrintSettingsToDOM, previewSheetStyle, printWithCurrentSettings, getFontFamilyCss, previewPrintDocument,
      toasts, showToast, removeToast,
      isErphrisMenuOpen, isLaporanMenuOpen, isDataMasterMenuOpen, previousView, goBack,
      invoiceApSearch, invoiceApDhaFilter, selectedDetailBatch, showDetailModal,
      filteredInvoiceApBatches, openDetailModal, closeDetailModal, angkaKeTerbilang,
      getBatchStatusBadgeClass, getDetailInvoices, getDetailCoas, approveBatchDetail, rejectBatchDetail, printBatchDetail,
      pegawaiList, pegawaiSearch, filteredPegawaiList,
      masterBankList, bankSearch, filteredMasterBankList,
      showBankModal, bankFormMode, bankForm, openBankModal, editBank, saveBank, deleteBank,
      masterUnitKerjaList, unitKerjaSearch, filteredUnitKerjaList,
      showUnitKerjaModal, unitKerjaFormMode, unitKerjaForm,
      openUnitKerjaModal, editUnitKerja, saveUnitKerja, deleteUnitKerja,
      showPegawaiModal, pegawaiFormMode, pegawaiForm,
      openPegawaiModal, editPegawai, savePegawai, deletePegawai,
      rekananSearch, filteredRekananList, showRekananModal, rekananFormMode, rekananForm,
      openRekananModal, editRekanan, saveRekanan, deleteRekanan,
      isRekananBankDropdownOpen, rekananBankSearchText, activeRekananBankIndex,
      allBankOptions, filteredRekananBankOptions, displayedRekananBankOptions,
      openRekananBankDropdown, toggleRekananBankDropdown, onRekananBankInput,
      selectRekananBank, clearRekananBank, onRekananBankKeydown,
      dhaSearch, filteredDhaList, totalAnggaranDha, uniqueNaturalAkunCount,
      showDhaModal, dhaFormMode, dhaForm, openDhaModal, editDha, saveDha, deleteDha,
      exportDhaToExcel, downloadDhaTemplate,
      showImportDhaModal, openImportDhaModal, closeImportDhaModal,
      importDhaFile, importDhaFileName, importDhaParsedData, importDhaMode, isImportingDha, importDhaError,
      dhaFileInput, triggerFileInput, handleFileChange, handleFileDrop, processImportDha,
      importDhaTotalAnggaran, importDhaPreviewRows,
      settingTab, appSettings, saveSettings, testServerConnection, refreshAllMasters, exportAllDataJson, clearLocalCache,
      laporanInvoiceSearch, laporanInvoiceStatusFilter, laporanInvoiceUkerFilter, filteredLaporanInvoiceList, totalNominalLaporanInvoice, countLaporanInvoiceApproved, countLaporanInvoicePending, exportLaporanInvoiceCSV,
      laporanTravelSearch, laporanTravelStatusFilter, laporanTravelList, filteredLaporanTravelList, totalNominalLaporanTravel, exportLaporanTravelCSV,
      laporanPenarikanSearch, laporanPenarikanStatusFilter, laporanPenarikanList, filteredLaporanPenarikanList, totalNominalLaporanPenarikan, exportLaporanPenarikanCSV,
      laporanPjumSearch, laporanPjumStatusFilter, laporanPjumList, filteredLaporanPjumList, totalNominalLaporanPjum, totalSisaLaporanPjum, exportLaporanPjumCSV,
      currentStep, invoiceApSubView, confirmCheck, defaultPartners, onPartnerChange, chosenPartner,
      isPartnerDropdownOpen, partnerSearchText, activePartnerIndex, allPartnerList,
      filteredPartnerOptions, displayedPartnerOptions, exactPartnerMatch,
      openPartnerDropdown, togglePartnerDropdown, onPartnerInput,
      selectPartnerOption, selectNewManualPartner, clearPartnerSelection, onPartnerKeydown,
      isPengajuDropdownOpen, pengajuSearchText, activePengajuIndex,
      isPenyetujuDropdownOpen, penyetujuSearchText, activePenyetujuIndex,
      allPegawaiOptions, filteredPengajuOptions, displayedPengajuOptions,
      filteredPenyetujuOptions, displayedPenyetujuOptions,
      openPengajuDropdown, togglePengajuDropdown, onPengajuInput, selectPengaju, clearPengaju, onPengajuKeydown,
      openPenyetujuDropdown, togglePenyetujuDropdown, onPenyetujuInput, selectPenyetuju, clearPenyetuju, onPenyetujuKeydown,
      formatRupiah, formatCompactRupiah, formatShortDate,
      formatRupiahInput, parseRupiahInput, formatFromRawString,
      handleInvoiceNominalInput, handleInvoiceNominalBlur,
      handleCoaNominalInput, handleCoaNominalBlur,
      handleDhaAnggaranInput, handleDhaAnggaranBlur, handleNominalFocus,
      invoiceTotal, invoiceCount, coaTotal, coaDiff, coaStatus,
      validateStep1, validateStep2, setStep, nextStep, prevStep, jumpStep, clearInvoices,
      resetFormBatch, resetFormBatchDirect, saveDraftBatch, saveCompleteBatch, openBatchInForm,
      historySearch, historyStatusFilter, filteredHistoryBatches, historyTotalNominal, historyDraftCount,
      isDhaDropdownOpen, dhaFilterText, dhaSearchInputRef,
      isCoaDropdownOpen, coaFilterText, uniqueDhaList, filteredDhaOptions,
      toggleDhaDropdown, selectDha, clearDhaSelection,
      toggleCoaDropdown, getFilteredCoaOptions, selectCoa, clearCoaSelection,
      isTunai, onTipePembayaranChange, unitKerjaOptions
    };
  }
}).mount('#app');
