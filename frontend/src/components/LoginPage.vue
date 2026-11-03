<template>
  <div class="bi-login-page login-page">
    <!-- Kartu login (Ukuran Full Layar Edge-to-Edge) -->
    <div class="login-card-container login-card">
      <!-- Left Side: Brand Showcase & Institutional Identity -->
      <div class="login-brand-panel login-left">
        <!-- Ambient Animated Glow Background Elements -->
        <div class="bg-glow bg-glow-1"></div>
        <div class="bg-glow bg-glow-2"></div>
        <div class="bg-glow bg-glow-3"></div>
        <div class="bg-grid-pattern"></div>

        <div class="brand-panel-header">
            <!-- Bank Indonesia Official-Style Emblem SVG -->
            <div class="bi-crest-badge">
              <svg viewBox="0 0 100 100" class="bi-crest-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="46" stroke="url(#biGoldGrad)" stroke-width="2.5" />
                <circle cx="50" cy="50" r="42" fill="url(#biNavyGrad)" />
                <circle cx="50" cy="50" r="39" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1" stroke-dasharray="3 3" />
                <!-- BI Stylized Shield / Monogram -->
                <path d="M50 16L72 26V48C72 63.5 62.5 77 50 82C37.5 77 28 63.5 28 48V26L50 16Z" fill="url(#biShieldGrad)" stroke="#f59e0b" stroke-width="1.8"/>
                <path d="M42 36H53C56.5 36 59 38 59 41C59 43.5 57.5 45 55 45.8C58.2 46.5 60 48.5 60 52C60 56 56.5 58 52 58H42V36ZM47 44H52C53.8 44 55 43 55 41.5C55 40 53.8 39.2 52 39.2H47V44ZM47 55H52.5C54.5 55 55.8 54 55.8 52C55.8 50 54.5 49 52.5 49H47V55Z" fill="#ffffff" />
                <path d="M63 36H68V58H63V36Z" fill="#fbbf24" />
                <defs>
                  <linearGradient id="biGoldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fbbf24" />
                    <stop offset="0.5" stop-color="#f59e0b" />
                    <stop offset="1" stop-color="#b45309" />
                  </linearGradient>
                  <linearGradient id="biNavyGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1e3a8a" />
                    <stop offset="1" stop-color="#0a1128" />
                  </linearGradient>
                  <linearGradient id="biShieldGrad" x1="28" y1="16" x2="72" y2="82" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#1e40af" />
                    <stop offset="1" stop-color="#0f172a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="brand-panel-text">
              <span class="bi-sub-label">BANK INDONESIA</span>
              <span class="bi-office-label">KANTOR PERWAKILAN JEMBER</span>
            </div>
          </div>

          <div class="brand-panel-body">
            <div class="app-title-badge">
              <span class="pulse-indicator"></span>
              Sistem Keuangan Terpadu & Otorisasi
            </div>
            <h1 class="app-display-title">PERKUSI</h1>
            <p class="app-display-desc">
              <strong>Pengelolaan Keuangan & Anggaran Terintegrasi</strong> — Modul Form Batch ERP, Verifikasi Dokumen Faktur/Pajak, Alokasi COA & DHA, serta Otorisasi Pembayaran Multi-Tingkat.
            </p>

            <!-- Feature Badges -->
            <div class="brand-features-list">
              <div class="feature-item">
                <div class="feature-icon"><i class="bi bi-shield-check"></i></div>
                <div class="feature-info">
                  <strong>Role-Based Access Control (RBAC)</strong>
                  <span>Maker, Checker, Approver & Auditor dengan audit log transparan</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><i class="bi bi-journal-bookmark-fill"></i></div>
                <div class="feature-info">
                  <strong>Formulir ERPHRIS & SPBY</strong>
                  <span>Invoice AP, Travel Event, Penarikan & Pertanggungjawaban UM</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon"><i class="bi bi-lock-fill"></i></div>
                <div class="feature-info">
                  <strong>Standar Keamanan Tingkat Tinggi</strong>
                  <span>Terenkripsi 256-bit TLS sesuai pedoman tata kelola TI Bank Indonesia</span>
                </div>
              </div>
            </div>
          </div>

          <div class="brand-panel-footer">
            <div class="system-status-indicator">
              <span class="status-radar" :class="isOnline ? 'radar-online' : 'radar-standby'"></span>
              <span>Status Server: <strong>{{ isOnline ? 'REST API Terhubung' : 'Mode Offline / Siaga' }}</strong></span>
            </div>
            <div class="version-tag">v2.4.0 • Enterprise</div>
          </div>
        </div>

        <!-- Right Side: Interactive Login Portal -->
        <div class="login-form-panel login-right">
          <div class="login-form-inner">
            <div class="form-panel-header">
            <div class="header-seal-mobile d-md-none mb-3">
              <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill fw-medium">
                <i class="bi bi-bank me-1"></i> Bank Indonesia KPw Jember
              </span>
            </div>
            <h2 class="form-panel-title">Portal Masuk Pegawai</h2>
            <p class="form-panel-subtitle">Silakan autentikasi menggunakan Akun Resmi atau NIP Pegawai</p>
          </div>

          <!-- Alert Notification -->
          <div v-if="errorMessage" class="login-alert-box alert-danger-custom" role="alert">
            <i class="bi bi-exclamation-triangle-fill alert-icon"></i>
            <div class="alert-content">
              <strong>Gagal Masuk</strong>
              <span>{{ errorMessage }}</span>
            </div>
            <button type="button" class="btn-close-alert" @click="errorMessage = ''" aria-label="Tutup">
              <i class="bi bi-x"></i>
            </button>
          </div>

          <div v-if="successMessage" class="login-alert-box alert-success-custom" role="alert">
            <i class="bi bi-check-circle-fill alert-icon"></i>
            <div class="alert-content">
              <strong>Autentikasi Berhasil</strong>
              <span>{{ successMessage }}</span>
            </div>
          </div>

          <!-- Form Input Fields -->
          <form @submit.prevent="submitLogin" class="login-form-body">
            <!-- Username / NIP Field -->
            <div class="form-group-custom">
              <label for="login-username" class="form-label-custom">
                <span>Username, NIP, atau Email BI</span>
                <span class="required-star">*</span>
              </label>
              <div class="input-icon-wrapper" :class="{ 'focused': isFocusedField === 'username' }">
                <i class="bi bi-person-badge input-lead-icon"></i>
                <input
                  id="login-username"
                  type="text"
                  v-model="form.username"
                  @focus="isFocusedField = 'username'"
                  @blur="isFocusedField = ''"
                  placeholder="Contoh: ahmad.fauzi atau 19850315..."
                  autocomplete="username"
                  class="form-control-custom"
                  required
                  :disabled="isLoading"
                />
                <button
                  v-if="form.username"
                  type="button"
                  class="input-clear-btn"
                  @click="form.username = ''"
                  title="Hapus"
                >
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </div>

            <!-- Password Field -->
            <div class="form-group-custom">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label for="login-password" class="form-label-custom mb-0">
                  <span>Kata Sandi / Password</span>
                  <span class="required-star">*</span>
                </label>
                <a href="javascript:void(0)" class="link-forgot-password" @click="openForgotModal">
                  Lupa kata sandi?
                </a>
              </div>
              <div class="input-icon-wrapper" :class="{ 'focused': isFocusedField === 'password' }">
                <i class="bi bi-shield-lock input-lead-icon"></i>
                <input
                  id="login-password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.password"
                  @focus="isFocusedField = 'password'"
                  @blur="isFocusedField = ''"
                  @keyup="checkCapsLock"
                  placeholder="Masukkan kata sandi..."
                  autocomplete="current-password"
                  class="form-control-custom"
                  required
                  :disabled="isLoading"
                />
                <button
                  type="button"
                  class="input-eye-btn"
                  @click="showPassword = !showPassword"
                  :title="showPassword ? 'Sembunyikan password' : 'Lihat password'"
                >
                  <i class="bi" :class="showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"></i>
                </button>
              </div>
              <div v-if="isCapsLockOn" class="capslock-warning">
                <i class="bi bi-arrow-up-square-fill me-1"></i> Caps Lock dalam keadaan AKTIF
              </div>
            </div>

            <!-- Remember Me & Security Meta -->
            <div class="form-options-row">
              <label class="custom-checkbox-container">
                <input type="checkbox" v-model="form.rememberMe" :disabled="isLoading" />
                <span class="checkbox-checkmark"></span>
                <span class="checkbox-label-text">Ingat sesi di perangkat ini</span>
              </label>
              <div class="security-chip" title="Data dienkripsi secara aman">
                <i class="bi bi-patch-check-fill text-emerald me-1"></i>
                <span>SSL Secured</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn-login-submit"
              :class="{ 'btn-loading': isLoading }"
              :disabled="isLoading || !form.username"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else class="bi bi-box-arrow-in-right me-2"></i>
              <span>{{ isLoading ? 'Memverifikasi Kredensial...' : 'Masuk ke Sistem PERKUSI' }}</span>
            </button>
          </form>

            <!-- Bottom Footer Note -->
            <div class="login-card-footer">
              <div class="bi-security-notice">
                <i class="bi bi-shield-shaded me-1"></i>
                <span>Akses sistem ini terbatas khusus bagi pegawai Bank Indonesia yang berwenang. Segala aktivitas pencatatan dan perubahan data transaksi diawasi oleh Audit Internal.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Help / Forgot Password Modal -->
    <div v-if="showForgotModal" class="bi-modal-backdrop" @click.self="showForgotModal = false">
      <div class="bi-modal-dialog">
        <div class="bi-modal-content">
          <div class="bi-modal-header">
            <div class="d-flex align-items-center gap-2">
              <div class="modal-header-icon bg-blue-subtle text-primary">
                <i class="bi bi-key-fill"></i>
              </div>
              <h5 class="modal-title mb-0 fw-bold">Bantuan Akses & Reset Kata Sandi</h5>
            </div>
            <button type="button" class="btn-close" @click="showForgotModal = false"></button>
          </div>
          <div class="bi-modal-body">
            <div class="alert alert-info border-0 rounded-3 mb-3">
              <i class="bi bi-info-circle-fill me-1"></i>
              Untuk menjaga integritas dan kepatuhan sistem keuangan Bank Indonesia, pemulihan kata sandi dilakukan melalui verifikasi Administrator Satker.
            </div>

            <h6 class="fw-bold text-dark mb-2">Panduan Akun Default / Evaluasi:</h6>
            <div class="table-responsive mb-3">
              <table class="table table-sm table-bordered align-middle small mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Peran / Jabatan</th>
                    <th>Username</th>
                    <th>Password Bawaan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="badge bg-danger-subtle text-danger">Super Admin</span></td>
                    <td><code>hadi.sarosa</code></td>
                    <td><code>password123</code></td>
                  </tr>
                  <tr>
                    <td><span class="badge bg-primary-subtle text-primary">Maker (Operator)</span></td>
                    <td><code>ahmad.fauzi</code></td>
                    <td><code>password123</code></td>
                  </tr>
                  <tr>
                    <td><span class="badge bg-warning-subtle text-warning-emphasis">Checker (Verifikator)</span></td>
                    <td><code>rina.wulandari</code></td>
                    <td><code>password123</code></td>
                  </tr>
                  <tr>
                    <td><span class="badge bg-success-subtle text-success">Approver (Penyetuju)</span></td>
                    <td><code>doni.prasetiyo</code></td>
                    <td><code>password123</code></td>
                  </tr>
                  <tr>
                    <td><span class="badge bg-indigo-subtle text-indigo">Auditor (Pengawas)</span></td>
                    <td><code>sri.wahyuni</code></td>
                    <td><code>password123</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="helpdesk-contact-card">
              <div class="fw-semibold text-slate-800 mb-1">Hubungi Administrator Sistem:</div>
              <div class="small text-muted mb-1"><i class="bi bi-building me-1"></i> Unit Manajemen Keuangan KPw BI Jember</div>
              <div class="small text-muted mb-1"><i class="bi bi-envelope me-1"></i> helpdesk.erp@bi.go.id</div>
              <div class="small text-muted"><i class="bi bi-telephone me-1"></i> Ext. Keuangan: 248-01 / 248-02</div>
            </div>
          </div>
          <div class="bi-modal-footer">
            <button type="button" class="btn btn-secondary px-4" @click="showForgotModal = false">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { loginApi } from '../services/api';

export default {
  name: 'LoginPage',
  props: {
    isOnline: {
      type: Boolean,
      default: false
    },
    usersList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['login-success'],
  setup(props, { emit }) {
    const isLoading = ref(false);
    const errorMessage = ref('');
    const successMessage = ref('');
    const showPassword = ref(false);
    const isFocusedField = ref('');
    const isCapsLockOn = ref(false);
    const showForgotModal = ref(false);
    const showQuickRoles = ref(true);

    const form = reactive({
      username: '',
      password: '',
      rememberMe: true
    });

    // Preset quick role accounts for Bank Indonesia ERP evaluation
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

    const quickRoleUsers = computed(() => {
      if (props.usersList && props.usersList.length >= 4) {
        return props.usersList.slice(0, 5).map(u => ({
          username: u.username,
          namaLengkap: u.namaLengkap,
          roleKey: u.roleKey,
          roleName: u.roleName || u.roleKey,
          badgeClass: getRoleBadge(u.roleKey),
          nip: u.nip || '',
          satker: u.satker || 'Kantor Perwakilan BI Jember',
          email: u.email || ''
        }));
      }
      return defaultQuickUsers;
    });

    function getRoleBadge(roleKey) {
      switch (roleKey) {
        case 'super_admin': return 'tag-rose';
        case 'maker': return 'tag-navy';
        case 'checker': return 'tag-amber';
        case 'approver': return 'tag-emerald';
        case 'auditor': return 'tag-indigo';
        default: return 'tag-navy';
      }
    }

    function getRoleColorClass(roleKey) {
      switch (roleKey) {
        case 'super_admin': return 'avatar-rose';
        case 'maker': return 'avatar-navy';
        case 'checker': return 'avatar-amber';
        case 'approver': return 'avatar-emerald';
        case 'auditor': return 'avatar-indigo';
        default: return 'avatar-navy';
      }
    }

    function checkCapsLock(event) {
      isCapsLockOn.value = event.getModifierState && event.getModifierState('CapsLock');
    }

    function applyQuickUser(u) {
      form.username = u.username;
      form.password = 'password123';
      errorMessage.value = '';
    }

    function openForgotModal() {
      showForgotModal.value = true;
    }

    async function submitLogin() {
      if (!form.username) {
        errorMessage.value = 'Silakan masukkan Username atau NIP Anda.';
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Data belum lengkap! Silakan masukkan Username atau NIP Anda.', 'warning');
        }
        return;
      }
      if (!form.password) {
        errorMessage.value = 'Silakan masukkan kata sandi Anda.';
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Data belum lengkap! Silakan masukkan kata sandi Anda.', 'warning');
        }
        return;
      }

      errorMessage.value = '';
      successMessage.value = '';
      isLoading.value = true;

      try {
        // Attempt REST API login first
        const response = await loginApi({
          username: form.username.trim(),
          password: form.password
        });

        if (response && response.success && response.data) {
          handleSuccess(response.data);
          return;
        }
      } catch (err) {
        console.warn('[Login Error] REST API failed or offline:', err.message);

        // Standalone offline fallback check against known users
        const candidate = (props.usersList && props.usersList.length > 0 ? props.usersList : defaultQuickUsers).find(u => 
          u.username.toLowerCase() === form.username.trim().toLowerCase() ||
          (u.email && u.email.toLowerCase() === form.username.trim().toLowerCase()) ||
          (u.nip && u.nip.replace(/\s+/g, '') === form.username.trim().replace(/\s+/g, ''))
        );

        if (candidate) {
          if (candidate.status === 'Nonaktif' || candidate.status === 'Terkunci') {
            errorMessage.value = 'Akun Anda berstatus Nonaktif/Terkunci. Harap hubungi Administrator.';
            isLoading.value = false;
            return;
          }

          // In offline mode, if user matches, grant login
          handleSuccess({
            id: candidate.id || 1,
            username: candidate.username,
            namaLengkap: candidate.namaLengkap,
            nip: candidate.nip || '',
            email: candidate.email || '',
            satker: candidate.satker || 'Unit Manajemen Keuangan KPw BI Jember',
            roleKey: candidate.roleKey || 'maker',
            roleName: candidate.roleName || 'Operator Keuangan',
            status: 'Aktif'
          });
          return;
        }

        errorMessage.value = err.message || 'Username atau kata sandi tidak valid. Silakan periksa kembali.';
      } finally {
        isLoading.value = false;
      }
    }

    function handleSuccess(userData) {
      successMessage.value = `Selamat datang, ${userData.namaLengkap}! Mengarahkan ke aplikasi...`;
      
      const sessionData = {
        id: userData.id,
        username: userData.username,
        namaLengkap: userData.namaLengkap,
        nip: userData.nip,
        email: userData.email,
        satker: userData.satker,
        roleKey: userData.roleKey,
        roleName: userData.roleName,
        status: userData.status,
        loginTime: new Date().toISOString()
      };

      if (form.rememberMe) {
        localStorage.setItem('bi_erp_auth_user', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('bi_erp_auth_user', JSON.stringify(sessionData));
      }

      // Small delay for smooth visual transition
      setTimeout(() => {
        emit('login-success', userData);
      }, 500);
    }

    onMounted(() => {
      // Prefill with default maker if field empty to make first-time use ultra smooth
      if (!form.username) {
        form.username = 'ahmad.fauzi';
        form.password = 'password123';
      }
    });

    return {
      isLoading,
      errorMessage,
      successMessage,
      showPassword,
      isFocusedField,
      isCapsLockOn,
      showForgotModal,
      showQuickRoles,
      form,
      quickRoleUsers,
      getRoleBadge,
      getRoleColorClass,
      checkCapsLock,
      applyQuickUser,
      openForgotModal,
      submitLogin
    };
  }
};
</script>

<style scoped>
/* ============================================================================
   BI-ERP LOGIN PAGE DESIGN SYSTEM
   Deep Midnight Navy (#080e1e, #0f172a, #1e3a8a) + Bank Indonesia Gold Accent
   Glassmorphism + Modern Professional Aesthetics
   ============================================================================ */

/* Area halaman login Full Screen Edge-to-Edge */
.login-page,
.bi-login-page {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 9999;
  background-color: #070d1d;
  font-family: 'Poppins', Arial, sans-serif;
  color: #1e293b;
}

/* Ambient Glowing Orbs inside Left Panel */
.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  z-index: 1;
}

.bg-glow-1 {
  top: -10%;
  left: 15%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.3), transparent 70%);
  animation: floatOrb 18s ease-in-out infinite alternate;
}

.bg-glow-2 {
  bottom: -15%;
  right: 10%;
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 70%);
  animation: floatOrb 22s ease-in-out infinite alternate-reverse;
}

.bg-glow-3 {
  top: 40%;
  left: 45%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%);
  animation: floatOrb 15s ease-in-out infinite alternate;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -40px) scale(1.1); }
  100% { transform: translate(-20px, 30px) scale(0.95); }
}

/* Security Grid Overlay inside Left Panel */
.bg-grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 2;
}

/* Kartu login ukuran Full Layar (Split Screen Edge-to-Edge) */
.login-card,
.login-card-container {
  display: grid;
  grid-template-columns: 44% 56%;
  width: 100vw;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  border-radius: 0;
  box-shadow: none;
  border: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
  z-index: 10;
  background: transparent;
}

/* Panel kiri dan kanan */
.login-left,
.login-right,
.login-brand-panel,
.login-form-panel {
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
}

/* ============================================================================
   LEFT PANEL: BANK INDONESIA INSTITUTIONAL SHOWCASE (FULL HEIGHT)
   ============================================================================ */
.login-brand-panel,
.login-left {
  padding: clamp(18px, 2.8vh, 48px) clamp(20px, 3.2vw, 52px);
  background: linear-gradient(145deg, #070d1d 0%, #0e1e3e 50%, #172a54 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  color: #ffffff;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  max-height: 100vh;
  max-height: 100dvh;
}

.login-brand-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: 
    radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.18) 0%, transparent 45%),
    radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.25) 0%, transparent 50%);
  pointer-events: none;
}

.brand-panel-header {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.2vw, 1.25rem);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.bi-crest-badge {
  width: clamp(40px, 5.2vh, 56px);
  height: clamp(40px, 5.2vh, 56px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  background: #091326;
  border: 1.5px solid rgba(245, 158, 11, 0.6);
  flex-shrink: 0;
}

.bi-crest-svg {
  width: clamp(34px, 4.6vh, 48px);
  height: clamp(34px, 4.6vh, 48px);
}

.brand-panel-text {
  display: flex;
  flex-direction: column;
}

.bi-sub-label {
  font-size: clamp(0.78rem, 1.2vh, 0.95rem);
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #fbbf24;
  text-transform: uppercase;
  line-height: 1.2;
}

.bi-office-label {
  font-size: clamp(0.65rem, 0.95vh, 0.75rem);
  letter-spacing: 1px;
  color: #cbd5e1;
  text-transform: uppercase;
  font-weight: 500;
  line-height: 1.2;
}

.brand-panel-body {
  position: relative;
  z-index: 2;
  margin: clamp(0.4rem, 1.8vh, 1.25rem) 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
}

.app-title-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: clamp(0.2rem, 0.5vh, 0.32rem) clamp(0.6rem, 0.8vw, 0.85rem);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  font-size: clamp(0.68rem, 1vh, 0.76rem);
  font-weight: 500;
  color: #e2e8f0;
  margin-bottom: clamp(0.3rem, 1vh, 0.65rem);
  backdrop-filter: blur(10px);
  width: fit-content;
}

.pulse-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.app-display-title {
  font-size: clamp(1.6rem, 3.6vh, 2.35rem);
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: clamp(0.2rem, 0.8vh, 0.45rem);
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 60%, #fbbf24 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}

.app-display-desc {
  font-size: clamp(0.72rem, 1.15vh, 0.82rem);
  line-height: 1.45;
  color: #cbd5e1;
  margin-bottom: clamp(0.5rem, 1.6vh, 1.1rem);
  max-width: 520px;
}

.app-display-desc strong {
  color: #ffffff;
}

.brand-features-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.35rem, 1.1vh, 0.75rem);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.feature-icon {
  width: clamp(26px, 3.6vh, 36px);
  height: clamp(26px, 3.6vh, 36px);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  font-size: clamp(0.85rem, 1.4vh, 1.1rem);
  flex-shrink: 0;
}

.feature-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.feature-info strong {
  font-size: clamp(0.74rem, 1.15vh, 0.85rem);
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.1rem;
}

.feature-info span {
  font-size: clamp(0.65rem, 0.95vh, 0.74rem);
  color: #94a3b8;
  line-height: 1.35;
}

.brand-panel-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: clamp(0.6rem, 1.4vh, 1.25rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: clamp(0.68rem, 1vh, 0.76rem);
  color: #94a3b8;
  flex-shrink: 0;
}

.system-status-indicator {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.status-radar {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.radar-online {
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.radar-standby {
  background-color: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

.version-tag {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: clamp(0.65rem, 0.95vh, 0.72rem);
}

/* ============================================================================
   RIGHT PANEL: INTERACTIVE LOGIN FORM (FULL HEIGHT)
   ============================================================================ */
.login-form-panel,
.login-right {
  padding: clamp(18px, 3vh, 48px) clamp(20px, 3.5vw, 48px);
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  max-height: 100vh;
  max-height: 100dvh;
}

.login-form-inner {
  width: 100%;
  max-width: clamp(380px, 34vw, 500px);
  margin: auto 0;
  display: flex;
  flex-direction: column;
}

.form-panel-header {
  margin-bottom: clamp(0.45rem, 1.2vh, 0.85rem);
}

.form-panel-title {
  font-size: clamp(1.25rem, 2.4vh, 1.55rem);
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.2rem;
  letter-spacing: -0.3px;
}

.form-panel-subtitle {
  font-size: clamp(0.76rem, 1.15vh, 0.84rem);
  color: #64748b;
  margin-bottom: 0;
}

/* Alert Boxes */
.login-alert-box {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: clamp(0.45rem, 1vh, 0.75rem) 0.85rem;
  border-radius: 10px;
  margin-bottom: clamp(0.5rem, 1.2vh, 0.85rem);
  font-size: clamp(0.75rem, 1.1vh, 0.82rem);
  animation: slideDown 0.25s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.alert-danger-custom {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alert-success-custom {
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}

.alert-icon {
  font-size: 1.1rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alert-content strong {
  font-weight: 600;
  margin-bottom: 0.1rem;
}

.btn-close-alert {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.15rem;
  padding: 0;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
}

.btn-close-alert:hover {
  opacity: 1;
}

/* Form Fields */
.login-form-body {
  margin-bottom: 0;
}

.form-group-custom {
  margin-bottom: clamp(0.5rem, 1.3vh, 0.85rem);
}

.form-label-custom {
  display: block;
  font-size: clamp(0.76rem, 1.1vh, 0.82rem);
  font-weight: 600;
  color: #334155;
  margin-bottom: clamp(0.2rem, 0.5vh, 0.35rem);
}

.required-star {
  color: #ef4444;
  margin-left: 0.2rem;
}

.link-forgot-password {
  font-size: clamp(0.72rem, 1vh, 0.78rem);
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.link-forgot-password:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.input-icon-wrapper.focused {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.input-lead-icon {
  position: absolute;
  left: 0.85rem;
  font-size: clamp(1rem, 1.4vh, 1.15rem);
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.25s;
}

.input-icon-wrapper.focused .input-lead-icon {
  color: #2563eb;
}

.form-control-custom {
  width: 100%;
  border: none;
  background: transparent;
  padding: clamp(0.52rem, 1.1vh, 0.78rem) 2.6rem clamp(0.52rem, 1.1vh, 0.78rem) 2.6rem;
  font-size: clamp(0.82rem, 1.2vh, 0.88rem);
  color: #0f172a;
  outline: none;
  font-family: inherit;
}

.form-control-custom::placeholder {
  color: #94a3b8;
  font-size: clamp(0.78rem, 1.1vh, 0.84rem);
}

.input-clear-btn,
.input-eye-btn {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  padding: 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.input-clear-btn:hover,
.input-eye-btn:hover {
  color: #475569;
  background: rgba(0, 0, 0, 0.05);
}

.capslock-warning {
  font-size: 0.7rem;
  color: #d97706;
  font-weight: 500;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}

/* Checkbox & Security Meta */
.form-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(0.6rem, 1.5vh, 1.1rem);
  padding: 0.15rem 0;
}

.custom-checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  user-select: none;
  font-size: clamp(0.75rem, 1.1vh, 0.82rem);
  color: #475569;
  margin-bottom: 0;
}

.custom-checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-checkmark {
  height: 16px;
  width: 16px;
  background-color: #f1f5f9;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
  display: inline-block;
  position: relative;
}

.custom-checkbox-container:hover input ~ .checkbox-checkmark {
  border-color: #2563eb;
}

.custom-checkbox-container input:checked ~ .checkbox-checkmark {
  background-color: #2563eb;
  border-color: #2563eb;
}

.custom-checkbox-container input:checked ~ .checkbox-checkmark::after {
  content: "";
  position: absolute;
  display: block;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label-text {
  font-weight: 500;
}

.security-chip {
  display: flex;
  align-items: center;
  font-size: clamp(0.68rem, 1vh, 0.75rem);
  font-weight: 600;
  color: #059669;
  background: #ecfdf5;
  padding: 0.2rem 0.55rem;
  border-radius: 30px;
  border: 1px solid #a7f3d0;
}

.text-emerald {
  color: #059669;
}

/* Submit Button */
.btn-login-submit {
  width: 100%;
  padding: clamp(0.62rem, 1.3vh, 0.85rem) 1.25rem;
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: clamp(0.85rem, 1.25vh, 0.92rem);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transition: all 0.25s ease;
  letter-spacing: 0.2px;
}

.btn-login-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
  transform: translateY(-1px);
}

.btn-login-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

/* Footer Note */
.login-card-footer {
  margin-top: clamp(0.65rem, 1.5vh, 1.25rem);
  padding-top: 0;
}

.bi-security-notice {
  font-size: clamp(0.68rem, 1vh, 0.74rem);
  color: #64748b;
  line-height: 1.4;
  background: #f1f5f9;
  padding: clamp(0.5rem, 1vh, 0.65rem) clamp(0.65rem, 1vw, 0.85rem);
  border-radius: 8px;
  border-left: 3px solid #2563eb;
}

/* ============================================================================
   MODAL DIALOG (HELP & FORGOT PASSWORD)
   ============================================================================ */
.bi-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
}

.bi-modal-dialog {
  width: 100%;
  max-width: 560px;
  animation: zoomModal 0.25s ease-out;
}

@keyframes zoomModal {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.bi-modal-content {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bi-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.bi-modal-body {
  padding: 1.5rem;
  color: #334155;
  font-size: 0.85rem;
}

.helpdesk-contact-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}

.bi-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* ============================================================================
   RESPONSIVE BREAKPOINTS (Desktop, Laptop, Tablet & Mobile)
   ============================================================================ */

/* Layar Pendek (Tinggi Layar < 520px - Landscape Ponsel dsb) */
@media (max-height: 520px) {
  .login-left,
  .login-right,
  .login-brand-panel,
  .login-form-panel {
    overflow-y: auto !important;
  }
  
  .login-brand-panel,
  .login-left {
    justify-content: flex-start;
    gap: 1rem;
  }
}

/* Layar Sangat Lebar (Desktop 2K/4K - min-width: 1600px) */
@media (min-width: 1600px) {
  .login-card,
  .login-card-container {
    grid-template-columns: 45% 55%;
  }

  .login-form-inner {
    max-width: 520px;
  }

  .app-display-desc {
    max-width: 580px;
  }
}

/* Laptop Standar & Sedang (992px - 1399px) */
@media (min-width: 992px) and (max-width: 1399px) {
  .login-card,
  .login-card-container {
    grid-template-columns: 44% 56%;
  }
}

/* Tablet Landscape / Layar 769px - 991px */
@media (min-width: 769px) and (max-width: 991px) {
  .login-card,
  .login-card-container {
    grid-template-columns: 42% 58%;
  }

  .login-brand-panel,
  .login-left {
    padding: clamp(16px, 2.5vh, 28px) clamp(16px, 2.5vw, 28px);
  }

  .login-right,
  .login-form-panel {
    padding: clamp(16px, 2.5vh, 28px) clamp(16px, 2.5vw, 28px);
  }

  .brand-panel-text .bi-sub-label {
    font-size: 0.8rem;
  }

  .brand-panel-text .bi-office-label {
    font-size: 0.65rem;
  }

  .app-display-desc {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* Tampilan Ponsel / Tablet Portrait (< 768px) */
@media (max-width: 768px) {
  .login-page,
  .bi-login-page {
    overflow-y: auto;
    height: auto;
    min-height: 100dvh;
  }

  .login-card,
  .login-card-container {
    grid-template-columns: 1fr;
    width: 100vw;
    height: auto;
    min-height: 100dvh;
    max-height: none;
  }

  .login-left,
  .login-brand-panel {
    display: none;
  }

  .login-right,
  .login-form-panel {
    padding: 28px 20px;
    min-height: 100dvh;
    justify-content: flex-start;
    overflow-y: visible;
  }

  .login-form-inner {
    max-width: 100%;
  }
}
</style>
