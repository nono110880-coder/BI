<template>
  <div class="bi-erp-root">
   
    <LoginPage
      v-if="!isLoggedIn"
      :is-online="isOnline"
      :users-list="usersList"
      @login-success="handleLoginSuccess"
    />
    
    <div v-else class="erp-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      
    <aside class="erp-sidebar no-print">
      <div class="sidebar-brand">
        <span class="brand-text">APPPERKUSI</span>
      </div>

      <nav class="sidebar-nav">
        <!-- Dashboard -->
        <a class="nav-item-link" :class="{ active: currentView === 'dashboard' }"
          :href="getViewUrl('dashboard')"
          @click="navigateView('dashboard', $event)" title="Dashboard">
          <i class="bi bi-house-door"></i>
          <span>Dashboard</span>
        </a>

        <!-- Formulir ERPHRIS dengan Submenu -->
        <div class="nav-dropdown-item">
          <a class="nav-item-link nav-dropdown-toggle"
            :class="{ active: ['invoice-ap', 'travel-event', 'penarikan-um', 'pertanggungjawaban-um'].includes(currentView) }"
            :href="getViewUrl('invoice-ap')"
            @click="handleDropdownToggle('erphris', $event)" title="Formulir ERPHRIS">
            <i class="bi bi-journal-text"></i>
            <span>Formulir ERPHRIS</span>
            <i class="bi dropdown-arrow" :class="isErphrisMenuOpen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
          </a>
          <div class="nav-submenu" v-show="isErphrisMenuOpen">
            <a class="nav-sub-item-link" :class="{ active: currentView === 'invoice-ap', 'nav-sub-item-locked': !canAccessView('invoice-ap') }"
              :href="getViewUrl('invoice-ap')"
              @click="navigateView('invoice-ap', $event)" :title="canAccessView('invoice-ap') ? 'Invoice AP' : 'Terkunci oleh RBAC'">
              <i class="bi bi-receipt-cutoff"></i>
              <span>Invoice AP</span>
              <i v-if="!canAccessView('invoice-ap')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'travel-event', 'nav-sub-item-locked': !canAccessView('travel-event') }"
              :href="getViewUrl('travel-event')"
              @click="navigateView('travel-event', $event)" :title="canAccessView('travel-event') ? 'Travel Event' : 'Terkunci oleh RBAC (Butuh form_create)'">
              <i class="bi bi-airplane"></i>
              <span>Travel Event</span>
              <i v-if="!canAccessView('travel-event')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'penarikan-um', 'nav-sub-item-locked': !canAccessView('penarikan-um') }"
              :href="getViewUrl('penarikan-um')"
              @click="navigateView('penarikan-um', $event)" :title="canAccessView('penarikan-um') ? 'Penarikan Uang Muka' : 'Terkunci oleh RBAC (Butuh form_create)'">
              <i class="bi bi-cash-stack"></i>
              <span>Penarikan Uang Muka</span>
              <i v-if="!canAccessView('penarikan-um')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'pertanggungjawaban-um', 'nav-sub-item-locked': !canAccessView('pertanggungjawaban-um') }"
              :href="getViewUrl('pertanggungjawaban-um')"
              @click="navigateView('pertanggungjawaban-um', $event)" :title="canAccessView('pertanggungjawaban-um') ? 'Pertanggungjawaban Uang Muka' : 'Terkunci oleh RBAC (Butuh form_create)'">
              <i class="bi bi-file-earmark-check"></i>
              <span>Pertanggungjawaban Uang Muka</span>
              <i v-if="!canAccessView('pertanggungjawaban-um')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
          </div>
        </div>

        <!-- Menu Persetujuan dengan Submenu -->
        <div class="nav-dropdown-item">
          <a class="nav-item-link nav-dropdown-toggle"
            :class="{ active: ['laporan-invoice', 'laporan-travel', 'laporan-penarikan', 'laporan-pertanggungjawaban'].includes(currentView), 'nav-item-locked': !hasPermission('export_report') }"
            :href="getViewUrl('laporan-invoice')"
            @click="handleDropdownToggle('laporan', $event)" :title="hasPermission('export_report') ? 'Persetujuan' : 'Terkunci oleh RBAC (Butuh export_report)'">
            <i class="bi bi-file-earmark-check"></i>
            <span>Persetujuan</span>
            <i v-if="!hasPermission('export_report')" class="bi bi-lock-fill text-muted ms-1" style="font-size: 0.75rem;"></i>
            <i class="bi dropdown-arrow" :class="isLaporanMenuOpen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
          </a>
          <div class="nav-submenu" v-show="isLaporanMenuOpen">
            <a class="nav-sub-item-link" :class="{ active: currentView === 'laporan-invoice', 'nav-sub-item-locked': !canAccessView('laporan-invoice') }"
              :href="getViewUrl('laporan-invoice')"
              @click="navigateView('laporan-invoice', $event)" :title="canAccessView('laporan-invoice') ? 'Approve Invoice' : 'Terkunci oleh RBAC (Butuh export_report)'">
              <i class="bi bi-receipt"></i>
              <span>Approve Invoice</span>
              <i v-if="!canAccessView('laporan-invoice')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'laporan-travel', 'nav-sub-item-locked': !canAccessView('laporan-travel') }"
              :href="getViewUrl('laporan-travel')"
              @click="navigateView('laporan-travel', $event)" :title="canAccessView('laporan-travel') ? 'Approve Travel' : 'Terkunci oleh RBAC (Butuh export_report)'">
              <i class="bi bi-airplane"></i>
              <span>Approve Travel</span>
              <i v-if="!canAccessView('laporan-travel')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'laporan-penarikan', 'nav-sub-item-locked': !canAccessView('laporan-penarikan') }"
              :href="getViewUrl('laporan-penarikan')"
              @click="navigateView('laporan-penarikan', $event)" :title="canAccessView('laporan-penarikan') ? 'Approve Penarikan' : 'Terkunci oleh RBAC (Butuh export_report)'">
              <i class="bi bi-cash-stack"></i>
              <span>Approve Penarikan</span>
              <i v-if="!canAccessView('laporan-penarikan')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'laporan-pertanggungjawaban', 'nav-sub-item-locked': !canAccessView('laporan-pertanggungjawaban') }"
              :href="getViewUrl('laporan-pertanggungjawaban')"
              @click="navigateView('laporan-pertanggungjawaban', $event)" :title="canAccessView('laporan-pertanggungjawaban') ? 'Approve Pertanggungjawaban Uang' : 'Terkunci oleh RBAC (Butuh export_report)'">
              <i class="bi bi-clipboard-check"></i>
              <span>Approve Pertanggungjawaban Uang</span>
              <i v-if="!canAccessView('laporan-pertanggungjawaban')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
          </div>
        </div>

        <!-- Data Master dengan Submenu -->
        <div class="nav-dropdown-item">
          <a class="nav-item-link nav-dropdown-toggle"
            :class="{ active: ['data-pegawai', 'data-bank', 'data-rekanan', 'data-dha', 'data-unit-kerja'].includes(currentView), 'nav-item-locked': !hasPermission('manage_masters') }"
            :href="getViewUrl('data-pegawai')"
            @click="handleDropdownToggle('datamaster', $event)" :title="hasPermission('manage_masters') ? 'Data Master' : 'Terkunci oleh RBAC (Butuh manage_masters)'">
            <i class="bi bi-database-gear"></i>
            <span>Data Master</span>
            <i v-if="!hasPermission('manage_masters')" class="bi bi-lock-fill text-muted ms-1" style="font-size: 0.75rem;"></i>
            <i class="bi dropdown-arrow" :class="isDataMasterMenuOpen ? 'bi-chevron-down' : 'bi-chevron-right'"></i>
          </a>
          <div class="nav-submenu" v-show="isDataMasterMenuOpen">
            <a class="nav-sub-item-link" :class="{ active: currentView === 'data-pegawai', 'nav-sub-item-locked': !canAccessView('data-pegawai') }"
              :href="getViewUrl('data-pegawai')"
              @click="navigateView('data-pegawai', $event)" :title="canAccessView('data-pegawai') ? 'Data Pegawai' : 'Terkunci oleh RBAC (Butuh manage_masters)'">
              <i class="bi bi-person-badge"></i>
              <span>Data Pegawai</span>
              <i v-if="!canAccessView('data-pegawai')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'data-bank', 'nav-sub-item-locked': !canAccessView('data-bank') }"
              :href="getViewUrl('data-bank')"
              @click="navigateView('data-bank', $event)" :title="canAccessView('data-bank') ? 'Data Bank' : 'Terkunci oleh RBAC (Butuh manage_masters)'">
              <i class="bi bi-bank"></i>
              <span>Data Bank</span>
              <i v-if="!canAccessView('data-bank')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'data-rekanan', 'nav-sub-item-locked': !canAccessView('data-rekanan') }"
              :href="getViewUrl('data-rekanan')"
              @click="navigateView('data-rekanan', $event)" :title="canAccessView('data-rekanan') ? 'Rekanan' : 'Terkunci oleh RBAC (Butuh manage_masters)'">
              <i class="bi bi-building"></i>
              <span>Rekanan</span>
              <i v-if="!canAccessView('data-rekanan')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'data-dha', 'nav-sub-item-locked': !canAccessView('data-dha') }"
              :href="getViewUrl('data-dha')"
              @click="navigateView('data-dha', $event)" :title="canAccessView('data-dha') ? 'DHA (Daftar Himpunan Anggaran)' : 'Terkunci oleh RBAC (Butuh manage_masters)'">
              <i class="bi bi-pie-chart"></i>
              <span>DHA</span>
              <i v-if="!canAccessView('data-dha')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
            <a class="nav-sub-item-link" :class="{ active: currentView === 'data-unit-kerja', 'nav-sub-item-locked': !canAccessView('data-unit-kerja') }"
              :href="getViewUrl('data-unit-kerja')"
              @click="navigateView('data-unit-kerja', $event)" :title="canAccessView('data-unit-kerja') ? 'Unit Kerja' : 'Terkunci oleh RBAC (Butuh manage_masters)'">
              <i class="bi bi-diagram-3"></i>
              <span>Unit Kerja</span>
              <i v-if="!canAccessView('data-unit-kerja')" class="bi bi-lock-fill text-muted ms-auto" style="font-size: 0.72rem;"></i>
            </a>
          </div>
        </div>

        <!-- Menu Pengaturan -->
        <a class="nav-item-link" :class="{ active: currentView === 'pengaturan' }"
          :href="getViewUrl('pengaturan')"
          @click="navigateView('pengaturan', $event)" title="Pengaturan">
          <i class="bi bi-gear-fill"></i>
          <span>Pengaturan</span>
        </a>
      </nav>
    </aside>

    <!-- ====================================================================
         2. MAIN CONTENT WRAPPER
         ==================================================================== -->
    <div class="erp-main">
      <!-- Top Navbar -->
      <header class="erp-topbar no-print">
        <div class="topbar-left">
          <button class="hamburger-btn" @click="isSidebarCollapsed = !isSidebarCollapsed" title="Toggle Sidebar">
            <i class="bi bi-list"></i>
          </button>
        </div>

        <div class="topbar-right">
          <div class="topbar-clock d-none d-md-flex">
            <i class="bi bi-clock me-1 text-primary"></i>
            <span>{{ liveTime }}</span>
          </div>

          <span class="topbar-status-pill" :class="isOnline ? 'online' : 'offline'">
            <span class="status-dot"></span>
            {{ isOnline ? 'REST API Aktif' : 'Standalone Mode' }}
          </span>

          <!-- Circular User Avatar Badge (Maroon circle with letter U) -->
          <div class="position-relative">
            <div class="user-avatar-circle" @click="showUserMenu = !showUserMenu" title="Profil Pengguna">
              <span>{{ (currentUser.name || 'U').charAt(0).toUpperCase() }}</span>
            </div>

            <!-- Profile Dropdown -->
            <div v-if="showUserMenu" class="position-absolute end-0 mt-2 p-3 bg-white border rounded shadow"
              style="width: 250px; z-index: 2000;" @click.stop>
              <div class="fw-bold mb-1">{{ currentUser.name }}</div>
              <div class="text-muted small mb-1">{{ currentUser.role }}</div>
              <div class="text-muted small border-bottom pb-2 mb-2">{{ currentUser.satker }}</div>
              <button class="btn btn-sm btn-outline-primary w-100 mb-2" @click="currentView = 'pengaturan'; settingTab = 'users'; showUserMenu = false;">
                <i class="bi bi-shield-lock-fill me-1"></i> Pengguna & Hak Akses
              </button>
              <button class="btn btn-sm btn-outline-danger w-100" @click="confirmExit">
                <i class="bi bi-box-arrow-right me-1"></i> Tutup Sesi
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Body -->
      <div class="erp-body">
        <!-- Soft Blue Welcome Alert Banner (Hanya Tampil di Dashboard) -->
        <div class="welcome-alert-banner no-print" v-show="currentView === 'dashboard'">
          <span>Selamat Datang di <strong>PERKUSI (PENGELOLAAN KEUANGAN TERINTEGRASI)</strong></span>
        </div>

        <!-- ================================================================
             RBAC ACCESS DENIED (403 FORBIDDEN SCREEN)
             Tampil otomatis jika modul yang dibuka terkunci untuk peran pengguna
             ================================================================ -->
        <div v-if="!canAccessView(currentView)" class="content-container no-print p-4">
          <div class="card border-0 shadow-sm text-center py-5 px-4 bg-white rounded-3 mx-auto" style="max-width: 650px;">
            <div class="mb-3">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger" style="width: 80px; height: 80px; font-size: 2.5rem;">
                <i class="bi bi-shield-lock-fill"></i>
              </div>
            </div>
            <h3 class="fw-bold text-dark mb-2">Akses Modul Terkunci (403 Forbidden)</h3>
            <p class="text-secondary mb-3">
              Peran aktif Anda saat ini adalah <strong><span class="badge-tag" :class="getRoleBadgeClass(currentUser.roleKey)">{{ currentUser.role || currentUser.roleKey }}</span></strong>. Sesuai <strong>Matriks Hak Akses (RBAC) Tata Kelola Bank Indonesia</strong>, peran Anda tidak memiliki wewenang untuk mengakses modul ini.
            </p>
            <div class="alert alert-warning text-start small mb-4 py-2 px-3 border-warning d-flex align-items-center gap-2">
              <i class="bi bi-exclamation-triangle-fill fs-5 text-warning flex-shrink-0"></i>
              <div>
                <strong>Wewenang Diperlukan:</strong>
                <code class="text-dark fw-bold">{{ getViewRequiredPermission(currentView) }}</code> ({{ getPermissionName(getViewRequiredPermission(currentView)) }})
              </div>
            </div>
            <div class="d-flex justify-content-center gap-2">
              <button class="btn-erp btn-erp-primary" @click="currentView = 'dashboard'">
                <i class="bi bi-house-door me-1"></i> Kembali ke Dashboard
              </button>
              <button v-if="hasPermission('manage_users')" class="btn btn-outline-secondary btn-sm" @click="currentView = 'pengaturan'; settingTab = 'users'; userSubTab = 'matrix';">
                <i class="bi bi-grid-3x3-gap-fill me-1"></i> Buka Matriks Hak Akses (RBAC)
              </button>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW 1: DASHBOARD RINGKASAN (DIKOSONGKAN SESUAI SCREENSHOT)
             ================================================================ -->
        <div v-show="currentView === 'dashboard'" class="content-container no-print dashboard-empty-view">
          <!-- Dashboard sengaja dikosongkan persis sesuai referensi visual gambar -->
        </div>

        <!-- ================================================================
             VIEW: INVOICE AP (Daftar Invoice AP)
             ================================================================ -->
        <div v-show="currentView === 'invoice-ap' && canAccessView('invoice-ap')" class="content-container no-print batch-proto-view">

          <!-- Sub Nav Switcher -->
          <div class="nav-switcher">
            <button type="button" class="nav-switcher-btn" :class="{ active: invoiceApSubView === 'form' }"
              @click="invoiceApSubView = 'form'">
              <i class="bi bi-pencil-square"></i> Form Batch ERP
            </button>
            <button type="button" class="nav-switcher-btn" :class="{ active: invoiceApSubView === 'history' }"
              @click="invoiceApSubView = 'history'">
              <i class="bi bi-card-list"></i> Riwayat Batch ({{ batchList.length }})
            </button>
          </div>

          <!-- SUB VIEW 1: FORM BATCH ERP (Stepped Wizard Sesuai Gambar) -->
          <div v-show="invoiceApSubView === 'form'">
            <!-- Page Header -->
            <div class="page-head">
              <div>
                <div class="eyebrow">Transaksi · Batch Invoice</div>
                <h1>Form Batch ERP</h1>
                <p>Lengkapi data transaksi, invoice, rekening, persetujuan, dan COA sebelum menyimpan batch.</p>
              </div>
              <div class="head-actions">
                <button type="button" class="btn" @click="resetFormBatch">↺ Reset Form</button>
                <button type="button" class="btn btn-soft" @click="saveDraftBatch">▣ Simpan Draft</button>
                <button type="button" class="btn btn-ghost" @click="invoiceApSubView = 'history'">
                  ▤ Lihat Riwayat ({{ batchList.length }}) →
                </button>
              </div>
            </div>

            <!-- Stepper -->
            <div class="steps" id="stepper">
              <div class="step" :class="{ active: currentStep === 1, done: currentStep > 1 }" @click="setStep(1)">
                <div class="step-circle">{{ currentStep > 1 ? '✓' : 1 }}</div>
                <div>
                  <div class="step-label">Data Transaksi</div>
                  <div class="step-sub">Identitas batch</div>
                </div>
              </div>
              <div class="step" :class="{ active: currentStep === 2, done: currentStep > 2 }" @click="setStep(2)">
                <div class="step-circle">{{ currentStep > 2 ? '✓' : 2 }}</div>
                <div>
                  <div class="step-label">Invoice & Rekanan</div>
                  <div class="step-sub">Dokumen dan nominal</div>
                </div>
              </div>
              <div class="step" :class="{ active: currentStep === 3, done: currentStep > 3 }" @click="setStep(3)">
                <div class="step-circle">{{ currentStep > 3 ? '✓' : 3 }}</div>
                <div>
                  <div class="step-label">Pembayaran</div>
                  <div class="step-sub">Rekening dan approval</div>
                </div>
              </div>
              <div class="step" :class="{ active: currentStep === 4, done: currentStep > 4 }" @click="setStep(4)">
                <div class="step-circle">{{ currentStep > 4 ? '✓' : 4 }}</div>
                <div>
                  <div class="step-label">DHA, COA & Review</div>
                  <div class="step-sub">Pemeriksaan akhir</div>
                </div>
              </div>
            </div>

            <!-- Form Body -->
            <form id="batch-form" novalidate @submit.prevent>

              <!-- STEP 1: IDENTITAS BATCH -->
              <div class="form-step" v-show="currentStep === 1">
                <div class="form-card">
                  <div class="form-card-body">
                    <div class="section-title">
                      <span class="section-num">01</span> Identitas Batch
                      <span class="badge" style="background:#eef1ff;color:#4361ee;font-size:11px;font-weight:700;padding:4px 9px;border-radius:6px;margin-left:6px;border:1px solid #dce4ff;">
                        No. Batch: {{ form.noBatch || 'DRAFT BARU' }}
                      </span>
                      <span class="section-desc">Informasi utama transaksi</span>
                    </div>
                    <div class="grid">
                      <div class="field col-4">
                        <label for="docNo">No Dokumen <span class="req">*</span></label>
                        <input id="docNo" name="docNo" v-model="form.noDokumen" placeholder="Contoh: 27/12/JR/M.02/B" required>
                      </div>
                      <div class="field col-3">
                        <label for="transDate">Tgl Transaksi <span class="req">*</span></label>
                        <div class="custom-date-wrapper">
                          <input id="transDate" name="transDate" type="text" class="date-display-input"
                                 :value="formatIsoToDmy(form.tglTransaksi)"
                                 @input="handleDateTextInput($event, (v) => form.tglTransaksi = v)"
                                 @blur="handleDateBlur($event, (v) => form.tglTransaksi = v, form.tglTransaksi)"
                                 placeholder="dd/mm/yyyy" maxlength="10" required>
                          <input type="date" class="native-date-hidden-trigger" :value="form.tglTransaksi"
                                 @input="form.tglTransaksi = $event.target.value"
                                 @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                          <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                        </div>
                      </div>
                      <div class="field col-5">
                        <label for="uker">Dari Uker <span class="req">*</span></label>
                        <select id="uker" name="uker" v-model="form.dariUker" required>
                          <option value="">Pilih unit kerja</option>
                          <option v-for="u in unitKerjaOptions" :key="u.val" :value="u.val">{{ u.label }}</option>
                        </select>
                      </div>
                      <div class="field col-12">
                        <label for="perihal">Perihal <span class="req">*</span></label>
                        <textarea id="perihal" name="perihal" rows="3" v-model="form.perihal" placeholder="Tuliskan perihal transaksi secara lengkap..." required></textarea>
                        <div class="hint">Gunakan deskripsi yang jelas agar batch mudah ditelusuri saat pemeriksaan.</div>
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="info-note">
                      <span>ⓘ</span>
                      <div>Pastikan <b>nomor dokumen, tanggal transaksi, unit kerja, dan perihal</b> sesuai dokumen sumber sebelum melanjutkan.</div>
                    </div>
                  </div>
                  <div class="form-footer">
                    <div class="footer-left"><span class="req">*</span> Wajib diisi untuk melanjutkan proses.</div>
                    <div class="footer-buttons">
                      <button type="button" class="btn btn-primary" @click="nextStep">
                        Selanjutnya: Invoice & Rekanan <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 2: DATA INVOICE & REKANAN -->
              <div class="form-step" v-show="currentStep === 2">
                <div class="form-card">
                  <div class="form-card-body">
                    <div class="section-title">
                      <span class="section-num">02</span> Data Invoice
                      <span class="section-desc">Maksimal 4 invoice dalam satu batch</span>
                    </div>
                    <div class="invoice-table">
                      <table>
                        <thead>
                          <tr>
                            <th style="width:42px">No.</th>
                            <th>No. Invoice</th>
                            <th style="width:175px">Tanggal Invoice</th>
                            <th style="width:210px;text-align:right">Nominal (Rp)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(inv, idx) in form.invoices" :key="idx">
                            <td><span class="line-no">0{{ idx + 1 }}</span></td>
                            <td><input :id="'invoice' + (idx + 1)" v-model="inv.noInvoice" :placeholder="'Nomor invoice ' + (idx + 1)"></td>
                            <td>
                              <div class="custom-date-wrapper">
                                <input :id="'invoiceDate' + (idx + 1)" type="text" class="date-display-input"
                                       :value="formatIsoToDmy(inv.tglInvoice)"
                                       @input="handleDateTextInput($event, (v) => inv.tglInvoice = v)"
                                       @blur="handleDateBlur($event, (v) => inv.tglInvoice = v, inv.tglInvoice)"
                                       placeholder="dd/mm/yyyy" maxlength="10">
                                <input type="date" class="native-date-hidden-trigger" :value="inv.tglInvoice"
                                       @input="inv.tglInvoice = $event.target.value"
                                       @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                                <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                              </div>
                            </td>
                            <td>
                              <input :id="'nominal' + (idx + 1)"
                                     class="nominal nominal-input"
                                     type="text"
                                     inputmode="numeric"
                                     :value="formatRupiahInput(inv.nominal)"
                                     @input="handleInvoiceNominalInput($event, idx)"
                                     @blur="handleInvoiceNominalBlur($event, idx)"
                                     @focus="handleNominalFocus($event)"
                                     placeholder="Rp 0">
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="inline-add">
                      <span>Nominal total dihitung otomatis dari invoice yang diisi.</span>
                      <button type="button" class="btn btn-sm btn-soft" @click="clearInvoices">Bersihkan Invoice</button>
                    </div>
                    <div class="grid" style="margin-top:20px">
                      <div class="field col-6">
                        <label for="taxNo">No. Faktur Pajak</label>
                        <input id="taxNo" name="taxNo" v-model="form.noFakturPajak" placeholder="Nomor faktur pajak (jika ada)">
                      </div>
                      <div class="field col-3">
                        <label for="taxDate">Tanggal Faktur Pajak</label>
                        <div class="custom-date-wrapper">
                          <input id="taxDate" name="taxDate" type="text" class="date-display-input"
                                 :value="formatIsoToDmy(form.tglFakturPajak)"
                                 @input="handleDateTextInput($event, (v) => form.tglFakturPajak = v)"
                                 @blur="handleDateBlur($event, (v) => form.tglFakturPajak = v, form.tglFakturPajak)"
                                 placeholder="dd/mm/yyyy" maxlength="10">
                          <input type="date" class="native-date-hidden-trigger" :value="form.tglFakturPajak"
                                 @input="form.tglFakturPajak = $event.target.value"
                                 @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                          <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                        </div>
                      </div>
                      <div class="field col-3">
                        <label for="taxNominal">Nominal Total (Rp)</label>
                        <input id="taxNominal" name="taxNominal" readonly :value="formatRupiah(invoiceTotal)" placeholder="Otomatis">
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="section-title">
                      <span class="section-num">R</span> Data Rekanan
                      <span class="section-desc">Identitas penerima pembayaran</span>
                    </div>
                    <div class="grid">
                      <div class="field col-6">
                        <label for="partner">Nama Rekanan <span class="req">*</span></label>
                        <div class="partner-autocomplete" @click.stop>
                          <div class="partner-autocomplete-input-wrap">
                            <input
                              id="partner"
                              name="partner"
                              type="text"
                              class="partner-autocomplete-input"
                              :class="{ 'is-open': isPartnerDropdownOpen }"
                              v-model="partnerSearchText"
                              @focus="openPartnerDropdown"
                              @input="onPartnerInput"
                              @keydown="onPartnerKeydown"
                              placeholder="Ketik atau cari nama rekanan..."
                              autocomplete="off"
                              required
                            />
                            <div class="partner-autocomplete-actions">
                              <button
                                type="button"
                                class="partner-action-btn btn-clear"
                                v-if="form.namaRekanan || partnerSearchText"
                                @click.stop="clearPartnerSelection"
                                title="Hapus / Reset Pilihan Rekanan"
                              >
                                <i class="bi bi-x-lg"></i>
                              </button>
                              <button
                                type="button"
                                class="partner-action-btn btn-toggle"
                                @click.stop="togglePartnerDropdown"
                                tabindex="-1"
                                title="Buka / Tutup Daftar Rekanan"
                              >
                                <i class="bi" :class="isPartnerDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                              </button>
                            </div>
                          </div>

                          <!-- Dropdown / Suggestion List -->
                          <div class="partner-dropdown-menu" v-if="isPartnerDropdownOpen" @click.stop>
                            <div class="partner-dropdown-header">
                              <div class="d-flex align-items-center justify-content-between">
                                <span class="partner-header-text">
                                  <i class="bi bi-building me-1 text-primary"></i>
                                  <strong>{{ filteredPartnerOptions.length }}</strong> Rekanan tersedia
                                </span>
                                <span v-if="partnerSearchText && partnerSearchText !== '+ Rekanan lainnya / input manual'" class="partner-filter-badge">
                                  Filter: "{{ partnerSearchText }}"
                                </span>
                              </div>
                            </div>

                            <!-- Opsi Cepat: Rekanan Baru / Input Manual -->
                            <div
                              class="partner-dropdown-item partner-item-manual"
                              :class="{ 'is-active': activePartnerIndex === -1, 'is-selected': form.namaRekanan === '__new' }"
                              @click="selectNewManualPartner"
                            >
                              <div class="partner-item-icon-wrap icon-manual">
                                <i class="bi bi-plus-lg"></i>
                              </div>
                              <div class="partner-item-info">
                                <div class="partner-item-name text-primary fw-bold">
                                  + Rekanan lainnya / input manual
                                </div>
                                <div class="partner-item-desc text-muted">
                                  <span v-if="partnerSearchText && !exactPartnerMatch && partnerSearchText !== '+ Rekanan lainnya / input manual'">
                                    Gunakan "<strong>{{ partnerSearchText }}</strong>" sebagai rekanan baru
                                  </span>
                                  <span v-else>Masukkan nama dan data rekanan baru secara manual</span>
                                </div>
                              </div>
                              <span class="badge bg-primary-subtle text-primary border small">Manual</span>
                            </div>

                            <div class="partner-dropdown-divider"></div>

                            <!-- List Suggestion Rekanan -->
                            <div class="partner-dropdown-list">
                              <div v-if="filteredPartnerOptions.length === 0" class="partner-dropdown-empty">
                                <i class="bi bi-search d-block mb-1 fs-5 text-muted"></i>
                                <div>Tidak ada rekanan yang cocok dengan "<strong>{{ partnerSearchText }}</strong>"</div>
                                <button type="button" class="btn btn-sm btn-outline-primary mt-2" @click="selectNewManualPartner">
                                  <i class="bi bi-plus-circle me-1"></i> Jadikan Rekanan Baru
                                </button>
                              </div>

                              <div
                                v-for="(item, idx) in displayedPartnerOptions"
                                :key="item.id || item.nama"
                                class="partner-dropdown-item"
                                :class="{
                                  'is-selected': form.namaRekanan === item.nama,
                                  'is-active': activePartnerIndex === idx
                                }"
                                @click="selectPartnerOption(item)"
                                @mouseenter="activePartnerIndex = idx"
                              >
                                <div class="partner-item-icon-wrap" :class="{ 'icon-star': item.isDefault }">
                                  <i class="bi" :class="item.isDefault ? 'bi-star-fill text-warning' : 'bi-building text-secondary'"></i>
                                </div>
                                <div class="partner-item-info">
                                  <div class="partner-item-name">
                                    <span>{{ item.nama }}</span>
                                    <span v-if="item.isDefault" class="badge bg-warning-subtle text-warning-emphasis ms-2 small">Utama</span>
                                  </div>
                                  <div class="partner-item-desc" v-if="item.sub">
                                    {{ item.sub }}
                                  </div>
                                </div>
                                <div class="partner-item-check" v-if="form.namaRekanan === item.nama">
                                  <i class="bi bi-check-lg text-primary fw-bold fs-6"></i>
                                </div>
                              </div>

                              <div v-if="filteredPartnerOptions.length > displayedPartnerOptions.length" class="partner-dropdown-footer text-center py-2 small border-top">
                                Menampilkan {{ displayedPartnerOptions.length }} dari {{ filteredPartnerOptions.length }} rekanan. Ketik untuk mempersempit.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="field col-6">
                        <label for="partnerNameWP">Nama WP Rekanan</label>
                        <input id="partnerNameWP" name="partnerNameWP" v-model="form.namaWpRekanan" placeholder="Nama wajib pajak sesuai NPWP">
                      </div>
                      <div class="field col-6">
                        <label for="partnerAddress">Alamat Rekanan</label>
                        <input id="partnerAddress" name="partnerAddress" v-model="form.alamatRekanan" placeholder="Alamat lengkap rekanan">
                      </div>
                      <div class="field col-6">
                        <label for="partnerNpwp">NIK / NPWP</label>
                        <input id="partnerNpwp" name="partnerNpwp" v-model="form.nikNpwp" placeholder="Nomor identitas pajak">
                      </div>
                      <div class="field col-12" v-show="form.namaRekanan === '__new'">
                        <label for="newPartner">Nama Rekanan Baru</label>
                        <input id="newPartner" name="newPartner" v-model="form.newPartner" placeholder="Masukkan nama rekanan">
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="money-box">
                      <div class="money-symbol">Rp</div>
                      <div>
                        <div class="money-label">Total nominal invoice</div>
                        <div id="total-display" class="money-value">{{ formatRupiah(invoiceTotal) }}</div>
                      </div>
                      <div style="margin-left:auto;text-align:right">
                        <div class="money-label">Jumlah invoice terisi</div>
                        <div id="invoice-count" style="font-size:15px;font-weight:800;margin-top:4px">{{ invoiceCount }} dari 4</div>
                      </div>
                    </div>
                  </div>
                  <div class="form-footer">
                    <div class="footer-left">Data faktur pajak dapat dikosongkan jika tidak berlaku.</div>
                    <div class="footer-buttons">
                      <button type="button" class="btn" @click="prevStep">← Kembali</button>
                      <button type="button" class="btn btn-primary" @click="nextStep">Selanjutnya: Pembayaran →</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 3: PEMBAYARAN & REKENING -->
              <div class="form-step" v-show="currentStep === 3">
                <div class="form-card">
                  <div class="form-card-body">
                    <div class="section-title">
                      <span class="section-num">03</span> Pembayaran & Rekening
                      <span class="section-desc">Data transfer/pembayaran</span>
                    </div>
                    <div class="grid">
                      <!-- Baris 1: 4 Kolom (Tipe Pembayaran, Nama Bank, Nomor Rekening, Nama Rekening) -->
                      <div class="field col-3">
                        <label for="paymentType">Tipe Pembayaran</label>
                        <select id="paymentType" name="paymentType" v-model="form.tipePembayaran" @change="onTipePembayaranChange">
                          <option value="">Pilih tipe pembayaran</option>
                          <option v-for="t in tipePembayaranList" :key="t" :value="t">{{ t }}</option>
                        </select>
                      </div>
                      <div class="field col-3">
                        <label for="bank">Nama Bank</label>
                        <select id="bank" name="bank" v-model="form.namaBank" :disabled="isTunai">
                          <option value="">{{ isTunai ? 'Tidak diperlukan (Tunai)' : 'Pilih bank' }}</option>
                          <option v-for="b in bankList" :key="b" :value="b">{{ b }}</option>
                        </select>
                      </div>
                      <div class="field col-3">
                        <label for="accountNo">Nomor Rekening</label>
                        <input id="accountNo" name="accountNo" v-model="form.nomorRekening" inputmode="numeric"
                          :disabled="isTunai"
                          :placeholder="isTunai ? 'Tidak diperlukan (Tunai)' : 'Nomor rekening'">
                      </div>
                      <div class="field col-3">
                        <label for="accountName">Nama Rekening</label>
                        <input id="accountName" name="accountName" v-model="form.namaRekening"
                          :disabled="isTunai"
                          :placeholder="isTunai ? 'Tidak diperlukan (Tunai)' : 'Nama pemilik rekening'">
                      </div>

                      <!-- Baris 2: 2 Kolom (Beban Anggaran Uker / Satker, Jenis Invoice) -->
                      <div class="field col-6">
                        <label for="budgetUnit">Beban Anggaran Uker / Satker</label>
                        <select id="budgetUnit" name="budgetUnit" v-model="form.bebanAnggaranUker">
                          <option value="">Pilih unit beban anggaran</option>
                          <option v-for="u in unitKerjaOptions" :key="u.val" :value="u.val">{{ u.label }}</option>
                        </select>
                      </div>
                      <div class="field col-6">
                        <label for="invoiceType">Jenis Invoice</label>
                        <select id="invoiceType" name="invoiceType" v-model="form.jenisInvoice">
                          <option value="">Pilih jenis invoice</option>
                          <option v-for="j in jenisInvoiceList" :key="j" :value="j">{{ j }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="section-title">
                      <span class="section-num">A</span> Pengajuan & Persetujuan
                      <span class="section-desc">Maker dan approver transaksi</span>
                    </div>
                    <div class="grid">
                      <div class="field col-3">
                        <label for="requester">Yang Mengajukan</label>
                        <div class="partner-autocomplete" @click.stop>
                          <div class="partner-autocomplete-input-wrap">
                            <input
                              id="requester"
                              name="requester"
                              type="text"
                              class="partner-autocomplete-input"
                              :class="{ 'is-open': isPengajuDropdownOpen }"
                              v-model="pengajuSearchText"
                              @focus="openPengajuDropdown"
                              @input="onPengajuInput"
                              @keydown="onPengajuKeydown"
                              placeholder="Ketik atau cari nama pegawai..."
                              autocomplete="off"
                            />
                            <div class="partner-autocomplete-actions">
                              <button
                                type="button"
                                class="partner-action-btn btn-clear"
                                v-if="form.yangMengajukan || pengajuSearchText"
                                @click.stop="clearPengaju"
                                title="Hapus pilihan"
                              >
                                <i class="bi bi-x-lg"></i>
                              </button>
                              <button
                                type="button"
                                class="partner-action-btn btn-toggle"
                                @click.stop="togglePengajuDropdown"
                                tabindex="-1"
                                title="Buka / Tutup Daftar Pegawai"
                              >
                                <i class="bi" :class="isPengajuDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                              </button>
                            </div>
                          </div>

                          <!-- Dropdown Menu Pegawai Pengaju -->
                          <div class="partner-dropdown-menu" v-if="isPengajuDropdownOpen" @click.stop>
                            <div class="partner-dropdown-header">
                              <div class="d-flex align-items-center justify-content-between">
                                <span class="partner-header-text">
                                  <i class="bi bi-person-badge me-1 text-primary"></i>
                                  <strong>{{ filteredPengajuOptions.length }}</strong> Pegawai tersedia
                                </span>
                                <span v-if="pengajuSearchText" class="partner-filter-badge">
                                  Filter: "{{ pengajuSearchText }}"
                                </span>
                              </div>
                            </div>

                            <div class="partner-dropdown-list">
                              <div v-if="filteredPengajuOptions.length === 0" class="partner-dropdown-empty">
                                <i class="bi bi-search d-block mb-1 fs-5 text-muted"></i>
                                <div>Tidak ada nama pegawai yang cocok</div>
                              </div>

                              <div
                                v-for="(item, idx) in displayedPengajuOptions"
                                :key="item.id || item.nama"
                                class="partner-dropdown-item"
                                :class="{
                                  'is-selected': form.yangMengajukan === item.nama,
                                  'is-active': activePengajuIndex === idx
                                }"
                                @click="selectPengaju(item)"
                                @mouseenter="activePengajuIndex = idx"
                              >
                                <div class="partner-item-icon-wrap">
                                  <i class="bi bi-person text-primary"></i>
                                </div>
                                <div class="partner-item-info">
                                  <div class="partner-item-name">
                                    <span>{{ item.nama }}</span>
                                  </div>
                                  <div class="partner-item-desc" v-if="item.pangkat || item.nip">
                                    <span v-if="item.pangkat">{{ item.pangkat }}</span>
                                    <span v-if="item.nip"> • NIP: {{ item.nip }}</span>
                                  </div>
                                </div>
                                <div class="partner-item-check" v-if="form.yangMengajukan === item.nama">
                                  <i class="bi bi-check-lg text-primary fw-bold fs-6"></i>
                                </div>
                              </div>

                              <div v-if="filteredPengajuOptions.length > displayedPengajuOptions.length" class="partner-dropdown-footer text-center py-2 small border-top">
                                Menampilkan {{ displayedPengajuOptions.length }} dari {{ filteredPengajuOptions.length }} pegawai.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="field col-3">
                        <label for="requesterRank">Pangkat Mengajukan</label>
                        <input id="requesterRank" name="requesterRank" v-model="form.pangkatMengajukan" placeholder="Pangkat / jabatan">
                      </div>

                      <div class="field col-3">
                        <label for="approver">Yang Menyetujui</label>
                        <div class="partner-autocomplete" @click.stop>
                          <div class="partner-autocomplete-input-wrap">
                            <input
                              id="approver"
                              name="approver"
                              type="text"
                              class="partner-autocomplete-input"
                              :class="{ 'is-open': isPenyetujuDropdownOpen }"
                              v-model="penyetujuSearchText"
                              @focus="openPenyetujuDropdown"
                              @input="onPenyetujuInput"
                              @keydown="onPenyetujuKeydown"
                              placeholder="Ketik atau cari nama penyetuju..."
                              autocomplete="off"
                            />
                            <div class="partner-autocomplete-actions">
                              <button
                                type="button"
                                class="partner-action-btn btn-clear"
                                v-if="form.yangMenyetujui || penyetujuSearchText"
                                @click.stop="clearPenyetuju"
                                title="Hapus pilihan"
                              >
                                <i class="bi bi-x-lg"></i>
                              </button>
                              <button
                                type="button"
                                class="partner-action-btn btn-toggle"
                                @click.stop="togglePenyetujuDropdown"
                                tabindex="-1"
                                title="Buka / Tutup Daftar Pejabat"
                              >
                                <i class="bi" :class="isPenyetujuDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                              </button>
                            </div>
                          </div>

                          <!-- Dropdown Menu Pegawai Penyetuju -->
                          <div class="partner-dropdown-menu" v-if="isPenyetujuDropdownOpen" @click.stop>
                            <div class="partner-dropdown-header">
                              <div class="d-flex align-items-center justify-content-between">
                                <span class="partner-header-text">
                                  <i class="bi bi-shield-check me-1 text-primary"></i>
                                  <strong>{{ filteredPenyetujuOptions.length }}</strong> Pejabat Penyetuju tersedia
                                </span>
                                <span v-if="penyetujuSearchText" class="partner-filter-badge">
                                  Filter: "{{ penyetujuSearchText }}"
                                </span>
                              </div>
                            </div>

                            <div class="partner-dropdown-list">
                              <div v-if="filteredPenyetujuOptions.length === 0" class="partner-dropdown-empty">
                                <i class="bi bi-search d-block mb-1 fs-5 text-muted"></i>
                                <div>Tidak ada pejabat yang cocok</div>
                              </div>

                              <div
                                v-for="(item, idx) in displayedPenyetujuOptions"
                                :key="item.id || item.nama"
                                class="partner-dropdown-item"
                                :class="{
                                  'is-selected': form.yangMenyetujui === item.nama,
                                  'is-active': activePenyetujuIndex === idx
                                }"
                                @click="selectPenyetuju(item)"
                                @mouseenter="activePenyetujuIndex = idx"
                              >
                                <div class="partner-item-icon-wrap">
                                  <i class="bi bi-shield-check text-primary"></i>
                                </div>
                                <div class="partner-item-info">
                                  <div class="partner-item-name">
                                    <span>{{ item.nama }}</span>
                                  </div>
                                  <div class="partner-item-desc" v-if="item.pangkat || item.nip">
                                    <span v-if="item.pangkat">{{ item.pangkat }}</span>
                                    <span v-if="item.nip"> • NIP: {{ item.nip }}</span>
                                  </div>
                                </div>
                                <div class="partner-item-check" v-if="form.yangMenyetujui === item.nama">
                                  <i class="bi bi-check-lg text-primary fw-bold fs-6"></i>
                                </div>
                              </div>

                              <div v-if="filteredPenyetujuOptions.length > displayedPenyetujuOptions.length" class="partner-dropdown-footer text-center py-2 small border-top">
                                Menampilkan {{ displayedPenyetujuOptions.length }} dari {{ filteredPenyetujuOptions.length }} pejabat.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="field col-3">
                        <label for="approverRank">Pangkat Menyetujui</label>
                        <input id="approverRank" name="approverRank" v-model="form.pangkatMenyetujui" placeholder="Pangkat / jabatan">
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="section-title">
                      <span class="section-num">✓</span> Konfirmasi Data Pembayaran
                    </div>
                    <div class="notice amber">
                      Periksa nama rekening dan nomor rekening terhadap dokumen pendukung. Prototype ini hanya menyimpan data di memori browser dan tidak melakukan transfer dana.
                    </div>
                  </div>
                  <div class="form-footer">
                    <div class="footer-left">Pastikan nama rekening sesuai dengan identitas rekanan.</div>
                    <div class="footer-buttons">
                      <button type="button" class="btn" @click="prevStep">← Kembali</button>
                      <button type="button" class="btn btn-primary" @click="nextStep">Selanjutnya: DHA & COA →</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 4: DHA, COA & REVIEW -->
              <div class="form-step" v-show="currentStep === 4">
                <div class="form-card">
                  <div class="form-card-body">
                    <div class="section-title">
                      <span class="section-num">04</span> Data DHA
                      <span class="section-desc">Saldo dan alokasi anggaran</span>
                    </div>
                    <div class="grid">
                      <div class="field col-9">
                        <label for="dhaName">Nama DHA</label>
                        <div class="searchable-dropdown" @click.stop>
                          <div class="searchable-dropdown-trigger" :class="{ 'is-open': isDhaDropdownOpen }"
                            @click="toggleDhaDropdown">
                            <span class="searchable-dropdown-value" v-if="form.namaDha">
                              {{ form.namaDha }}
                            </span>
                            <span class="searchable-dropdown-placeholder" v-else>
                              Pilih atau cari Nama DHA ({{ uniqueDhaList.length }} data tersedia)...
                            </span>
                            <div class="searchable-dropdown-actions">
                              <span class="searchable-dropdown-clear" v-if="form.namaDha" @click.stop="clearDhaSelection" title="Hapus pilihan">
                                <i class="bi bi-x-lg"></i>
                              </span>
                              <i class="bi text-muted" :class="isDhaDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                            </div>
                          </div>

                          <!-- Dropdown Menu for DHA -->
                          <div class="searchable-dropdown-menu" v-if="isDhaDropdownOpen">
                            <div class="searchable-dropdown-search-box">
                              <i class="bi bi-search text-muted small"></i>
                              <input type="text" class="searchable-dropdown-search-input" v-model="dhaFilterText"
                                ref="dhaSearchInputRef" placeholder="Ketik kata kunci pencarian DHA..." @click.stop />
                              <span class="badge bg-light text-secondary border small">{{ filteredDhaOptions.length }} hasil</span>
                            </div>
                            <div class="searchable-dropdown-options">
                              <div v-if="filteredDhaOptions.length === 0" class="searchable-dropdown-no-results">
                                <i class="bi bi-info-circle d-block mb-1 fs-5"></i>
                                Tidak ada nama DHA yang cocok dengan "{{ dhaFilterText }}"
                              </div>
                              <div v-for="d in filteredDhaOptions" :key="d.nama"
                                class="searchable-dropdown-option"
                                :class="{ 'is-selected': form.namaDha === d.nama }"
                                @click="selectDha(d)">
                                <div class="fw-semibold">{{ d.nama }}</div>
                                <div class="searchable-dropdown-option-sub">
                                  <span v-if="d.anggaran || d.saldo" class="text-success font-monospace">
                                    Pagu: {{ formatCurrency(d.anggaran || d.saldo) }}
                                  </span>
                                  <span v-if="d.coaCount" class="badge-tag tag-navy py-0">
                                    {{ d.coaCount }} COA terkait
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="field col-3">
                        <label for="dhaBalance">Saldo DHA (Rp)</label>
                        <input id="dhaBalance" name="dhaBalance" type="number" min="0" step="1" v-model.number="form.dhaBalance" placeholder="0">
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="section-title">
                      <span class="section-num">C</span> Rangkaian COA
                      <span class="section-desc">Alokasi nominal per COA dan Akun Natural</span>
                    </div>

                    <div class="coa-row-container mb-3">
                      <div v-for="(coa, cIdx) in form.coas" :key="cIdx" class="coa-row-grid">
                        <!-- Kolom 1: Rangkaian COA (Lebar 10 cm, Searchable Dropdown) -->
                        <div class="field coa-col-rangkaian">
                          <label :for="'coa' + (cIdx + 1)">Rangkaian COA {{ cIdx + 1 }}</label>
                          <div class="searchable-dropdown" @click.stop>
                            <div class="searchable-dropdown-trigger" :class="{ 'is-open': isCoaDropdownOpen[cIdx] }"
                              @click="toggleCoaDropdown(cIdx)">
                              <span class="searchable-dropdown-value font-monospace fw-semibold" v-if="coa.rangkaianCoa">
                                {{ coa.rangkaianCoa }}
                              </span>
                              <span class="searchable-dropdown-placeholder" v-else>
                                {{ form.namaDha ? 'Pilih Rangkaian COA ' + (cIdx + 1) + '...' : 'Pilih Nama DHA terlebih dahulu...' }}
                              </span>
                              <div class="searchable-dropdown-actions">
                                <span class="searchable-dropdown-clear" v-if="coa.rangkaianCoa" @click.stop="clearCoaSelection(cIdx)" title="Hapus COA">
                                  <i class="bi bi-x-lg"></i>
                                </span>
                                <i class="bi text-muted" :class="isCoaDropdownOpen[cIdx] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                              </div>
                            </div>

                            <!-- Dropdown Menu for COA -->
                            <div class="searchable-dropdown-menu" style="min-width: 380px;" v-if="isCoaDropdownOpen[cIdx]">
                              <div class="searchable-dropdown-search-box">
                                <i class="bi bi-search text-muted small"></i>
                                <input type="text" class="searchable-dropdown-search-input" v-model="coaFilterText[cIdx]"
                                  placeholder="Cari kode akun atau nama natural akun..." @click.stop />
                                <span class="badge bg-light text-secondary border small">{{ getFilteredCoaOptions(cIdx).length }} hasil</span>
                              </div>
                              <div class="searchable-dropdown-options">
                                <div v-if="getFilteredCoaOptions(cIdx).length === 0" class="searchable-dropdown-no-results">
                                  <i class="bi bi-info-circle d-block mb-1 fs-5"></i>
                                  Tidak ada data rangkaian COA ditemukan
                                </div>
                                <div v-for="cItem in getFilteredCoaOptions(cIdx)" :key="cItem.id || cItem.rangkaianCoa"
                                  class="searchable-dropdown-option"
                                  :class="{ 'is-selected': coa.rangkaianCoa === cItem.rangkaianCoa }"
                                  @click="selectCoa(cIdx, cItem)">
                                  <div class="font-monospace fw-bold text-dark">{{ cItem.rangkaianCoa }}</div>
                                  <div class="searchable-dropdown-option-sub">
                                    <span class="badge-tag tag-emerald fw-medium text-truncate" style="max-width: 260px;" v-if="cItem.naturalAkun">
                                      {{ cItem.naturalAkun }}
                                    </span>
                                    <span class="text-muted small" v-if="cItem.anggaran">
                                      Pagu: {{ formatCurrency(cItem.anggaran) }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Kolom 2: Data Natural Akun (Di sebelah kolom rangkaian COA) -->
                        <div class="field coa-col-natural">
                          <label :for="'naturalAkun' + (cIdx + 1)">Data Natural Akun {{ cIdx + 1 }}</label>
                          <input :id="'naturalAkun' + (cIdx + 1)" type="text" class="form-control"
                            v-model="coa.naturalAkun"
                            placeholder="Otomatis terisi atau ketik nama akun..." />
                        </div>

                        <!-- Kolom 3: Nominal COA (Rp) -->
                        <div class="field coa-col-nominal">
                          <label :for="'coaNominal' + (cIdx + 1)">Nominal COA {{ cIdx + 1 }} (Rp)</label>
                          <input :id="'coaNominal' + (cIdx + 1)" :name="'coaNominal' + (cIdx + 1)"
                            class="coa-nominal" type="text" inputmode="numeric"
                            :value="formatRupiahInput(coa.nominal)"
                            @input="handleCoaNominalInput($event, cIdx)"
                            @blur="handleCoaNominalBlur($event, cIdx)"
                            @focus="handleNominalFocus($event)"
                            placeholder="Rp 0">
                        </div>
                      </div>
                    </div>

                    <div id="coa-check" class="notice" :class="coaTotal > 0 && Math.abs(coaDiff) < 1 ? 'green' : 'amber'" style="margin-top:15px">
                      Total alokasi COA: {{ formatRupiah(coaTotal) }}. {{ coaTotal === 0 ? 'Isi nominal COA sesuai pembebanan. Total alokasi COA akan dibandingkan dengan total invoice.' : (Math.abs(coaDiff) < 1 ? 'Total alokasi COA sama dengan total invoice.' : 'Selisih terhadap total invoice: ' + formatRupiah(coaDiff) + '. Periksa kembali pembebanannya.') }}
                    </div>
                    <div class="divider"></div>
                    <div class="section-title">
                      <span class="section-num">ERP</span> Administrasi ERP
                      <span class="section-desc">Kolom tindak lanjut sesuai workbook</span>
                    </div>
                    <div class="grid">
                      <div class="field col-4">
                        <label for="paidDate">Tanggal Terbayar</label>
                        <div class="custom-date-wrapper">
                          <input id="paidDate" name="paidDate" type="text" class="date-display-input"
                                 :value="formatIsoToDmy(form.paidDate)"
                                 @input="handleDateTextInput($event, (v) => form.paidDate = v)"
                                 @blur="handleDateBlur($event, (v) => form.paidDate = v, form.paidDate)"
                                 placeholder="dd/mm/yyyy" maxlength="10">
                          <input type="date" class="native-date-hidden-trigger" :value="form.paidDate"
                                 @input="form.paidDate = $event.target.value"
                                 @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                          <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                        </div>
                      </div>
                      <div class="field col-4">
                        <label for="pbtPrintDate">Cetak PBT Tanggal</label>
                        <div class="custom-date-wrapper">
                          <input id="pbtPrintDate" name="pbtPrintDate" type="text" class="date-display-input"
                                 :value="formatIsoToDmy(form.pbtPrintDate)"
                                 @input="handleDateTextInput($event, (v) => form.pbtPrintDate = v)"
                                 @blur="handleDateBlur($event, (v) => form.pbtPrintDate = v, form.pbtPrintDate)"
                                 placeholder="dd/mm/yyyy" maxlength="10">
                          <input type="date" class="native-date-hidden-trigger" :value="form.pbtPrintDate"
                                 @input="form.pbtPrintDate = $event.target.value"
                                 @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                          <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                        </div>
                      </div>
                      <div class="field col-4">
                        <label for="pbtSubmitDate">PBT Diserahkan Tanggal</label>
                        <div class="custom-date-wrapper">
                          <input id="pbtSubmitDate" name="pbtSubmitDate" type="text" class="date-display-input"
                                 :value="formatIsoToDmy(form.pbtSubmitDate)"
                                 @input="handleDateTextInput($event, (v) => form.pbtSubmitDate = v)"
                                 @blur="handleDateBlur($event, (v) => form.pbtSubmitDate = v, form.pbtSubmitDate)"
                                 placeholder="dd/mm/yyyy" maxlength="10">
                          <input type="date" class="native-date-hidden-trigger" :value="form.pbtSubmitDate"
                                 @input="form.pbtSubmitDate = $event.target.value"
                                 @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                          <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                        </div>
                      </div>
                    </div>
                    <div class="divider"></div>
                    <div class="section-title">
                      <span class="section-num">✓</span> Review Sebelum Simpan
                    </div>
                    <div class="review-layout">
                      <div>
                        <div class="review-section">
                          <div class="review-head">
                            Ringkasan Batch
                            <button class="btn btn-sm btn-ghost" type="button" @click="jumpStep(1)">Ubah</button>
                          </div>
                          <div class="review-row"><span>No. Batch</span><span id="review-batch">{{ form.noBatch || 'DRAFT BARU' }}</span></div>
                          <div class="review-row"><span>No. Dokumen</span><span id="review-doc">{{ form.noDokumen || '—' }}</span></div>
                          <div class="review-row"><span>Tanggal Transaksi</span><span id="review-date">{{ formatShortDate(form.tglTransaksi) }}</span></div>
                          <div class="review-row"><span>Dari Uker</span><span id="review-uker">{{ form.dariUker || '—' }}</span></div>
                          <div class="review-row"><span>Perihal</span><span id="review-perihal">{{ form.perihal || '—' }}</span></div>
                        </div>
                        <div class="review-section">
                          <div class="review-head">
                            Rekanan & Pembayaran
                            <button class="btn btn-sm btn-ghost" type="button" @click="jumpStep(2)">Ubah</button>
                          </div>
                          <div class="review-row"><span>Nama Rekanan</span><span id="review-partner">{{ chosenPartner || '—' }}</span></div>
                          <div class="review-row"><span>Tipe Pembayaran</span><span id="review-payment">{{ form.tipePembayaran || '—' }}</span></div>
                          <div class="review-row"><span>Bank / Rekening</span><span id="review-account">{{ [form.namaBank, form.nomorRekening].filter(Boolean).join(' / ') || form.namaRekening || '—' }}</span></div>
                          <div class="review-row"><span>Jumlah Invoice</span><span id="review-invoices">{{ invoiceCount }} invoice</span></div>
                        </div>
                      </div>
                      <div>
                        <div class="review-total">
                          <div class="label">Total nominal batch</div>
                          <div class="big" id="review-total">{{ formatRupiah(invoiceTotal) }}</div>
                          <div class="label" style="margin-top:7px">Dijumlah otomatis dari 4 baris invoice.</div>
                        </div>
                        <div class="review-section" style="margin-top:12px">
                          <div class="review-head">Validasi COA</div>
                          <div class="review-row"><span>Total alokasi COA</span><span id="review-coa-total">{{ formatRupiah(coaTotal) }}</span></div>
                          <div class="review-row"><span>Selisih</span><span id="review-coa-diff">{{ formatRupiah(coaDiff) }}</span></div>
                          <div class="review-row">
                            <span>Hasil pemeriksaan</span>
                            <span id="review-coa-status" :style="{ color: coaTotal > 0 && Math.abs(coaDiff) < 1 ? '#168060' : (coaTotal === 0 ? '#8190a5' : '#b5771e') }">
                              {{ coaStatus }}
                            </span>
                          </div>
                        </div>
                        <label class="checkline">
                          <input type="checkbox" id="confirm-check" v-model="confirmCheck">
                          <span>Saya telah memeriksa data batch, invoice, rekanan, rekening, persetujuan, DHA, dan COA berdasarkan dokumen pendukung.</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-footer">
                    <div class="footer-left">Simpan batch hanya setelah pengecekan akhir.</div>
                    <div class="footer-buttons">
                      <button type="button" class="btn" @click="prevStep">← Kembali</button>
                      <button v-if="hasPermission('print_disposisi')" type="button" class="btn" @click="printVoucher()">⎙ Pratinjau Disposisi</button>
                      <button v-if="hasPermission(form.id ? 'form_edit' : 'form_create')" type="button" class="btn btn-primary" @click="saveCompleteBatch">✓ Simpan Batch</button>
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>

          <!-- SUB VIEW 2: RIWAYAT / DAFTAR BATCH -->
          <div v-show="invoiceApSubView === 'history'">
            <div class="page-head">
              <div>
                <div class="eyebrow">Data transaksi</div>
                <h1>Riwayat Batch</h1>
                <p>Telusuri batch invoice yang tersimpan pada prototype ini.</p>
              </div>
              <div class="head-actions">
                <button v-if="hasPermission('form_create')" type="button" class="btn btn-primary" @click="resetFormBatchDirect(); invoiceApSubView = 'form'; setStep(1);">
                  ＋ Buat Batch Baru
                </button>
              </div>
            </div>

            <!-- Metrics -->
            <div class="metrics">
              <div class="metric">
                <div class="metric-top">
                  <div class="metric-label">Batch Ditampilkan</div>
                  <div class="metric-icon">▤</div>
                </div>
                <div class="metric-value">{{ filteredHistoryBatches.length }}</div>
                <div class="metric-foot">Data contoh + sesi prototype</div>
              </div>
              <div class="metric">
                <div class="metric-top">
                  <div class="metric-label">Total Nominal</div>
                  <div class="metric-icon">Rp</div>
                </div>
                <div class="metric-value" style="font-size:21px">{{ historyTotalNominal }}</div>
                <div class="metric-foot">Akumulasi seluruh data</div>
              </div>
              <div class="metric">
                <div class="metric-top">
                  <div class="metric-label">Status Draft</div>
                  <div class="metric-icon">◷</div>
                </div>
                <div class="metric-value">{{ historyDraftCount }}</div>
                <div class="metric-foot">Draft selama sesi aktif</div>
              </div>
            </div>

            <!-- Data Panel -->
            <div class="panel">
              <div class="panel-head">
                <div>
                  <div class="panel-title">Semua Batch</div>
                  <div class="panel-sub">Daftar batch invoice</div>
                </div>
                <div class="tool-row">
                  <div class="search">
                    <span class="search-icon">⌕</span>
                    <input v-model="historySearch" placeholder="Cari batch, rekanan, perihal...">
                  </div>
                  <select class="filter-select" style="height:38px;border:1px solid #dbe2ed;border-radius:7px;padding:0 10px;color:#50617c;width:auto;" v-model="historyStatusFilter">
                    <option value="all">Semua status</option>
                    <option value="Menunggu proses">Menunggu proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>No. Batch</th>
                      <th>Tanggal Proses</th>
                      <th>Rekanan</th>
                      <th>Perihal</th>
                      <th>Nominal Total</th>
                      <th>Status</th>
                      <th style="text-align:center;">Aksi</th>
                    </tr>
                  </thead>
                  <tbody v-if="filteredHistoryBatches.length > 0">
                    <tr v-for="b in filteredHistoryBatches" :key="b.id || b.noBatch">
                      <td><span class="batch-code">{{ b.noBatch || b.batch }}</span></td>
                      <td>{{ formatShortDate(b.processDate || b.tglTransaksi || b.date) }}</td>
                      <td><strong>{{ b.namaRekanan || b.partner || '—' }}</strong></td>
                      <td style="max-width:260px;white-space:normal;line-height:1.5;">{{ b.perihal || '—' }}</td>
                      <td style="font-weight:750;color:#2c3d5b">
                        {{ formatRupiah(b.nominal !== undefined ? b.nominal : (b.nominalTotal !== undefined ? b.nominalTotal : calcBatchTotal(b))) }}
                      </td>
                      <td>
                        <span class="status" :class="b.status === 'Selesai' ? 'status-done' : (b.status === 'Draft' ? 'status-draft' : 'status-review')">
                          {{ b.status || 'Menunggu proses' }}
                        </span>
                      </td>
                      <td style="text-align:center;">
                        <div class="d-flex justify-content-center align-items-center gap-1">
                          <button type="button" class="btn btn-sm btn-ghost" @click="openBatchInForm(b)" title="Lihat di Formulir">
                            Lihat →
                          </button>
                          <button v-if="hasPermission('print_disposisi')" type="button" class="btn btn-sm btn-outline-primary py-1 px-2" @click="loadBatchToForm(b); printVoucher();" title="Cetak Lembar Disposisi">
                            <i class="bi bi-printer"></i> Cetak
                          </button>
                          <button v-if="hasPermission('form_delete')" type="button" class="btn btn-sm btn-danger py-1 px-2" @click="confirmDelete(b)" title="Hapus">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-if="filteredHistoryBatches.length === 0" class="empty">
                  <div class="empty-icon">⌕</div>
                  <strong>Tidak ada data yang cocok</strong>
                  <span>Coba kata kunci atau filter status yang berbeda.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: TRAVEL EVENT
             ================================================================ -->
        <div v-show="currentView === 'travel-event' && canAccessView('travel-event')" class="content-container no-print">
          <div class="form-card p-4">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="card-icon-badge navy" style="width: 46px; height: 46px; font-size: 1.35rem;">
                <i class="bi bi-airplane"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Travel Event</h5>
                <p class="text-muted small mb-0">Pengajuan administrasi perjalanan dinas & kepanitiaan event Bank Indonesia</p>
              </div>
            </div>
            <div class="alert alert-info py-2 px-3 small mb-3">
              <i class="bi bi-info-circle me-1"></i> Modul Travel Event terintegrasi langsung dengan database ERPHRIS.
            </div>
            <div class="d-flex gap-2">
              <button class="btn-erp btn-erp-primary" @click="startNewBatch">
                <i class="bi bi-plus-lg"></i> Form Pengajuan Baru
              </button>
              <button class="btn-erp btn-erp-secondary" @click="currentView = 'invoice-ap'">
                <i class="bi bi-arrow-left"></i> Buka Invoice AP
              </button>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: PENARIKAN UANG MUKA
             ================================================================ -->
        <div v-show="currentView === 'penarikan-um' && canAccessView('penarikan-um')" class="content-container no-print">
          <div class="form-card p-4">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="card-icon-badge amber" style="width: 46px; height: 46px; font-size: 1.35rem;">
                <i class="bi bi-cash-stack"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Penarikan Uang Muka (UM)</h5>
                <p class="text-muted small mb-0">Pengajuan pencairan uang muka kerja operasional satuan kerja</p>
              </div>
            </div>
            <div class="alert alert-warning py-2 px-3 small mb-3">
              <i class="bi bi-exclamation-triangle me-1"></i> Pengambilan Uang Muka wajib dipertanggungjawabkan maksimal 30 hari kalender setelah kegiatan selesai.
            </div>
            <div class="d-flex gap-2">
              <button class="btn-erp btn-erp-primary" @click="startNewBatch">
                <i class="bi bi-plus-lg"></i> Form Pengajuan UM
              </button>
              <button class="btn-erp btn-erp-secondary" @click="currentView = 'invoice-ap'">
                <i class="bi bi-arrow-left"></i> Buka Invoice AP
              </button>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: PERTANGGUNGJAWABAN UANG MUKA
             ================================================================ -->
        <div v-show="currentView === 'pertanggungjawaban-um' && canAccessView('pertanggungjawaban-um')" class="content-container no-print">
          <div class="form-card p-4">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="card-icon-badge teal" style="width: 46px; height: 46px; font-size: 1.35rem;">
                <i class="bi bi-file-earmark-check"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0 text-dark">Pertanggungjawaban Uang Muka (PJUM)</h5>
                <p class="text-muted small mb-0">Verifikasi bukti kuitansi pengeluaran & rekonsiliasi sisa saldo UMK</p>
              </div>
            </div>
            <div class="alert alert-success py-2 px-3 small mb-3">
              <i class="bi bi-check-circle me-1"></i> Seluruh bukti kuitansi sah & faktur pajak harus diunggah sebelum penutupan batch PJUM.
            </div>
            <div class="d-flex gap-2">
              <button class="btn-erp btn-erp-primary" @click="startNewBatch">
                <i class="bi bi-plus-lg"></i> Form Input PJUM
              </button>
              <button class="btn-erp btn-erp-secondary" @click="currentView = 'invoice-ap'">
                <i class="bi bi-arrow-left"></i> Buka Invoice AP
              </button>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: LAPORAN INVOICE
             ================================================================ -->
        <div v-show="currentView === 'laporan-invoice' && canAccessView('laporan-invoice')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-receipt text-primary me-2"></i>Approve Transaksi Invoice AP
                </h3>
                <p class="text-muted small mb-0">Rekapitulasi berkas tagihan invoice, nomor batch, rekanan penerima, dan realisasi pembayaran AP</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn-erp btn-erp-primary" @click="triggerPrint">
                  <i class="bi bi-printer me-1"></i> Cetak Laporan
                </button>
                <button class="btn-erp btn-erp-teal" @click="exportLaporanInvoiceCSV">
                  <i class="bi bi-file-earmark-spreadsheet me-1"></i> Ekspor CSV
                </button>
              </div>
            </div>

            <!-- Ringkasan Statistik Laporan Invoice -->
            <div class="p-3 border-bottom bg-light">
              <div class="row g-2">
                <div class="col-sm-6 col-md-3">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Berkas Invoice</div>
                    <div class="fw-bold text-dark fs-6">{{ filteredLaporanInvoiceList.length }} Batch Transaksi</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Nominal Bruto</div>
                    <div class="fw-bold text-success fs-6">{{ formatCurrency(totalNominalLaporanInvoice) }}</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Status Disetujui (Approved)</div>
                    <div class="fw-bold text-emerald fs-6">{{ countLaporanInvoiceApproved }} Transaksi</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-3">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Status Draft / Pending</div>
                    <div class="fw-bold text-amber fs-6">{{ countLaporanInvoicePending }} Transaksi</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 650px;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="laporanInvoiceSearch"
                    placeholder="Cari No. Batch, Dokumen, Rekanan, Perihal, Pos DHA..." />
                  <button v-if="laporanInvoiceSearch" class="btn btn-outline-secondary" @click="laporanInvoiceSearch = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                <select class="form-select form-select-sm" style="max-width: 220px;" v-model="laporanInvoiceStatusFilter">
                  <option value="ALL">Semua Status Otorisasi</option>
                  <option value="Disetujui">Disetujui (Approved)</option>
                  <option value="Ditolak">Ditolak</option>
                  <option value="Draft">Draft / Menunggu proses</option>
                </select>
              </div>
              <div class="text-muted small">
                Menampilkan <strong>{{ filteredLaporanInvoiceList.length }}</strong> data laporan
              </div>
            </div>

            <!-- Tabel Laporan Invoice -->
            <div class="table-responsive-wrapper">
              <table class="modern-data-table">
                <thead>
                  <tr>
                    <th style="width: 45px; text-align: center;">No</th>
                    <th style="min-width: 110px;">No. Batch</th>
                    <th style="min-width: 130px;">No. Dokumen</th>
                    <th style="min-width: 110px;">Tgl Transaksi</th>
                    <th style="min-width: 160px;">Satker Pengaju</th>
                    <th style="min-width: 200px;">Rekanan & Bank</th>
                    <th style="min-width: 260px; max-width: 380px;">Pos DHA</th>
                    <th style="min-width: 140px; text-align: right;">Total Nominal (Rp)</th>
                    <th style="min-width: 110px; text-align: center;">Status</th>
                    <th style="min-width: 80px; text-align: center;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredLaporanInvoiceList.length === 0">
                    <td colspan="10" class="text-center py-4 text-muted">
                      <i class="bi bi-inbox fs-3 d-block mb-1"></i>
                      Tidak ada data laporan transaksi invoice yang sesuai filter.
                    </td>
                  </tr>
                  <tr v-for="(b, idx) in filteredLaporanInvoiceList" :key="b.id">
                    <td style="text-align: center;">{{ idx + 1 }}</td>
                    <td><span class="badge-tag tag-navy font-monospace fw-bold">{{ b.noBatch }}</span></td>
                    <td class="fw-semibold text-dark">{{ b.noDokumen }}</td>
                    <td>{{ formatDateIndo(b.tglTransaksi) }}</td>
                    <td class="small text-muted">{{ b.dariUker }}</td>
                    <td>
                      <div class="fw-semibold small text-dark">{{ b.namaRekanan }}</div>
                      <div class="text-muted" style="font-size: 0.72rem;">{{ b.namaBank }} ({{ b.nomorRekening }})</div>
                    </td>
                    <td style="min-width: 260px; max-width: 380px; white-space: normal;">
                      <span class="badge-tag tag-emerald text-wrap text-start" style="font-size: 0.75rem; line-height: 1.4; display: inline-block;">{{ b.namaDha || '-' }}</span>
                    </td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: #047857;">
                      {{ formatCurrency(calcBatchTotal(b)) }}
                    </td>
                    <td style="text-align: center;">
                      <span class="badge-tag" :class="getBatchStatusBadgeClass(b.status)">
                        <i class="bi" :class="(b.status === 'Disetujui' || b.status === 'Approved' || b.status === 'Selesai' || b.status === 'Cair') ? 'bi-check-circle-fill' : (b.status === 'Ditolak' ? 'bi-x-circle-fill' : 'bi-clock-history')"></i>
                        {{ b.status || 'Draft' }}
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <button class="btn-erp btn-erp-primary py-1 px-2" style="font-size: 0.75rem;" @click="openDetailModal(b)">
                        <i class="bi bi-eye"></i> Detail
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: LAPORAN TRAVEL
             ================================================================ -->
        <div v-show="currentView === 'laporan-travel' && canAccessView('laporan-travel')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-airplane text-primary me-2"></i>Approve Travel & Perjalanan Dinas
                </h3>
                <p class="text-muted small mb-0">Rekapitulasi surat tugas perjalanan dinas, pelaksana tugas, kota tujuan, dan akomodasi ERPHRIS</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn-erp btn-erp-primary" @click="triggerPrint">
                  <i class="bi bi-printer me-1"></i> Cetak Laporan
                </button>
                <button class="btn-erp btn-erp-teal" @click="exportLaporanTravelCSV">
                  <i class="bi bi-file-earmark-spreadsheet me-1"></i> Ekspor CSV
                </button>
              </div>
            </div>

            <!-- Ringkasan Statistik Laporan Travel -->
            <div class="p-3 border-bottom bg-light">
              <div class="row g-2">
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Perjalanan Dinas</div>
                    <div class="fw-bold text-dark fs-6">{{ filteredLaporanTravelList.length }} Surat Tugas</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Biaya Realisasi</div>
                    <div class="fw-bold text-success fs-6">{{ formatCurrency(totalNominalLaporanTravel) }}</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Status Perjalanan</div>
                    <div class="fw-bold text-primary fs-6">100% Terpantau ERPHRIS</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 550px;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="laporanTravelSearch"
                    placeholder="Cari No. ST, Nama Pegawai, NIP, Satker, Kota Tujuan..." />
                  <button v-if="laporanTravelSearch" class="btn btn-outline-secondary" @click="laporanTravelSearch = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                <select class="form-select form-select-sm" style="max-width: 200px;" v-model="laporanTravelStatusFilter">
                  <option value="ALL">Semua Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Terverifikasi">Terverifikasi</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                </select>
              </div>
              <div class="text-muted small">
                Menampilkan <strong>{{ filteredLaporanTravelList.length }}</strong> kegiatan travel
              </div>
            </div>

            <!-- Tabel Laporan Travel -->
            <div class="table-responsive-wrapper">
              <table class="modern-data-table">
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">No</th>
                    <th>No. Surat Tugas</th>
                    <th>Pelaksana Tugas</th>
                    <th>Satuan Kerja</th>
                    <th>Periode</th>
                    <th>Kota Tujuan</th>
                    <th>Uraian Tugas / Kegiatan</th>
                    <th style="text-align: right;">Total Biaya (Rp)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredLaporanTravelList.length === 0">
                    <td colspan="9" class="text-center py-4 text-muted">
                      Tidak ada data perjalanan dinas yang sesuai filter.
                    </td>
                  </tr>
                  <tr v-for="(t, idx) in filteredLaporanTravelList" :key="t.id">
                    <td style="text-align: center;">{{ idx + 1 }}</td>
                    <td><span class="badge-tag tag-navy font-monospace">{{ t.noSuratTugas }}</span></td>
                    <td>
                      <div class="fw-semibold text-dark">{{ t.namaPegawai }}</div>
                      <div class="text-muted font-monospace" style="font-size: 0.72rem;">NIP: {{ t.nip }}</div>
                    </td>
                    <td class="small text-muted">{{ t.satker }}</td>
                    <td class="small">{{ formatDateIndo(t.tglBerangkat) }} s/d {{ formatDateIndo(t.tglKembali) }}</td>
                    <td><span class="badge-tag tag-indigo"><i class="bi bi-geo-alt me-1"></i>{{ t.kotaTujuan }}</span></td>
                    <td style="max-width: 250px; white-space: normal;" class="small">{{ t.uraianTugas }}</td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: #047857;">
                      {{ formatCurrency(t.totalBiaya) }}
                    </td>
                    <td>
                      <span class="badge-tag" :class="t.status === 'Selesai' || t.status === 'Terverifikasi' ? 'tag-emerald' : 'tag-amber'">
                        {{ t.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: LAPORAN PENARIKAN
             ================================================================ -->
        <div v-show="currentView === 'laporan-penarikan' && canAccessView('laporan-penarikan')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-cash-stack text-primary me-2"></i>Approve Penarikan Uang Muka (UMK)
                </h3>
                <p class="text-muted small mb-0">Rekapitulasi pencairan uang muka kerja operasional satker, jatuh tempo pelunasan, dan saldo berjalan</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn-erp btn-erp-primary" @click="triggerPrint">
                  <i class="bi bi-printer me-1"></i> Cetak Laporan
                </button>
                <button class="btn-erp btn-erp-teal" @click="exportLaporanPenarikanCSV">
                  <i class="bi bi-file-earmark-spreadsheet me-1"></i> Ekspor CSV
                </button>
              </div>
            </div>

            <!-- Ringkasan Statistik Laporan Penarikan -->
            <div class="p-3 border-bottom bg-light">
              <div class="row g-2">
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Pengajuan Penarikan</div>
                    <div class="fw-bold text-dark fs-6">{{ filteredLaporanPenarikanList.length }} Penarikan UM</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Nominal Dicairkan</div>
                    <div class="fw-bold text-success fs-6">{{ formatCurrency(totalNominalLaporanPenarikan) }}</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Kepatuhan Batas Waktu</div>
                    <div class="fw-bold text-primary fs-6">Maksimal 30 Hari Kalender</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 550px;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="laporanPenarikanSearch"
                    placeholder="Cari No. Penarikan, Penerima, Satker, Keperluan..." />
                  <button v-if="laporanPenarikanSearch" class="btn btn-outline-secondary" @click="laporanPenarikanSearch = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                <select class="form-select form-select-sm" style="max-width: 200px;" v-model="laporanPenarikanStatusFilter">
                  <option value="ALL">Semua Status</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Menunggu PJUM">Menunggu PJUM</option>
                  <option value="Aktif / Berjalan">Aktif / Berjalan</option>
                </select>
              </div>
              <div class="text-muted small">
                Menampilkan <strong>{{ filteredLaporanPenarikanList.length }}</strong> penarikan dana
              </div>
            </div>

            <!-- Tabel Laporan Penarikan -->
            <div class="table-responsive-wrapper">
              <table class="modern-data-table">
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">No</th>
                    <th>No. Penarikan</th>
                    <th>Tanggal Cair</th>
                    <th>Penerima Dana</th>
                    <th>Satuan Kerja</th>
                    <th>Keperluan / Uraian Kegiatan</th>
                    <th style="text-align: right;">Nominal Pencairan (Rp)</th>
                    <th>Batas Waktu PJUM</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredLaporanPenarikanList.length === 0">
                    <td colspan="9" class="text-center py-4 text-muted">
                      Tidak ada data penarikan uang muka yang sesuai filter.
                    </td>
                  </tr>
                  <tr v-for="(p, idx) in filteredLaporanPenarikanList" :key="p.id">
                    <td style="text-align: center;">{{ idx + 1 }}</td>
                    <td><span class="badge-tag tag-navy font-monospace">{{ p.noPenarikan }}</span></td>
                    <td>{{ formatDateIndo(p.tglPenarikan) }}</td>
                    <td class="fw-semibold text-dark">{{ p.penerima }}</td>
                    <td class="small text-muted">{{ p.satker }}</td>
                    <td style="max-width: 280px; white-space: normal;" class="small">{{ p.keperluan }}</td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: #047857;">
                      {{ formatCurrency(p.nominal) }}
                    </td>
                    <td class="small font-monospace">{{ formatDateIndo(p.batasPjum) }}</td>
                    <td>
                      <span class="badge-tag" :class="p.status === 'Lunas' ? 'tag-emerald' : (p.status === 'Menunggu PJUM' ? 'tag-rose' : 'tag-amber')">
                        {{ p.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: LAPORAN PERTANGGUNGJAWABAN UANG
             ================================================================ -->
        <div v-show="currentView === 'laporan-pertanggungjawaban' && canAccessView('laporan-pertanggungjawaban')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-file-earmark-check text-primary me-2"></i>Approve Pertanggungjawaban Uang (PJUM)
                </h3>
                <p class="text-muted small mb-0">Rekonsiliasi berkas kuitansi pengeluaran fisik, audit kepatuhan bukti sah, dan pengembalian sisa kas</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn-erp btn-erp-primary" @click="triggerPrint">
                  <i class="bi bi-printer me-1"></i> Cetak Laporan
                </button>
                <button class="btn-erp btn-erp-teal" @click="exportLaporanPjumCSV">
                  <i class="bi bi-file-earmark-spreadsheet me-1"></i> Ekspor CSV
                </button>
              </div>
            </div>

            <!-- Ringkasan Statistik Laporan PJUM -->
            <div class="p-3 border-bottom bg-light">
              <div class="row g-2">
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Dokumen PJUM</div>
                    <div class="fw-bold text-dark fs-6">{{ filteredLaporanPjumList.length }} Berkas Selesai</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Realisasi Belanja Sah</div>
                    <div class="fw-bold text-success fs-6">{{ formatCurrency(totalNominalLaporanPjum) }}</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Sisa Disetor ke Kas</div>
                    <div class="fw-bold text-primary fs-6">{{ formatCurrency(totalSisaLaporanPjum) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 550px;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="laporanPjumSearch"
                    placeholder="Cari No. PJUM, Ref Penarikan, Penanggung Jawab, Verifikator..." />
                  <button v-if="laporanPjumSearch" class="btn btn-outline-secondary" @click="laporanPjumSearch = ''">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
                <select class="form-select form-select-sm" style="max-width: 200px;" v-model="laporanPjumStatusFilter">
                  <option value="ALL">Semua Status</option>
                  <option value="Terverifikasi Lengkap">Terverifikasi Lengkap</option>
                  <option value="Dalam Audit Rekonsiliasi">Dalam Audit Rekonsiliasi</option>
                </select>
              </div>
              <div class="text-muted small">
                Menampilkan <strong>{{ filteredLaporanPjumList.length }}</strong> berkas pertanggungjawaban
              </div>
            </div>

            <!-- Tabel Laporan PJUM -->
            <div class="table-responsive-wrapper">
              <table class="modern-data-table">
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">No</th>
                    <th>No. Dokumen PJUM</th>
                    <th>Ref. No. Penarikan</th>
                    <th>Tgl Laporan</th>
                    <th>Penanggung Jawab</th>
                    <th>Satuan Kerja</th>
                    <th style="text-align: right;">Nominal UM (Rp)</th>
                    <th style="text-align: right;">Realisasi Belanja (Rp)</th>
                    <th style="text-align: right;">Sisa Kas (Rp)</th>
                    <th>Verifikator</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredLaporanPjumList.length === 0">
                    <td colspan="11" class="text-center py-4 text-muted">
                      Tidak ada data pertanggungjawaban uang yang sesuai filter.
                    </td>
                  </tr>
                  <tr v-for="(pj, idx) in filteredLaporanPjumList" :key="pj.id">
                    <td style="text-align: center;">{{ idx + 1 }}</td>
                    <td><span class="badge-tag tag-navy font-monospace">{{ pj.noPjum }}</span></td>
                    <td class="font-monospace text-muted small">{{ pj.noRefPenarikan }}</td>
                    <td>{{ formatDateIndo(pj.tglPjum) }}</td>
                    <td class="fw-semibold text-dark">{{ pj.penanggungJawab }}</td>
                    <td class="small text-muted">{{ pj.satker }}</td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
                      {{ formatCurrency(pj.nominalUm) }}
                    </td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: #047857;">
                      {{ formatCurrency(pj.realisasi) }}
                    </td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 600; color: #0284c7;">
                      {{ formatCurrency(pj.sisaKas) }}
                    </td>
                    <td class="small">{{ pj.verifikator }}</td>
                    <td>
                      <span class="badge-tag" :class="pj.status === 'Terverifikasi Lengkap' ? 'tag-emerald' : 'tag-amber'">
                        {{ pj.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: DATA PEGAWAI (DATA MASTER)
             ================================================================ -->
        <div v-show="currentView === 'data-pegawai' && canAccessView('data-pegawai')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-person-badge text-primary me-2"></i>Data Master Pegawai
                </h3>
                <p class="text-muted small mb-0">Master database pegawai, pejabat pengaju, dan penyetuju transaksi Bank Indonesia</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge-tag tag-navy">{{ filteredPegawaiList.length }} Pegawai</span>
                <button class="btn-erp btn-erp-primary" @click="openPegawaiModal" title="Tambah Data Pegawai Baru">
                  <i class="bi bi-person-plus-fill"></i> Tambah Pegawai
                </button>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2" style="max-width: 420px; width: 100%;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="pegawaiSearch"
                    placeholder="Cari NIP, nama pejabat/pegawai, pangkat, satker..." />
                </div>
                <button class="btn btn-sm btn-outline-secondary" v-if="pegawaiSearch" @click="pegawaiSearch = ''">
                  Reset
                </button>
              </div>
              <div class="text-muted small">
                Total: <strong>{{ filteredPegawaiList.length }}</strong> dari {{ pegawaiList.length }} data pegawai terdaftar
              </div>
            </div>

            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th style="width: 50px;">No</th>
                    <th>NIP / Identitas</th>
                    <th>Nama Pegawai & Gelar</th>
                    <th>Pangkat / Role</th>
                    <th>Rekening & Bank</th>
                    <th>Unit Kerja / Satker</th>
                    <th>Peran Otorisasi</th>
                    <th style="text-align: center;">Status</th>
                    <th style="text-align: center; width: 100px;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredPegawaiList.length === 0">
                    <td colspan="9" class="text-center py-4 text-muted">
                      <i class="bi bi-person-x fs-3 d-block mb-1"></i>
                      <span v-if="pegawaiSearch">Data pegawai tidak ditemukan dengan kata kunci "{{ pegawaiSearch }}".</span>
                      <span v-else>Belum ada data pegawai terdaftar.</span>
                    </td>
                  </tr>
                  <tr v-for="(p, idx) in filteredPegawaiList" :key="p.id">
                    <td>{{ idx + 1 }}</td>
                    <td>
                      <span class="badge-tag tag-navy font-monospace fw-bold">{{ p.nip }}</span>
                    </td>
                    <td class="fw-semibold text-dark">{{ p.nama }}</td>
                    <td>
                      <div>{{ p.pangkat }}</div>
                      <small class="text-muted d-block" v-if="p.jabatan && p.jabatan !== p.pangkat">Role: {{ p.jabatan }}</small>
                    </td>
                    <td>
                      <div v-if="p.bank || p.noRek">
                        <span class="fw-semibold text-dark small d-block">{{ p.bank || '-' }}</span>
                        <span class="font-monospace text-muted small">{{ p.noRek || '-' }}</span>
                      </div>
                      <span v-else class="text-muted small">-</span>
                    </td>
                    <td>{{ p.uker }}</td>
                    <td>
                      <span class="badge-tag" :class="p.peran === 'Pejabat Penyetuju' ? 'tag-emerald' : 'tag-indigo'">
                        <i class="bi" :class="p.peran === 'Pejabat Penyetuju' ? 'bi-patch-check-fill' : 'bi-pen-fill'"></i>
                        {{ p.peran }}
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <span class="badge-tag tag-emerald" v-if="p.status === 'Aktif'">
                        <i class="bi bi-check-circle-fill"></i> {{ p.status }}
                      </span>
                      <span class="badge-tag tag-secondary" v-else>
                        {{ p.status }}
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-sm btn-outline-primary py-0 px-2" @click="editPegawai(p)" title="Edit Data Pegawai">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="deletePegawai(p.id)" title="Hapus Data Pegawai">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: DATA BANK (DATA MASTER)
             ================================================================ -->
        <div v-show="currentView === 'data-bank' && canAccessView('data-bank')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-bank text-primary me-2"></i>Data Bank
                </h3>
                <p class="text-muted small mb-0">Master database bank operasional, sandi kliring BI, dan kanal pembayaran Bank Indonesia</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge-tag tag-navy">{{ filteredMasterBankList.length }} Bank</span>
                <button class="btn-erp btn-erp-primary" @click="openBankModal" title="Tambah Data Bank Baru">
                  <i class="bi bi-plus-circle-fill"></i> Tambah Bank
                </button>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2" style="max-width: 440px; width: 100%;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="bankSearch"
                    placeholder="Cari kode bank, nama bank, jenis, kanal..." />
                </div>
                <button class="btn btn-sm btn-outline-secondary" v-if="bankSearch" @click="bankSearch = ''">
                  Reset
                </button>
              </div>
              <div class="text-muted small">
                Total: <strong>{{ filteredMasterBankList.length }}</strong> dari {{ masterBankList.length }} bank terdaftar
              </div>
            </div>

            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th style="width: 50px;">No</th>
                    <th>Kode Bank</th>
                    <th>Nama Bank</th>
                    <th>Kategori / Jenis Bank</th>
                    <th>Kanal Transfer & Kliring</th>
                    <th style="text-align: center;">Status</th>
                    <th style="text-align: center; width: 100px;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredMasterBankList.length === 0">
                    <td colspan="7" class="text-center py-4 text-muted">
                      <i class="bi bi-bank fs-3 d-block mb-1"></i>
                      <span v-if="bankSearch">Data bank tidak ditemukan dengan kata kunci "{{ bankSearch }}".</span>
                      <span v-else>Belum ada data bank terdaftar.</span>
                    </td>
                  </tr>
                  <tr v-for="(b, idx) in filteredMasterBankList" :key="b.id">
                    <td>{{ idx + 1 }}</td>
                    <td>
                      <span class="badge-tag tag-navy font-monospace fw-bold">{{ b.kode }}</span>
                    </td>
                    <td class="fw-semibold text-dark">{{ b.nama }}</td>
                    <td>
                      <span class="badge-tag" :class="b.jenis && (b.jenis.includes('HIMBARA') || b.jenis.includes('BUMN')) ? 'tag-indigo' : (b.jenis && b.jenis.includes('Syariah')) ? 'tag-emerald' : (b.jenis && b.jenis.includes('Daerah')) ? 'tag-teal' : 'tag-secondary'">
                        {{ b.jenis || 'Bank Umum Swasta / Asing' }}
                      </span>
                    </td>
                    <td>
                      <span class="badge-tag tag-amber font-monospace">{{ b.kliring || 'BI-FAST / SKNBI / RTGS' }}</span>
                    </td>
                    <td style="text-align: center;">
                      <span class="badge-tag tag-emerald">
                        <i class="bi bi-check-circle-fill"></i> {{ b.status || 'Aktif' }}
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-sm btn-outline-primary py-0 px-2" @click="editBank(b)" title="Edit Data Bank">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="deleteBank(b.id)" title="Hapus Data Bank">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: DATA REKANAN (DATA MASTER)
             ================================================================ -->
        <div v-show="currentView === 'data-rekanan' && canAccessView('data-rekanan')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-building text-primary me-2"></i>Data Master Rekanan & Vendor
                </h3>
                <p class="text-muted small mb-0">Master database penyedia barang/jasa, rekanan kontrak, dan wajib pajak mitra Bank Indonesia</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge-tag tag-navy">{{ filteredRekananList.length }} Rekanan</span>
                <button class="btn-erp btn-erp-primary" @click="openRekananModal" title="Tambah Data Rekanan Baru">
                  <i class="bi bi-plus-circle-fill"></i> Tambah Rekanan
                </button>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2" style="max-width: 440px; width: 100%;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="rekananSearch"
                    placeholder="Cari nama rekanan, alamat, NIK/NPWP, nama NPWP..." />
                </div>
                <button class="btn btn-sm btn-outline-secondary" v-if="rekananSearch" @click="rekananSearch = ''">
                  Reset
                </button>
              </div>
              <div class="text-muted small">
                Total: <strong>{{ filteredRekananList.length }}</strong> dari {{ rekananPresets.length }} rekanan terdaftar
              </div>
            </div>

            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th style="width: 50px;">No</th>
                    <th>Nama Rekanan</th>
                    <th>Alamat</th>
                    <th>NIK/NPWP</th>
                    <th>Nama NPWP</th>
                    <th style="text-align: center; width: 100px;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredRekananList.length === 0">
                    <td colspan="6" class="text-center py-4 text-muted">
                      <i class="bi bi-building-x fs-3 d-block mb-1"></i>
                      <span v-if="rekananSearch">Data rekanan tidak ditemukan dengan kata kunci "{{ rekananSearch }}".</span>
                      <span v-else>Belum ada data rekanan terdaftar.</span>
                    </td>
                  </tr>
                  <tr v-for="(r, idx) in filteredRekananList" :key="r.id || idx">
                    <td>{{ idx + 1 }}</td>
                    <td class="fw-semibold text-dark">{{ r.nama }}</td>
                    <td style="max-width: 280px; white-space: normal;" class="small text-muted">{{ r.alamat }}</td>
                    <td>
                      <span class="badge-tag tag-navy fw-semibold">{{ r.nikNpwp }}</span>
                    </td>
                    <td class="fw-medium text-dark">{{ r.namaWp }}</td>
                    <td style="text-align: center;">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-sm btn-outline-primary py-0 px-2" @click="editRekanan(r)" title="Edit Data Rekanan">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="deleteRekanan(r.id)" title="Hapus Data Rekanan">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: DATA DHA (DATA MASTER)
             ================================================================ -->
        <div v-show="currentView === 'data-dha' && canAccessView('data-dha')" class="content-container no-print">
          <div class="table-card">
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-pie-chart text-primary me-2"></i>Data Master DHA
                </h3>
                <p class="text-muted small mb-0">Master database himpunan anggaran, rangkaian COA, pagu anggaran, dan natural akun Bank Indonesia</p>
              </div>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <span class="badge-tag tag-navy">{{ filteredDhaList.length }} Data DHA</span>
                <button class="btn-erp btn-erp-teal" @click="exportDhaToExcel" title="Ekspor seluruh database Master DHA ke file Excel (.xlsx)">
                  <i class="bi bi-file-earmark-excel"></i> Ekspor Excel
                </button>
                <button class="btn-erp btn-erp-secondary" @click="openImportDhaModal" title="Impor data Master DHA dari file Excel (.xlsx / .csv)">
                  <i class="bi bi-file-earmark-arrow-up"></i> Impor Excel
                </button>
                <button class="btn-erp btn-erp-primary" @click="openDhaModal" title="Tambah Data DHA Baru">
                  <i class="bi bi-plus-circle-fill"></i> Tambah DHA
                </button>
              </div>
            </div>

            <!-- Ringkasan Statistik DHA -->
            <div class="p-3 border-bottom bg-light">
              <div class="row g-2">
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Anggaran</div>
                    <div class="fw-bold text-success fs-6">{{ formatCurrency(totalAnggaranDha) }}</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Jumlah Pos DHA</div>
                    <div class="fw-bold text-dark fs-6">{{ dhaList.length }} Pos Terdaftar</div>
                  </div>
                </div>
                <div class="col-sm-6 col-md-4">
                  <div class="p-2 border rounded bg-white">
                    <div class="text-muted small">Total Natural Akun</div>
                    <div class="fw-bold text-primary fs-6">{{ uniqueNaturalAkunCount }} Kategori Akun</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2" style="max-width: 460px; width: 100%;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="dhaSearch"
                    placeholder="Cari DHA, rangkaian COA, anggaran, natural akun..." />
                </div>
                <button class="btn btn-sm btn-outline-secondary" v-if="dhaSearch" @click="dhaSearch = ''">
                  Reset
                </button>
              </div>
              <div class="text-muted small">
                Total: <strong>{{ filteredDhaList.length }}</strong> dari {{ dhaList.length }} data DHA terdaftar
              </div>
            </div>

            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th style="width: 50px;">No</th>
                    <th>DHA (Uraian Kegiatan / Anggaran)</th>
                    <th>Rangkaian COA</th>
                    <th style="text-align: right;">ANGGARAN</th>
                    <th>Natural Akun</th>
                    <th style="text-align: center; width: 100px;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredDhaList.length === 0">
                    <td colspan="6" class="text-center py-4 text-muted">
                      <i class="bi bi-pie-chart fs-3 d-block mb-1"></i>
                      <span v-if="dhaSearch">Data DHA tidak ditemukan dengan kata kunci "{{ dhaSearch }}".</span>
                      <span v-else>Belum ada data DHA terdaftar.</span>
                    </td>
                  </tr>
                  <tr v-for="(d, idx) in paginatedDhaList" :key="d.id || idx">
                    <td>{{ (dhaPage - 1) * dhaPageSize + idx + 1 }}</td>
                    <td class="fw-semibold text-dark" style="max-width: 320px; white-space: normal;">
                      {{ d.dha || d.nama }}
                    </td>
                    <td>
                      <span class="badge-tag tag-navy font-monospace">{{ d.rangkaianCoa }}</span>
                    </td>
                    <td style="text-align: right;" class="font-monospace fw-bold text-dark">
                      {{ formatCurrency(d.anggaran !== undefined ? d.anggaran : (d.saldo || 0)) }}
                    </td>
                    <td>
                      <span class="badge-tag tag-emerald fw-medium">{{ d.naturalAkun }}</span>
                    </td>
                    <td style="text-align: center;">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-sm btn-outline-primary py-0 px-2" @click="editDha(d)" title="Edit Data DHA">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="deleteDha(d.id || d.dha || d.nama)" title="Hapus Data DHA">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- DHA Pagination Controls -->
            <div class="p-3 border-top bg-light d-flex flex-wrap gap-2 justify-content-between align-items-center" v-if="filteredDhaList.length > 0">
              <div class="text-muted small">
                Menampilkan <strong>{{ (dhaPage - 1) * dhaPageSize + 1 }}</strong> - <strong>{{ Math.min(dhaPage * dhaPageSize, filteredDhaList.length) }}</strong> dari <strong>{{ filteredDhaList.length }}</strong> data DHA
              </div>
              <div class="d-flex align-items-center gap-2">
                <select class="form-select form-select-sm" style="width: auto;" v-model.number="dhaPageSize" @change="dhaPage = 1">
                  <option :value="10">10 / hal</option>
                  <option :value="20">20 / hal</option>
                  <option :value="50">50 / hal</option>
                  <option :value="100">100 / hal</option>
                </select>
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-outline-secondary" :disabled="dhaPage <= 1" @click="dhaPage--">
                    <i class="bi bi-chevron-left"></i> Prev
                  </button>
                  <button class="btn btn-outline-primary fw-bold" disabled>
                    Hal {{ dhaPage }} / {{ dhaTotalPages }}
                  </button>
                  <button class="btn btn-outline-secondary" :disabled="dhaPage >= dhaTotalPages" @click="dhaPage++">
                    Next <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: DATA UNIT KERJA (DATA MASTER)
             ================================================================ -->
        <div v-show="currentView === 'data-unit-kerja' && canAccessView('data-unit-kerja')" class="content-container no-print">
          <div class="table-card">
            <!-- Header Bar -->
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-diagram-3 text-primary me-2"></i>Data Master Unit Kerja
                </h3>
                <p class="text-muted small mb-0">Master data divisi, seksi, unit kerja, dan fungsi operasional Bank Indonesia (Tabel: unit_kerja)</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge-tag tag-navy">{{ filteredUnitKerjaList.length }} Unit Kerja</span>
                <button class="btn-erp btn-erp-primary" @click="openUnitKerjaModal" title="Tambah Unit Kerja Baru">
                  <i class="bi bi-plus-circle-fill"></i> Tambah Unit Kerja
                </button>
              </div>
            </div>

            <!-- Filter & Search Toolbar -->
            <div class="p-3 border-bottom bg-light d-flex flex-wrap gap-2 align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 480px;">
                <div class="input-group input-group-sm">
                  <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
                  <input type="text" class="form-control form-control-sm" v-model="unitKerjaSearch"
                    placeholder="Cari kode unit atau nama unit kerja..." />
                </div>
                <button class="btn btn-sm btn-outline-secondary" v-if="unitKerjaSearch" @click="unitKerjaSearch = ''">
                  Reset
                </button>
              </div>
              <div class="text-muted small">
                Total: <strong>{{ filteredUnitKerjaList.length }}</strong> dari {{ masterUnitKerjaList.length }} unit kerja terdaftar
              </div>
            </div>

            <div class="table-responsive">
              <table class="table-erp">
                <thead>
                  <tr>
                    <th style="width: 50px;">No</th>
                    <th style="width: 70px;">ID</th>
                    <th style="width: 160px;">Kode Unit</th>
                    <th>Nama Unit Kerja</th>
                    <th style="text-align: center; width: 120px;">Status</th>
                    <th style="text-align: center; width: 110px;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredUnitKerjaList.length === 0">
                    <td colspan="6" class="text-center py-4 text-muted">
                      <i class="bi bi-diagram-3 fs-3 d-block mb-1"></i>
                      <span v-if="unitKerjaSearch">Data unit kerja tidak ditemukan dengan kata kunci "{{ unitKerjaSearch }}".</span>
                      <span v-else>Belum ada data unit kerja terdaftar di tabel <code>unit_kerja</code>.</span>
                    </td>
                  </tr>
                  <tr v-for="(u, idx) in filteredUnitKerjaList" :key="u.id || idx">
                    <td>{{ idx + 1 }}</td>
                    <td class="text-muted font-monospace small">#{{ u.id }}</td>
                    <td>
                      <span class="badge-tag tag-navy font-monospace fw-bold">{{ u.kode_unit || u.kode || '-' }}</span>
                    </td>
                    <td class="fw-semibold text-dark">
                      {{ u.nama_unit || u.nama }}
                    </td>
                    <td style="text-align: center;">
                      <span class="badge-tag tag-emerald">
                        <i class="bi bi-check-circle-fill"></i> Aktif
                      </span>
                    </td>
                    <td style="text-align: center;">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-sm btn-outline-primary py-0 px-2" @click="editUnitKerja(u)" title="Edit Unit Kerja">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2" @click="deleteUnitKerja(u.id)" title="Hapus Unit Kerja">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW: PENGATURAN (SETTINGS)
             ================================================================ -->
        <div v-show="currentView === 'pengaturan'" class="content-container no-print">
          <div class="table-card">
            <!-- Header Bar -->
            <div class="table-header-bar flex-wrap gap-2">
              <div>
                <h3 class="table-header-title">
                  <i class="bi bi-gear-fill text-primary me-2"></i>Pengaturan Sistem
                </h3>
                <p class="text-muted small mb-0">Konfigurasi profil operator, koneksi database, parameter transaksi, dan pemeliharaan data sistem</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button class="btn-erp btn-erp-secondary" @click="testServerConnection" title="Uji Koneksi Backend">
                  <i class="bi bi-arrow-repeat me-1"></i> Uji Koneksi
                </button>
                <button class="btn-erp btn-erp-primary" @click="saveSettings" title="Simpan Pengaturan">
                  <i class="bi bi-check-lg me-1"></i> Simpan Pengaturan
                </button>
              </div>
            </div>

            <!-- Tab Navigasi Pengaturan -->
            <div class="p-3 border-bottom bg-light">
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-sm" :class="settingTab === 'profil' ? 'btn-primary' : 'btn-outline-secondary'" @click="settingTab = 'profil'">
                  <i class="bi bi-person-circle me-1"></i> Profil Pengguna & Satker
                </button>
                <button v-if="hasPermission('manage_users')" class="btn btn-sm" :class="settingTab === 'users' ? 'btn-primary' : 'btn-outline-secondary'" @click="settingTab = 'users'">
                  <i class="bi bi-shield-lock-fill me-1"></i> Pengguna & Hak Akses
                </button>
                <button v-if="hasPermission('system_settings')" class="btn btn-sm" :class="settingTab === 'database' ? 'btn-primary' : 'btn-outline-secondary'" @click="settingTab = 'database'">
                  <i class="bi bi-database-check me-1"></i> Koneksi Database & Server
                </button>
                <button v-if="hasPermission('system_settings')" class="btn btn-sm" :class="settingTab === 'transaksi' ? 'btn-primary' : 'btn-outline-secondary'" @click="settingTab = 'transaksi'">
                  <i class="bi bi-sliders me-1"></i> Parameter Transaksi
                </button>
                <button v-if="hasPermission('system_settings')" class="btn btn-sm" :class="settingTab === 'backup' ? 'btn-primary' : 'btn-outline-secondary'" @click="settingTab = 'backup'">
                  <i class="bi bi-cloud-arrow-down me-1"></i> Backup & Cadangan
                </button>
                <button class="btn btn-sm" :class="settingTab === 'cetak' ? 'btn-primary' : 'btn-outline-secondary'" @click="settingTab = 'cetak'">
                  <i class="bi bi-printer me-1"></i> Pengaturan Cetak
                </button>
              </div>
            </div>

            <!-- Content Tab 1: Profil Pengguna & Satker -->
            <div class="p-4" v-show="settingTab === 'profil'">
              <div class="row g-4">
                <div class="col-lg-4">
                  <div class="p-4 border rounded bg-white text-center shadow-sm h-100 d-flex flex-column justify-content-center align-items-center">
                    <div class="user-avatar-circle mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                      <span>{{ (currentUser.name || 'U').charAt(0).toUpperCase() }}</span>
                    </div>
                    <h5 class="fw-bold mb-1 text-dark">{{ currentUser.name }}</h5>
                    <span class="badge-tag tag-indigo mb-2">{{ currentUser.role }}</span>
                    <p class="text-muted small mb-3">{{ currentUser.satker }}</p>
                    <div class="alert alert-info py-2 px-3 small w-100 text-start mb-0">
                      <i class="bi bi-shield-check me-1 text-primary"></i>
                      <span>Role aktif otorisasi transaksi pada sistem manajemen keuangan BI.</span>
                    </div>
                  </div>
                </div>

                <div class="col-lg-8">
                  <div class="p-4 border rounded bg-white shadow-sm">
                    <h5 class="fw-bold mb-3 text-dark border-bottom pb-2">
                      <i class="bi bi-person-vcard text-primary me-2"></i>Identitas Operator & Satker
                    </h5>
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label fw-semibold small mb-1">Nama Lengkap Operator <span class="text-danger">*</span></label>
                        <input type="text" class="form-control form-control-sm" v-model="currentUser.name" required />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-semibold small mb-1">NIP / Identitas Pegawai</label>
                        <input type="text" class="form-control form-control-sm font-monospace" v-model="currentUser.nip" placeholder="Contoh: 19880412 201202 1 002" />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-semibold small mb-1">Jabatan Operasional <span class="text-danger">*</span></label>
                        <input type="text" class="form-control form-control-sm" v-model="currentUser.role" required />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-semibold small mb-1">Email / Kontak Dinas</label>
                        <input type="email" class="form-control form-control-sm" v-model="currentUser.email" placeholder="Contoh: operator.keu@bi.go.id" />
                      </div>
                      <div class="col-12">
                        <label class="form-label fw-semibold small mb-1">Satuan Kerja / Unit Kerja Utama <span class="text-danger">*</span></label>
                        <select class="form-select form-select-sm" v-model="currentUser.satker">
                          <option v-for="u in ukerList" :key="u" :value="u">{{ u }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Tab: Pengguna & Hak Akses (RBAC) -->
            <div class="p-4" v-show="settingTab === 'users' && hasPermission('manage_users')">
              <!-- Header & Quick Action -->
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 border-bottom">
                <div>
                  <h4 class="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                    <i class="bi bi-shield-lock-fill text-primary"></i>
                    Manajemen Pengguna & Pengaturan Hak Akses Aplikasi
                  </h4>
                  <p class="text-muted small mb-0">
                    Konfigurasi akun pengguna, penugasan role kewenangan (Maker, Checker, Approver, Auditor, Super Admin), serta tata kelola akses masuk aplikasi Bank Indonesia.
                  </p>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn-erp btn-erp-secondary" @click="fetchUsers" title="Muat Ulang Data Pengguna">
                    <i class="bi bi-arrow-repeat me-1"></i> Segarkan Data
                  </button>
                  <button class="btn-erp btn-erp-primary" @click="openUserModal('add')">
                    <i class="bi bi-person-plus-fill me-1"></i> Tambah Pengguna Baru
                  </button>
                </div>
              </div>

              <!-- Role Summary Cards -->
              <div class="row g-3 mb-4">
                <div class="col-md-4 col-lg" v-for="r in userRoles" :key="r.key">
                  <div class="user-role-card h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge-tag" :class="r.badge">{{ r.name }}</span>
                        <span class="badge bg-light text-dark border font-monospace">
                          {{ usersList.filter(u => u.roleKey === r.key).length }} Akun
                        </span>
                      </div>
                      <p class="text-muted small mb-0" style="font-size: 0.78rem; line-height: 1.35;">
                        {{ r.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sub Navigation for Users Tab -->
              <div class="d-flex gap-2 mb-3 border-bottom pb-2">
                <button class="btn btn-sm" :class="userSubTab === 'list' ? 'btn-primary' : 'btn-outline-secondary'" @click="userSubTab = 'list'">
                  <i class="bi bi-people-fill me-1"></i> Daftar Akun Pengguna ({{ usersList.length }})
                </button>
                <button class="btn btn-sm" :class="userSubTab === 'matrix' ? 'btn-primary' : 'btn-outline-secondary'" @click="userSubTab = 'matrix'">
                  <i class="bi bi-grid-3x3-gap-fill me-1"></i> Matriks Hak Akses (RBAC Matrix)
                </button>
                <button class="btn btn-sm" :class="userSubTab === 'security' ? 'btn-primary' : 'btn-outline-secondary'" @click="userSubTab = 'security'">
                  <i class="bi bi-key-fill me-1"></i> Kebijakan Akses Masuk & Keamanan
                </button>
              </div>

              <!-- SUBTAB 1: DAFTAR AKUN PENGGUNA -->
              <div v-show="userSubTab === 'list'">
                <!-- Filter Bar -->
                <div class="row g-2 mb-3 align-items-center">
                  <div class="col-md-5">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text bg-white border-end-0">
                        <i class="bi bi-search text-muted"></i>
                      </span>
                      <input type="text" class="form-control border-start-0" v-model="userSearchKeyword"
                        placeholder="Cari nama, NIP, username, atau email..." />
                      <button v-if="userSearchKeyword" class="btn btn-outline-secondary border-start-0" @click="userSearchKeyword = ''">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <select class="form-select form-select-sm" v-model="userRoleFilter">
                      <option value="">-- Semua Role Wewenang --</option>
                      <option v-for="r in userRoles" :key="r.key" :value="r.key">{{ r.name }}</option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <select class="form-select form-select-sm" v-model="userStatusFilter">
                      <option value="">-- Semua Status --</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Terkunci">Terkunci / Nonaktif</option>
                    </select>
                  </div>
                  <div class="col-md-2 text-end text-muted small">
                    Total: <strong class="text-dark">{{ filteredUsersList.length }}</strong> pengguna
                  </div>
                </div>

                <!-- Users Table -->
                <div class="table-responsive border rounded bg-white shadow-sm">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="table-light text-secondary small text-uppercase">
                      <tr>
                        <th style="width: 50px;" class="text-center">No</th>
                        <th>Pengguna & NIP</th>
                        <th>Kredensial Akun</th>
                        <th>Unit Kerja / Satuan Kerja</th>
                        <th>Role & Hak Akses</th>
                        <th class="text-center" style="width: 110px;">Status</th>
                        <th style="width: 140px;">Terakhir Masuk</th>
                        <th class="text-center" style="width: 180px;">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="small">
                      <tr v-if="filteredUsersList.length === 0">
                        <td colspan="8" class="text-center py-4 text-muted">
                          <i class="bi bi-person-x fs-3 d-block mb-1 text-secondary"></i>
                          Tidak ditemukan akun pengguna yang sesuai kriteria pencarian.
                        </td>
                      </tr>
                      <tr v-for="(u, idx) in filteredUsersList" :key="u.id" :class="{'table-primary-subtle': currentUser.email === u.email}">
                        <td class="text-center font-monospace text-muted">{{ idx + 1 }}</td>
                        <td>
                          <div class="d-flex align-items-center gap-2">
                            <div class="user-avatar-circle" style="width: 36px; height: 36px; font-size: 0.95rem;">
                              <span>{{ (u.namaLengkap || 'U').charAt(0).toUpperCase() }}</span>
                            </div>
                            <div>
                              <div class="fw-bold text-dark d-flex align-items-center gap-1">
                                {{ u.namaLengkap }}
                                <span v-if="currentUser.email === u.email" class="badge bg-primary text-white" style="font-size: 0.65rem;">
                                  Sesi Aktif
                                </span>
                              </div>
                              <div class="text-muted font-monospace" style="font-size: 0.75rem;">
                                NIP: {{ u.nip || '-' }}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="fw-semibold text-dark font-monospace">@{{ u.username }}</div>
                          <div class="text-muted small">{{ u.email }}</div>
                        </td>
                        <td>
                          <div class="text-dark small" style="max-width: 220px;">
                            {{ u.satker || 'Unit Manajemen Keuangan KPw BI Jember' }}
                          </div>
                        </td>
                        <td>
                          <span class="badge-tag" :class="getRoleBadgeClass(u.roleKey)">
                            {{ u.roleName || u.roleKey }}
                          </span>
                        </td>
                        <td class="text-center">
                          <span class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                            :class="u.status === 'Aktif' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                            style="font-size: 0.75rem; font-weight: 600;">
                            <span class="status-dot" :class="u.status === 'Aktif' ? 'active' : 'inactive'"></span>
                            {{ u.status }}
                          </span>
                        </td>
                        <td class="text-muted small">
                          {{ u.lastLogin || '-' }}
                        </td>
                        <td class="text-center">
                          <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" @click="switchUser(u)" title="Gunakan Akun Ini untuk Sesi Aplikasi">
                              <i class="bi bi-box-arrow-in-right"></i>
                            </button>
                            <button class="btn btn-outline-secondary" @click="editUser(u)" title="Edit Profil Pengguna">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-warning" @click="openResetPasswordModal(u)" title="Reset Password / Kunci Masuk">
                              <i class="bi bi-key"></i>
                            </button>
                            <button class="btn btn-outline-secondary" @click="toggleUserStatus(u)"
                              :title="u.status === 'Aktif' ? 'Kunci Akses Masuk' : 'Buka Kunci Akses'">
                              <i class="bi" :class="u.status === 'Aktif' ? 'bi-lock-fill text-danger' : 'bi-unlock-fill text-success'"></i>
                            </button>
                            <button class="btn btn-outline-danger" @click="openDeleteUserModal(u)" title="Hapus Pengguna">
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="mt-3 p-3 bg-light rounded border d-flex justify-content-between align-items-center flex-wrap gap-2 text-muted small">
                  <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-info-circle text-primary fs-5"></i>
                    <span>Klik tombol <i class="bi bi-box-arrow-in-right text-primary fw-bold"></i> pada pengguna untuk beralih sesi peran (Maker / Checker / Approver / Auditor) secara langsung pada aplikasi.</span>
                  </div>
                </div>
              </div>

              <!-- SUBTAB 2: MATRIKS HAK AKSES (RBAC MATRIX) -->
              <div v-show="userSubTab === 'matrix'">
                <!-- Bank Indonesia Governance Notice -->
                <div class="alert alert-info py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <i class="bi bi-shield-check fs-5 text-primary"></i>
                  <div>
                    <strong>Prinsip Tata Kelola Pengendalian Internal Bank Indonesia (Four-Eyes Principle / Maker-Checker-Approver):</strong>
                    Pemisahan fungsi pencatat transaksi (Maker), verifikator keabsahan (Checker), dan pejabat pengesah (Approver) untuk menjamin akuntabilitas serta integritas transaksi keuangan Bank Indonesia.
                  </div>
                </div>

                <!-- Active Role Notification & Simulation Banner -->
                <div class="p-3 mb-3 bg-light border rounded d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div class="d-flex align-items-center gap-2">
                    <span class="text-muted small">Peran Aktif Sesi Anda:</span>
                    <span class="badge-tag" :class="getRoleBadgeClass(currentUser.roleKey)">{{ currentUser.role || currentUser.roleKey }}</span>
                    <span class="text-muted small ms-2 d-none d-md-inline">• Kolom peran aktif Anda disorot otomatis pada tabel di bawah.</span>
                  </div>
                  <div class="d-flex align-items-center gap-1">
                    <span class="text-muted small me-1">Uji Coba Peran:</span>
                    <button v-for="r in userRoles" :key="r.key"
                      class="btn btn-xs px-2 py-1"
                      :class="currentUser.roleKey === r.key ? 'btn-primary' : 'btn-outline-secondary'"
                      style="font-size: 0.72rem;"
                      @click="switchTestRole(r.key)"
                      :title="'Uji aplikasi sebagai peran ' + r.name">
                      {{ r.key === 'super_admin' ? 'Admin' : r.key.charAt(0).toUpperCase() + r.key.slice(1) }}
                    </button>
                  </div>
                </div>

                <!-- Matrix Control Toolbar -->
                <div class="p-3 mb-3 bg-white border rounded shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 480px;">
                    <div class="input-group input-group-sm">
                      <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                      <input type="text" class="form-control border-start-0" v-model="matrixSearchKeyword"
                        placeholder="Cari modul, fungsi wewenang, atau kode..." />
                      <button v-if="matrixSearchKeyword" class="btn btn-outline-secondary border-start-0" @click="matrixSearchKeyword = ''">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                    <span v-if="isMatrixDirty" class="badge bg-warning text-dark border d-flex align-items-center gap-1 py-2 px-2" style="font-size: 0.72rem;">
                      <i class="bi bi-exclamation-triangle-fill text-danger"></i> Belum Disimpan
                    </span>
                  </div>
                  <div class="d-flex gap-2 align-items-center">
                    <button class="btn btn-sm btn-outline-secondary" @click="resetRbacMatrixToDefault" title="Kembalikan ke standar default Four-Eyes Principle Bank Indonesia">
                      <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Standar BI
                    </button>
                    <button class="btn btn-sm btn-outline-teal" @click="exportRbacMatrixCSV" title="Unduh Matriks Hak Akses (CSV)">
                      <i class="bi bi-file-earmark-spreadsheet me-1"></i> Ekspor CSV
                    </button>
                    <button class="btn btn-sm btn-primary" :class="{ 'btn-success': !isMatrixDirty }" @click="saveRbacMatrix" title="Simpan konfigurasi matriks wewenang">
                      <i class="bi bi-check2-circle me-1"></i> Simpan Matriks Hak Akses
                    </button>
                  </div>
                </div>

                <!-- Matrix Table -->
                <div class="table-responsive border rounded bg-white shadow-sm mb-3">
                  <table class="table table-bordered align-middle mb-0 matrix-table">
                    <thead class="table-light text-center">
                      <tr>
                        <th class="text-start" style="width: 270px;">Modul & Fungsi Wewenang</th>
                        <th style="width: 135px;" :class="{ 'matrix-col-active': currentUser.roleKey === 'super_admin' }">
                          <span class="badge-tag tag-rose">Super Admin</span>
                          <div class="d-flex justify-content-center gap-1 mt-1">
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('super_admin', 'allow_all')" title="Izinkan semua wewenang Super Admin" style="font-size: 0.65rem;">Semua</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('super_admin', 'reset_default')" title="Reset ke default" style="font-size: 0.65rem;">Default</button>
                          </div>
                        </th>
                        <th style="width: 135px;" :class="{ 'matrix-col-active': currentUser.roleKey === 'maker' }">
                          <span class="badge-tag tag-navy">Maker</span>
                          <div class="text-muted" style="font-size: 0.65rem;">Operator</div>
                          <div class="d-flex justify-content-center gap-1 mt-1">
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('maker', 'allow_all')" title="Izinkan semua" style="font-size: 0.65rem;">Semua</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('maker', 'deny_all')" title="Kunci semua" style="font-size: 0.65rem;">Kunci</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('maker', 'reset_default')" title="Reset default" style="font-size: 0.65rem;">Default</button>
                          </div>
                        </th>
                        <th style="width: 135px;" :class="{ 'matrix-col-active': currentUser.roleKey === 'checker' }">
                          <span class="badge-tag tag-amber">Checker</span>
                          <div class="text-muted" style="font-size: 0.65rem;">Verifikator</div>
                          <div class="d-flex justify-content-center gap-1 mt-1">
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('checker', 'allow_all')" title="Izinkan semua" style="font-size: 0.65rem;">Semua</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('checker', 'deny_all')" title="Kunci semua" style="font-size: 0.65rem;">Kunci</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('checker', 'reset_default')" title="Reset default" style="font-size: 0.65rem;">Default</button>
                          </div>
                        </th>
                        <th style="width: 135px;" :class="{ 'matrix-col-active': currentUser.roleKey === 'approver' }">
                          <span class="badge-tag tag-emerald">Approver</span>
                          <div class="text-muted" style="font-size: 0.65rem;">Penyetuju</div>
                          <div class="d-flex justify-content-center gap-1 mt-1">
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('approver', 'allow_all')" title="Izinkan semua" style="font-size: 0.65rem;">Semua</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('approver', 'deny_all')" title="Kunci semua" style="font-size: 0.65rem;">Kunci</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('approver', 'reset_default')" title="Reset default" style="font-size: 0.65rem;">Default</button>
                          </div>
                        </th>
                        <th style="width: 135px;" :class="{ 'matrix-col-active': currentUser.roleKey === 'auditor' }">
                          <span class="badge-tag tag-indigo">Auditor</span>
                          <div class="text-muted" style="font-size: 0.65rem;">Pengawas</div>
                          <div class="d-flex justify-content-center gap-1 mt-1">
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('auditor', 'allow_all')" title="Izinkan semua" style="font-size: 0.65rem;">Semua</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('auditor', 'deny_all')" title="Kunci semua" style="font-size: 0.65rem;">Kunci</button>
                            <span class="text-muted" style="font-size: 0.65rem;">|</span>
                            <button class="btn btn-link btn-xs p-0 text-muted" @click="bulkSetRolePermissions('auditor', 'reset_default')" title="Reset default" style="font-size: 0.65rem;">Default</button>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="small">
                      <tr v-if="filteredRbacMatrixItems.length === 0">
                        <td colspan="6" class="text-center py-4 text-muted">
                          <i class="bi bi-search fs-4 d-block mb-1 text-secondary"></i>
                          Tidak ada fungsi wewenang yang cocok dengan "{{ matrixSearchKeyword }}".
                        </td>
                      </tr>
                      <tr v-for="item in filteredRbacMatrixItems" :key="item.code">
                        <td>
                          <div class="fw-semibold text-dark">{{ item.name }}</div>
                          <div class="text-muted" style="font-size: 0.72rem;">{{ item.description }}</div>
                          <div class="mt-1 font-monospace text-primary" style="font-size: 0.65rem;">
                            Kode: <code>{{ item.code }}</code>
                          </div>
                        </td>
                        <td class="text-center" :class="{ 'matrix-col-active': currentUser.roleKey === 'super_admin' }">
                          <button type="button" class="matrix-toggle-btn"
                            :class="item.roles.includes('super_admin') ? 'matrix-badge-allowed' : 'matrix-badge-denied'"
                            @click="toggleRolePermission(item, 'super_admin')"
                            :title="'Klik untuk ' + (item.roles.includes('super_admin') ? 'mengunci' : 'mengizinkan') + ' wewenang Super Admin'">
                            <i class="bi" :class="item.roles.includes('super_admin') ? 'bi-check-circle-fill text-success' : 'bi-dash-circle'"></i>
                            <span>{{ item.roles.includes('super_admin') ? 'Diizinkan' : 'Terkunci' }}</span>
                          </button>
                        </td>
                        <td class="text-center" :class="{ 'matrix-col-active': currentUser.roleKey === 'maker' }">
                          <button type="button" class="matrix-toggle-btn"
                            :class="item.roles.includes('maker') ? 'matrix-badge-allowed' : 'matrix-badge-denied'"
                            @click="toggleRolePermission(item, 'maker')"
                            :title="'Klik untuk ' + (item.roles.includes('maker') ? 'mengunci' : 'mengizinkan') + ' wewenang Maker'">
                            <i class="bi" :class="item.roles.includes('maker') ? 'bi-check-circle-fill text-success' : 'bi-dash-circle'"></i>
                            <span>{{ item.roles.includes('maker') ? 'Diizinkan' : 'Terkunci' }}</span>
                          </button>
                        </td>
                        <td class="text-center" :class="{ 'matrix-col-active': currentUser.roleKey === 'checker' }">
                          <button type="button" class="matrix-toggle-btn"
                            :class="item.roles.includes('checker') ? 'matrix-badge-allowed' : 'matrix-badge-denied'"
                            @click="toggleRolePermission(item, 'checker')"
                            :title="'Klik untuk ' + (item.roles.includes('checker') ? 'mengunci' : 'mengizinkan') + ' wewenang Checker'">
                            <i class="bi" :class="item.roles.includes('checker') ? 'bi-check-circle-fill text-success' : 'bi-dash-circle'"></i>
                            <span>{{ item.roles.includes('checker') ? 'Diizinkan' : 'Terkunci' }}</span>
                          </button>
                        </td>
                        <td class="text-center" :class="{ 'matrix-col-active': currentUser.roleKey === 'approver' }">
                          <button type="button" class="matrix-toggle-btn"
                            :class="item.roles.includes('approver') ? 'matrix-badge-allowed' : 'matrix-badge-denied'"
                            @click="toggleRolePermission(item, 'approver')"
                            :title="'Klik untuk ' + (item.roles.includes('approver') ? 'mengunci' : 'mengizinkan') + ' wewenang Approver'">
                            <i class="bi" :class="item.roles.includes('approver') ? 'bi-check-circle-fill text-success' : 'bi-dash-circle'"></i>
                            <span>{{ item.roles.includes('approver') ? 'Diizinkan' : 'Terkunci' }}</span>
                          </button>
                        </td>
                        <td class="text-center" :class="{ 'matrix-col-active': currentUser.roleKey === 'auditor' }">
                          <button type="button" class="matrix-toggle-btn"
                            :class="item.roles.includes('auditor') ? 'matrix-badge-allowed' : 'matrix-badge-denied'"
                            @click="toggleRolePermission(item, 'auditor')"
                            :title="'Klik untuk ' + (item.roles.includes('auditor') ? 'mengunci' : 'mengizinkan') + ' wewenang Auditor'">
                            <i class="bi" :class="item.roles.includes('auditor') ? 'bi-check-circle-fill text-success' : 'bi-dash-circle'"></i>
                            <span>{{ item.roles.includes('auditor') ? 'Diizinkan' : 'Terkunci' }}</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Footer Explanation Card -->
                <div class="p-3 bg-light rounded border d-flex justify-content-between align-items-center flex-wrap gap-2 text-muted small">
                  <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-info-circle text-primary fs-5"></i>
                    <span>
                      <strong>Panduan Pengelolaan:</strong> Klik langsung pada tombol status <code>Diizinkan</code> / <code>Terkunci</code> untuk mengubah hak akses peran. Setelah selesai melakukan penyesuaian, klik tombol <strong>"Simpan Matriks Hak Akses"</strong> untuk menerapkan kebijakan RBAC ke seluruh sistem.
                    </span>
                  </div>
                </div>
              </div>

              <!-- SUBTAB 3: KEBIJAKAN AKSES MASUK & KEAMANAN -->
              <div v-show="userSubTab === 'security'">
                <div class="row g-4">
                  <div class="col-lg-6">
                    <div class="p-4 border rounded bg-white shadow-sm h-100">
                      <h5 class="fw-bold mb-3 text-dark border-bottom pb-2">
                        <i class="bi bi-shield-shaded text-primary me-2"></i>Metode Autentikasi Masuk Aplikasi
                      </h5>

                      <div class="mb-3">
                        <label class="form-label fw-semibold small mb-2">Provider Autentikasi Utama</label>
                        <div class="d-flex flex-column gap-2">
                          <div class="form-check p-2 border rounded" :class="{'border-primary bg-primary-subtle': securityPolicy.authProvider === 'local'}">
                            <input class="form-check-input ms-0 me-2" type="radio" id="authLocal" value="local" v-model="securityPolicy.authProvider">
                            <label class="form-check-label fw-semibold text-dark small" for="authLocal">
                              Autentikasi Internal Database (Username & Sandi Lokal)
                            </label>
                            <div class="text-muted small ps-4">
                              Kredensial disimpan terenkripsi di server database MySQL ERP BI dengan verifikasi hash.
                            </div>
                          </div>

                          <div class="form-check p-2 border rounded" :class="{'border-primary bg-primary-subtle': securityPolicy.authProvider === 'sso'}">
                            <input class="form-check-input ms-0 me-2" type="radio" id="authSSO" value="sso" v-model="securityPolicy.authProvider">
                            <label class="form-check-label fw-semibold text-dark small" for="authSSO">
                              Single Sign-On Bank Indonesia (SSO BI / LDAP / Active Directory)
                            </label>
                            <div class="text-muted small ps-4">
                              Login terpusat menggunakan NIP dan akun resmi jaringan intranet Bank Indonesia.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label fw-semibold small mb-1">Durasi Sesi Aktif (Timeout)</label>
                          <select class="form-select form-select-sm" v-model="securityPolicy.sessionTimeoutMinutes">
                            <option value="15">15 Menit (Sangat Ketat)</option>
                            <option value="30">30 Menit (Standar Keamanan)</option>
                            <option value="60">60 Menit (1 Jam)</option>
                            <option value="120">120 Menit (2 Jam)</option>
                            <option value="480">480 Menit (1 Hari Kerja Penuh)</option>
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold small mb-1">Batas Percobaan Gagal (Lockout)</label>
                          <select class="form-select form-select-sm" v-model="securityPolicy.maxFailedAttempts">
                            <option value="3">3 Kali Percobaan</option>
                            <option value="5">5 Kali Percobaan</option>
                            <option value="10">10 Kali Percobaan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <div class="p-4 border rounded bg-white shadow-sm h-100">
                      <h5 class="fw-bold mb-3 text-dark border-bottom pb-2">
                        <i class="bi bi-lock-fill text-primary me-2"></i>Standar Kekuatan Kata Sandi & Akses
                      </h5>

                      <div class="d-flex flex-column gap-3 mb-4">
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="polMinLen" v-model="securityPolicy.requireMinLength">
                          <label class="form-check-label small fw-semibold" for="polMinLen">
                            Wajibkan panjang sandi minimal 8 karakter
                          </label>
                        </div>

                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="polAlphaNum" v-model="securityPolicy.requireAlphaNumeric">
                          <label class="form-check-label small fw-semibold" for="polAlphaNum">
                            Wajibkan kombinasi huruf, angka, dan karakter khusus (!@#$)
                          </label>
                        </div>

                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="polExpire" v-model="securityPolicy.forcePasswordChange90Days">
                          <label class="form-check-label small fw-semibold" for="polExpire">
                            Masa kedaluwarsa kata sandi berkala (Setiap 90 hari)
                          </label>
                        </div>

                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="polAudit" v-model="securityPolicy.logLoginAttempts">
                          <label class="form-check-label small fw-semibold" for="polAudit">
                            Rekam jejak audit masuk (IP address, waktu, & device fingerprint)
                          </label>
                        </div>
                      </div>

                      <div class="d-flex justify-content-end">
                        <button class="btn-erp btn-erp-primary" @click="saveSecurityPolicy">
                          <i class="bi bi-check-lg me-1"></i> Simpan Kebijakan Keamanan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Tab 2: Koneksi Database & Server -->
            <div class="p-4" v-show="settingTab === 'database' && hasPermission('system_settings')">
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="p-4 border rounded bg-white shadow-sm h-100">
                    <h5 class="fw-bold mb-3 text-dark border-bottom pb-2">
                      <i class="bi bi-hdd-network text-primary me-2"></i>Status Layanan Backend & Database
                    </h5>
                    <div class="d-flex flex-column gap-3">
                      <div class="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                        <div>
                          <div class="fw-semibold text-dark small">REST API Express Server</div>
                          <div class="text-muted small">http://localhost:5000</div>
                        </div>
                        <span class="badge-tag" :class="isOnline ? 'tag-emerald' : 'tag-secondary'">
                          <i class="bi" :class="isOnline ? 'bi-check-circle-fill' : 'bi-x-circle'"></i>
                          {{ isOnline ? 'Online / Aktif' : 'Offline' }}
                        </span>
                      </div>

                      <div class="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                        <div>
                          <div class="fw-semibold text-dark small">Database Host MySQL</div>
                          <div class="text-muted small font-monospace">127.0.0.1:3306</div>
                        </div>
                        <span class="badge-tag tag-navy font-monospace">Port 3306</span>
                      </div>

                      <div class="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                        <div>
                          <div class="fw-semibold text-dark small">Database Aktif</div>
                          <div class="text-muted small font-monospace">form_batch_erp</div>
                        </div>
                        <span class="badge-tag tag-emerald">Connected</span>
                      </div>
                    </div>

                    <div class="mt-4 pt-3 border-top d-flex gap-2">
                      <button class="btn-erp btn-erp-primary w-100" @click="testServerConnection">
                        <i class="bi bi-arrow-repeat me-1"></i> Uji Ulang Koneksi Server
                      </button>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="p-4 border rounded bg-white shadow-sm h-100">
                    <h5 class="fw-bold mb-3 text-dark border-bottom pb-2">
                      <i class="bi bi-table text-primary me-2"></i>Status Sinkronisasi Tabel Master
                    </h5>
                    <div class="d-flex flex-column gap-2">
                      <div class="d-flex justify-content-between align-items-center p-2 border rounded">
                        <div>
                          <span class="fw-semibold text-dark small">Tabel Pejabat (Data Pegawai)</span>
                          <div class="text-muted small font-monospace">tabel: pejabat</div>
                        </div>
                        <span class="badge-tag tag-emerald">{{ pegawaiList.length }} Pegawai</span>
                      </div>

                      <div class="d-flex justify-content-between align-items-center p-2 border rounded">
                        <div>
                          <span class="fw-semibold text-dark small">Tabel Bank (Data Bank)</span>
                          <div class="text-muted small font-monospace">tabel: bank</div>
                        </div>
                        <span class="badge-tag tag-emerald">{{ masterBankList.length }} Bank</span>
                      </div>

                      <div class="d-flex justify-content-between align-items-center p-2 border rounded">
                        <div>
                          <span class="fw-semibold text-dark small">Tabel DHA (Himpunan Anggaran)</span>
                          <div class="text-muted small font-monospace">tabel: master_dha</div>
                        </div>
                        <span class="badge-tag tag-emerald">{{ dhaList.length }} Pos DHA</span>
                      </div>

                      <div class="d-flex justify-content-between align-items-center p-2 border rounded">
                        <div>
                          <span class="fw-semibold text-dark small">Tabel Rekanan (Vendor Penyedia)</span>
                          <div class="text-muted small font-monospace">tabel: master_rekanan</div>
                        </div>
                        <span class="badge-tag tag-emerald">{{ rekananPresets.length }} Rekanan</span>
                      </div>
                    </div>

                    <div class="mt-3 pt-2">
                      <button class="btn-erp btn-erp-secondary w-100" @click="refreshAllMasters">
                        <i class="bi bi-arrow-clockwise me-1"></i> Muat Ulang Semua Master Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Tab 3: Parameter Transaksi -->
            <div class="p-4" v-show="settingTab === 'transaksi' && hasPermission('system_settings')">
              <div class="p-4 border rounded bg-white shadow-sm">
                <h5 class="fw-bold mb-3 text-dark border-bottom pb-2">
                  <i class="bi bi-sliders text-primary me-2"></i>Konfigurasi Aturan & Formulir Transaksi
                </h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold small mb-1">Prefix Penomoran No. Batch Default</label>
                    <input type="text" class="form-control form-control-sm font-monospace" v-model="appSettings.prefixBatch" placeholder="Contoh: JR25 0" />
                    <div class="text-muted small mt-1">Digunakan untuk penomoran otomatis batch baru (misal: JR25 01476)</div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-semibold small mb-1">Ambang Batas Bea Meterai (Rp)</label>
                    <input type="text" class="form-control form-control-sm font-monospace" value="Rp 5.000.000" disabled />
                    <div class="text-muted small mt-1">Sesuai UU Bea Meterai No. 10 Tahun 2020 untuk kuitansi di atas Rp 5 juta</div>
                  </div>

                  <div class="col-12">
                    <label class="form-label fw-semibold small mb-1">Kop Surat Slip SPP Resmi</label>
                    <input type="text" class="form-control form-control-sm" v-model="appSettings.printHeaderBi" />
                  </div>

                  <div class="col-12">
                    <label class="form-label fw-semibold small mb-1">Alamat Kantor pada Dokumen Cetak</label>
                    <input type="text" class="form-control form-control-sm" v-model="appSettings.printAlamat" />
                  </div>

                  <div class="col-12 mt-3">
                    <div class="form-check form-switch mb-2">
                      <input class="form-check-input" type="checkbox" id="checkCoa" v-model="appSettings.autoBalanceCoa" />
                      <label class="form-check-label small fw-semibold" for="checkCoa">
                        Wajibkan Keseimbangan Total Nominal Tagihan dengan Alokasi Rangkaian COA
                      </label>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="checkDuplicate" v-model="appSettings.checkDuplicateDoc" />
                      <label class="form-check-label small fw-semibold" for="checkDuplicate">
                        Aktifkan Deteksi Dini Duplikasi Nomor Dokumen Transaksi
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Tab: Pengaturan Cetak (Huruf, Margin, Kertas, Orientasi) -->
            <div class="p-4" v-show="settingTab === 'cetak'">
              <div class="p-4 border rounded bg-white shadow-sm">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom flex-wrap gap-2">
                  <div>
                    <h5 class="fw-bold mb-1 text-dark">
                      <i class="bi bi-printer text-primary me-2"></i>Konfigurasi Tipografi & Tata Letak Cetak
                    </h5>
                    <p class="text-muted small mb-0">Atur jenis huruf standar atau Frutiger45 ligth, ukuran kertas, orientasi, dan margin cetak lembar disposisi BI ERP</p>
                  </div>
                  <div class="d-flex gap-2">
                    <button class="btn-erp btn-erp-secondary" @click="resetPrintSettings">
                      <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Standar
                    </button>
                    <button class="btn-erp btn-erp-primary" @click="savePrintSettings">
                      <i class="bi bi-check-lg me-1"></i> Simpan Pengaturan Cetak
                    </button>
                    <button class="btn-erp btn-erp-teal" @click="previewPrintDocument">
                      <i class="bi bi-eye me-1"></i> Preview
                    </button>
                  </div>
                </div>

                <!-- 1. PILIHAN JENIS HURUF & UKURAN -->
                <div class="p-3 mb-4 border rounded bg-light">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <label class="form-label fw-bold text-dark small mb-0">
                      <i class="bi bi-fonts text-primary me-1"></i> Jenis & Ukuran Huruf (Font) Hasil Cetakan
                    </label>
                    <span class="badge bg-primary text-white" style="font-size: 0.72rem;">Sesuai Standar Bank Indonesia</span>
                  </div>

                  <!-- Listbox Kompak Sejajar (Disesuaikan/Diperkecil) -->
                  <div class="d-flex align-items-end gap-2 flex-wrap">
                    <div style="width: 220px; max-width: 100%;">
                      <label class="form-label small text-muted mb-1 fw-semibold d-block">Jenis Huruf (Font Family):</label>
                      <select class="form-select form-select-sm shadow-sm" v-model="printSettings.fontFamily" @change="applyPrintSettingsToDOM()">
                        <option value="TimesNRCyrMT">TimesNRCyrMT</option>
                        <option value="Frutiger45 ligth">Frutiger45 ligth</option>
                        <option value="Arial">Arial</option>
                        <option value="sans-serif">sans-serif</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier new">Courier new</option>
                      </select>
                    </div>
                    <div style="width: 85px;">
                      <label class="form-label small text-muted mb-1 fw-semibold d-block text-center">Ukuran:</label>
                      <select class="form-select form-select-sm shadow-sm text-center" v-model.number="printSettings.fontSize" @change="applyPrintSettingsToDOM()">
                        <option :value="8">8</option>
                        <option :value="8.5">8.5</option>
                        <option :value="9">9</option>
                        <option :value="9.5">9.5</option>
                        <option :value="10">10</option>
                        <option :value="10.5">10.5</option>
                        <option :value="11">11</option>
                        <option :value="12">12</option>
                        <option :value="14">14</option>
                        <option :value="16">16</option>
                        <option :value="18">18</option>
                        <option :value="20">20</option>
                      </select>
                    </div>
                  </div>

                  <!-- Live sample box -->
                  <div class="mt-3 p-2 border rounded bg-white d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span :style="{ fontFamily: getFontFamilyCss(printSettings.fontFamily), fontSize: `${printSettings.fontSize || 11}pt` }" class="text-dark">
                      BANK INDONESIA • No. 310/UN25.1.4 • Rp 6.000.000
                    </span>
                    <span class="badge bg-light text-secondary border font-monospace" style="font-size: 0.72rem;">
                      {{ printSettings.fontFamily }} • {{ printSettings.fontSize || 11 }} pt
                    </span>
                  </div>
                </div>

                <!-- 2. UKURAN KERTAS & ORIENTASI -->
                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark small mb-2">
                        <i class="bi bi-file-earmark-ruled text-primary me-1"></i> Ukuran Kertas Default
                      </label>
                      <select class="form-select form-select-sm" v-model="printSettings.paperSize" @change="applyPrintSettingsToDOM()">
                        <option value="A4">A4 (210 × 297 mm) — Standar BI</option>
                        <option value="F4">F4 / Folio (215 × 330 mm)</option>
                        <option value="Letter">Letter (215.9 × 279.4 mm)</option>
                        <option value="Legal">Legal (215.9 × 355.6 mm)</option>
                        <option value="A5">A5 (148 × 210 mm)</option>
                      </select>
                      <small class="text-muted d-block mt-2">Ukuran kertas yang dikirimkan ke dialog cetak browser (A4 disarankan untuk Lembar Disposisi 2 Halaman).</small>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark small mb-2">
                        <i class="bi bi-compass text-primary me-1"></i> Orientasi Halaman
                      </label>
                      <div class="d-flex gap-2">
                        <button type="button" class="print-orientation-btn" :class="{ active: printSettings.orientation === 'portrait' }" @click="printSettings.orientation = 'portrait'; applyPrintSettingsToDOM();">
                          <i class="bi bi-file-earmark fs-4 d-block mb-1 text-primary"></i>
                          <strong>Portrait</strong>
                          <div class="text-muted small">Tegak (Standar Disposisi)</div>
                        </button>
                        <button type="button" class="print-orientation-btn" :class="{ active: printSettings.orientation === 'landscape' }" @click="printSettings.orientation = 'landscape'; applyPrintSettingsToDOM();">
                          <i class="bi bi-file-earmark-landscape fs-4 d-block mb-1 text-primary"></i>
                          <strong>Landscape</strong>
                          <div class="text-muted small">Mendatar</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 3. MARGIN KERTAS -->
                <div class="p-3 mb-4 border rounded bg-light">
                  <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <label class="form-label fw-bold text-dark small mb-0">
                      <i class="bi bi-arrows-angle-expand text-primary me-1"></i> Pengaturan Margin Dokumen (Centimeter)
                    </label>
                    <div class="btn-group btn-group-sm">
                      <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'standar' ? 'btn-primary' : 'btn-outline-secondary'" @click="applyMarginPreset('standar')">
                        Standar BI (1.2 / 1.4 cm)
                      </button>
                      <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'sempit' ? 'btn-primary' : 'btn-outline-secondary'" @click="applyMarginPreset('sempit')">
                        Sempit (0.8 cm)
                      </button>
                      <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'sedang' ? 'btn-primary' : 'btn-outline-secondary'" @click="applyMarginPreset('sedang')">
                        Lebar (1.8 / 2.0 cm)
                      </button>
                      <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'custom' ? 'btn-primary' : 'btn-outline-secondary'" @click="printSettings.marginPreset = 'custom'">
                        Kustom
                      </button>
                    </div>
                  </div>

                  <div class="row g-3">
                    <div class="col-6 col-md-3">
                      <label class="form-label small mb-1 fw-semibold">Margin Atas (Top)</label>
                      <div class="input-group input-group-sm">
                        <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginTop" @input="onCustomMarginChange" />
                        <span class="input-group-text">cm</span>
                      </div>
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label small mb-1 fw-semibold">Margin Kanan (Right)</label>
                      <div class="input-group input-group-sm">
                        <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginRight" @input="onCustomMarginChange" />
                        <span class="input-group-text">cm</span>
                      </div>
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label small mb-1 fw-semibold">Margin Bawah (Bottom)</label>
                      <div class="input-group input-group-sm">
                        <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginBottom" @input="onCustomMarginChange" />
                        <span class="input-group-text">cm</span>
                      </div>
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label small mb-1 fw-semibold">Margin Kiri (Left)</label>
                      <div class="input-group input-group-sm">
                        <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginLeft" @input="onCustomMarginChange" />
                        <span class="input-group-text">cm</span>
                      </div>
                    </div>
                  </div>
                </div>



              </div>
            </div>

          </div>
        </div>

        <!-- ================================================================
             VIEW 2: FORMULIR INPUT BATCH
             ================================================================ -->
        <div v-show="currentView === 'form' && canAccessView('form')" class="content-container no-print">
          <!-- Form Header Status Pill -->
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 mx-auto" style="max-width: 1120px;">
            <div class="d-flex align-items-center gap-2">
              <span class="badge-tag tag-navy fs-6 py-1 px-3">
                <i class="bi bi-pencil-square me-1"></i> Formulir Batch Transaksi
              </span>
              <span class="badge-tag tag-emerald" v-if="isCoaBalanced">
                <i class="bi bi-check-circle-fill"></i> COA & Invoice Seimbang
              </span>
              <span class="badge-tag tag-rose" v-else>
                <i class="bi bi-exclamation-triangle-fill"></i> Selisih COA: {{ formatCurrency(selisihCoa) }}
              </span>
            </div>

            <div class="text-muted small">
              Batch ID: <strong>{{ form.noBatch || 'DRAFT BARU' }}</strong> • Dokumen: <strong>{{ form.noDokumen || '-' }}</strong>
            </div>
          </div>

          <!-- FORMULIR MODEL KE BAWAH (VERTICAL LAYOUT) -->
          <div class="form-vertical-layout">

              <!-- Card 1: Informasi Dokumen & Satker -->
              <div class="form-card">
                <div class="card-header-custom">
                  <h3 class="card-title-custom">
                    <div class="card-icon-badge navy"><i class="bi bi-file-earmark-text"></i></div>
                    1. Informasi Dokumen & Satker
                  </h3>
                  <span class="badge-tag tag-navy">{{ form.noBatch || 'DRAFT BARU' }}</span>
                </div>

                <div class="field-grid-3">
                  <div class="field-group">
                    <label class="field-label" for="noDokumen">
                      No Dokumen <span class="required-star">*</span>
                    </label>
                    <input id="noDokumen" type="text" class="input-control" v-model="form.noDokumen"
                      @blur="checkDocUniqueness" placeholder="Contoh: 27/481/JR-FPP" required>
                    <small v-if="docDuplicateWarning" class="text-danger fw-semibold" style="font-size: 0.72rem;">
                      ⚠ {{ docDuplicateWarning }}
                    </small>
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="noBatch">No. Batch</label>
                    <input id="noBatch" type="text" class="input-control" v-model="form.noBatch"
                      placeholder="Contoh: JR25 01474">
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="tglTransaksi">
                      Tgl Transaksi <span class="required-star">*</span>
                    </label>
                    <div class="custom-date-wrapper">
                      <input id="tglTransaksi" type="text" class="input-control date-display-input"
                             :value="formatIsoToDmy(form.tglTransaksi)"
                             @input="handleDateTextInput($event, (v) => form.tglTransaksi = v)"
                             @blur="handleDateBlur($event, (v) => form.tglTransaksi = v, form.tglTransaksi)"
                             placeholder="dd/mm/yyyy" maxlength="10" required>
                      <input type="date" class="native-date-hidden-trigger" :value="form.tglTransaksi"
                             @input="form.tglTransaksi = $event.target.value"
                             @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                      <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                    </div>
                  </div>
                </div>

                <div class="field-grid-2">
                  <div class="field-group">
                    <label class="field-label" for="dariUker">
                      Dari Uker (Pengaju) <span class="required-star">*</span>
                    </label>
                    <select id="dariUker" class="select-control" v-model="form.dariUker">
                      <option value="">Pilih unit kerja pengaju</option>
                      <option v-for="u in unitKerjaOptions" :key="u.val" :value="u.val">{{ u.label }}</option>
                    </select>
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="kepadaUker">Kepada Uker (Tujuan)</label>
                    <select id="kepadaUker" class="select-control" v-model="form.kepadaUker">
                      <option value="">Pilih unit kerja tujuan</option>
                      <option v-for="u in unitKerjaOptions" :key="u.val" :value="u.val">{{ u.label }}</option>
                    </select>
                  </div>
                </div>

                <div class="field-group mb-0">
                  <label class="field-label" for="perihal">
                    Perihal Transaksi <span class="required-star">*</span>
                    <span class="text-muted fw-normal" style="font-size: 0.75rem;">(Maks. 300 karakter)</span>
                  </label>
                  <textarea id="perihal" class="textarea-control" rows="2" maxlength="300" v-model="form.perihal"
                    placeholder="Uraian perihal pembayaran atau belanja barang/jasa..."></textarea>
                </div>
              </div>

              <!-- Card 2: Data Rekanan & Wajib Pajak -->
              <div class="form-card">
                <div class="card-header-custom">
                  <h3 class="card-title-custom">
                    <div class="card-icon-badge amber"><i class="bi bi-building"></i></div>
                    2. Data Rekanan & Wajib Pajak
                  </h3>
                  <span class="badge-tag tag-amber">Penyedia / Vendor</span>
                </div>

                <div class="field-grid-2">
                  <div class="field-group">
                    <label class="field-label" for="namaRekanan">
                      Nama Rekanan <span class="required-star">*</span>
                    </label>
                    <input id="namaRekanan" type="text" list="presetRekananList" class="input-control"
                      v-model="form.namaRekanan" @change="onSelectRekanan(form.namaRekanan)"
                      placeholder="Ketik atau pilih rekanan...">
                    <datalist id="presetRekananList">
                      <option v-for="r in rekananPresets" :key="r.nama" :value="r.nama"></option>
                    </datalist>
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="nikNpwp">
                      NIK / NPWP <span class="required-star">*</span>
                    </label>
                    <input id="nikNpwp" type="text" class="input-control" v-model="form.nikNpwp"
                      placeholder="00.000.000.0-000.000">
                  </div>
                </div>

                <div class="field-grid-2">
                  <div class="field-group mb-0">
                    <label class="field-label" for="namaWpRekanan">Nama WP Rekanan</label>
                    <input id="namaWpRekanan" type="text" class="input-control" v-model="form.namaWpRekanan"
                      placeholder="Nama Wajib Pajak">
                  </div>

                  <div class="field-group mb-0">
                    <label class="field-label" for="alamatRekanan">Alamat Rekanan</label>
                    <input id="alamatRekanan" type="text" class="input-control" v-model="form.alamatRekanan"
                      placeholder="Alamat domisili rekanan">
                  </div>
                </div>
              </div>

              <!-- Card 3: Rekening Tujuan & Cara Pembayaran -->
              <div class="form-card">
                <div class="card-header-custom">
                  <h3 class="card-title-custom">
                    <div class="card-icon-badge teal"><i class="bi bi-credit-card-2-front"></i></div>
                    3. Rekening Tujuan & Cara Pembayaran
                  </h3>
                </div>

                <div class="field-grid-2">
                  <div class="field-group">
                    <label class="field-label" for="tipePembayaran">Tipe Pembayaran</label>
                    <select id="tipePembayaran" class="select-control" v-model="form.tipePembayaran" @change="onTipePembayaranChange">
                      <option v-for="t in tipePembayaranList" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="namaBank">Nama Bank Tujuan</label>
                    <select id="namaBank" class="select-control" v-model="form.namaBank" :disabled="isTunai">
                      <option value="">{{ isTunai ? 'Tidak diperlukan (Tunai)' : 'Pilih bank' }}</option>
                      <option v-for="b in bankList" :key="b" :value="b">{{ b }}</option>
                    </select>
                  </div>
                </div>

                <div class="field-grid-2">
                  <div class="field-group">
                    <label class="field-label" for="namaRekening">Nama Pemilik Rekening</label>
                    <input id="namaRekening" type="text" class="input-control" v-model="form.namaRekening"
                      :disabled="isTunai"
                      :placeholder="isTunai ? 'Tidak diperlukan (Tunai)' : 'Nama sesuai buku tabungan'">
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="nomorRekening">
                      Nomor Rekening Tujuan
                      <span class="text-muted fw-normal" style="font-size: 0.72rem;">(String teks)</span>
                    </label>
                    <input id="nomorRekening" type="text" class="input-control" v-model="form.nomorRekening"
                      :disabled="isTunai"
                      :placeholder="isTunai ? 'Tidak diperlukan (Tunai)' : 'Nomor rekening'">
                  </div>
                </div>

                <div class="field-grid-2">
                  <div class="field-group mb-0">
                    <label class="field-label" for="bebanAnggaranUker">Beban Anggaran Uker / Satker</label>
                    <select id="bebanAnggaranUker" class="select-control" v-model="form.bebanAnggaranUker">
                      <option value="">Pilih unit beban anggaran</option>
                      <option v-for="u in unitKerjaOptions" :key="u.val" :value="u.val">{{ u.label }}</option>
                    </select>
                  </div>

                  <div class="field-group mb-0">
                    <label class="field-label" for="jenisInvoice">Jenis Invoice</label>
                    <select id="jenisInvoice" class="select-control" v-model="form.jenisInvoice">
                      <option v-for="ji in jenisInvoiceList" :key="ji" :value="ji">{{ ji }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Card 4: Pengelolaan Invoice (Hingga 4 Slot) & Faktur Pajak -->
              <div class="form-card">
                <div class="card-header-custom">
                  <h3 class="card-title-custom">
                    <div class="card-icon-badge emerald"><i class="bi bi-receipt"></i></div>
                    4. Pengelolaan Invoice (Hingga 4 Slot) & Faktur Pajak
                  </h3>
                  <span class="badge-tag tag-emerald">{{ filledInvoicesCount }} Slot Terisi</span>
                </div>

                <!-- 4 Slot Invoice Repeater -->
                <div class="invoice-slots-container">
                  <div v-for="(inv, idx) in form.invoices" :key="idx" class="invoice-slot-card"
                    :class="{ 'has-data': inv.noInvoice || inv.nominal > 0 }">
                    <div class="slot-index-pill">{{ idx + 1 }}</div>
                    <div>
                      <input type="text" class="input-control" v-model="inv.noInvoice"
                        :placeholder="'No Invoice ' + (idx + 1)">
                    </div>
                    <div>
                      <div class="custom-date-wrapper" :class="{ 'is-disabled': !inv.noInvoice && !inv.nominal }">
                        <input type="text" class="input-control date-display-input"
                               :value="formatIsoToDmy(inv.tglInvoice)"
                               @input="handleDateTextInput($event, (v) => inv.tglInvoice = v)"
                               @blur="handleDateBlur($event, (v) => inv.tglInvoice = v, inv.tglInvoice)"
                               placeholder="dd/mm/yyyy" maxlength="10"
                               :disabled="!inv.noInvoice && !inv.nominal">
                        <input type="date" class="native-date-hidden-trigger" :value="inv.tglInvoice"
                               @input="inv.tglInvoice = $event.target.value"
                               @click="openDatePickerNative($event)"
                               :disabled="!inv.noInvoice && !inv.nominal" tabindex="-1" aria-hidden="true">
                        <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                      </div>
                    </div>
                    <div>
                      <input type="text" inputmode="numeric" class="input-control is-money"
                        :value="formatRupiahInput(inv.nominal)"
                        @input="handleInvoiceNominalInput($event, idx)"
                        @blur="handleInvoiceNominalBlur($event, idx)"
                        @focus="handleNominalFocus($event)"
                        placeholder="Rp 0">
                    </div>
                    <div class="text-center">
                      <button class="btn btn-sm btn-outline-secondary p-1" @click="clearInvoiceSlot(idx)" title="Kosongkan Baris">
                        <i class="bi bi-eraser"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Faktur Pajak Fields -->
                <div class="field-grid-2 mt-3 pt-2 border-top">
                  <div class="field-group mb-0">
                    <label class="field-label" for="noFakturPajak">Nomor Faktur Pajak (e-Faktur)</label>
                    <input id="noFakturPajak" type="text" class="input-control" v-model="form.noFakturPajak"
                      placeholder="010.000-25.xxxxxxxx">
                  </div>
                  <div class="field-group mb-0">
                    <label class="field-label" for="tglFakturPajak">Tanggal Faktur Pajak</label>
                    <div class="custom-date-wrapper">
                      <input id="tglFakturPajak" type="text" class="input-control date-display-input"
                             :value="formatIsoToDmy(form.tglFakturPajak)"
                             @input="handleDateTextInput($event, (v) => form.tglFakturPajak = v)"
                             @blur="handleDateBlur($event, (v) => form.tglFakturPajak = v, form.tglFakturPajak)"
                             placeholder="dd/mm/yyyy" maxlength="10">
                      <input type="date" class="native-date-hidden-trigger" :value="form.tglFakturPajak"
                             @input="form.tglFakturPajak = $event.target.value"
                             @click="openDatePickerNative($event)" tabindex="-1" aria-hidden="true">
                      <span class="date-picker-icon-btn" aria-hidden="true"><i class="bi bi-calendar3"></i></span>
                    </div>
                  </div>
                </div>

                <!-- Total Card & Terbilang -->
                <div class="total-summary-card">
                  <div>
                    <span class="total-summary-label">Nominal Total Tagihan (Bruto):</span>
                    <div style="font-size: 0.75rem; opacity: 0.85;">
                      {{ filledInvoicesCount }} dari 4 invoice aktif
                    </div>
                  </div>
                  <div class="total-summary-value">{{ formatCurrency(totalNominalInvoice) }}</div>
                </div>

                <div class="terbilang-banner" v-if="totalNominalInvoice > 0">
                  <strong>Terbilang:</strong> {{ terbilangInvoice }}
                </div>
              </div>

              <!-- Card 5: Pembebanan Anggaran (DHA & 3 Baris COA) -->
              <div class="form-card">
                <div class="card-header-custom">
                  <h3 class="card-title-custom">
                    <div class="card-icon-badge navy"><i class="bi bi-pie-chart"></i></div>
                    5. Pembebanan Anggaran (DHA & 3 Baris COA)
                  </h3>
                </div>

                <!-- DHA Selector & Saldo Meter -->
                <div class="field-group">
                  <label class="field-label" for="namaDha">
                    Nama DHA (Daftar Himpunan Anggaran) <span class="required-star">*</span>
                  </label>
                  <div class="searchable-dropdown" @click.stop>
                    <div class="searchable-dropdown-trigger" :class="{ 'is-open': isDhaDropdownOpen }"
                      @click="toggleDhaDropdown">
                      <span class="searchable-dropdown-value" v-if="form.namaDha">
                        {{ form.namaDha }}
                      </span>
                      <span class="searchable-dropdown-placeholder" v-else>
                        Pilih atau cari Nama DHA ({{ uniqueDhaList.length }} data tersedia)...
                      </span>
                      <div class="searchable-dropdown-actions">
                        <span class="searchable-dropdown-clear" v-if="form.namaDha" @click.stop="clearDhaSelection" title="Hapus pilihan">
                          <i class="bi bi-x-lg"></i>
                        </span>
                        <i class="bi text-muted" :class="isDhaDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                      </div>
                    </div>

                    <!-- Dropdown Menu for DHA -->
                    <div class="searchable-dropdown-menu" v-if="isDhaDropdownOpen">
                      <div class="searchable-dropdown-search-box">
                        <i class="bi bi-search text-muted small"></i>
                        <input type="text" class="searchable-dropdown-search-input" v-model="dhaFilterText"
                          placeholder="Ketik kata kunci pencarian DHA..." @click.stop />
                        <span class="badge bg-light text-secondary border small">{{ filteredDhaOptions.length }} hasil</span>
                      </div>
                      <div class="searchable-dropdown-options">
                        <div v-if="filteredDhaOptions.length === 0" class="searchable-dropdown-no-results">
                          <i class="bi bi-info-circle d-block mb-1 fs-5"></i>
                          Tidak ada nama DHA yang cocok dengan "{{ dhaFilterText }}"
                        </div>
                        <div v-for="d in filteredDhaOptions" :key="d.nama"
                          class="searchable-dropdown-option"
                          :class="{ 'is-selected': form.namaDha === d.nama }"
                          @click="selectDha(d)">
                          <div class="fw-semibold">{{ d.nama }}</div>
                          <div class="searchable-dropdown-option-sub">
                            <span v-if="d.anggaran || d.saldo" class="text-success font-monospace">
                              Pagu: {{ formatCurrency(d.anggaran || d.saldo) }}
                            </span>
                            <span v-if="d.coaCount" class="badge-tag tag-navy py-0">
                              {{ d.coaCount }} COA terkait
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="dha-balance-meter">
                  <div class="dha-meter-header">
                    <span>Pagu Awal: {{ formatCurrency(currentDha.saldo) }}</span>
                    <span>Sisa Saldo: <strong :class="sisaSaldoDha < 0 ? 'text-danger' : 'text-success'">
                      {{ formatCurrency(sisaSaldoDha) }}
                    </strong></span>
                  </div>
                  <div class="progress-bar-wrap">
                    <div class="progress-bar-fill" :class="{ warning: persentaseDha > 85 }"
                      :style="{ width: Math.min(100, persentaseDha) + '%' }"></div>
                  </div>
                </div>

                <!-- 3 Slot COA Allocation with Natural Akun and 10cm Rangkaian COA -->
                <label class="field-label mt-2">Alokasi Rangkaian COA & Natural Akun (3 Baris Rekening)</label>
                <div class="coa-row-container mb-3">
                  <div v-for="(coa, cIdx) in form.coas" :key="cIdx" class="coa-row-grid">
                    <!-- Rangkaian COA (Lebar 10 cm, Searchable Dropdown) -->
                    <div class="field coa-col-rangkaian">
                      <label :for="'legacyCoa' + (cIdx + 1)">Rangkaian COA {{ cIdx + 1 }}</label>
                      <div class="searchable-dropdown" @click.stop>
                        <div class="searchable-dropdown-trigger" :class="{ 'is-open': isCoaDropdownOpen[cIdx] }"
                          @click="toggleCoaDropdown(cIdx)">
                          <span class="searchable-dropdown-value font-monospace fw-semibold" v-if="coa.rangkaianCoa">
                            {{ coa.rangkaianCoa }}
                          </span>
                          <span class="searchable-dropdown-placeholder" v-else>
                            {{ form.namaDha ? 'Pilih COA ' + (cIdx + 1) + '...' : 'Pilih DHA terlebih dahulu...' }}
                          </span>
                          <div class="searchable-dropdown-actions">
                            <span class="searchable-dropdown-clear" v-if="coa.rangkaianCoa" @click.stop="clearCoaSelection(cIdx)" title="Hapus COA">
                              <i class="bi bi-x-lg"></i>
                            </span>
                            <i class="bi text-muted" :class="isCoaDropdownOpen[cIdx] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                          </div>
                        </div>
                        <div class="searchable-dropdown-menu" style="min-width: 380px;" v-if="isCoaDropdownOpen[cIdx]">
                          <div class="searchable-dropdown-search-box">
                            <i class="bi bi-search text-muted small"></i>
                            <input type="text" class="searchable-dropdown-search-input" v-model="coaFilterText[cIdx]"
                              placeholder="Cari kode akun atau nama natural akun..." @click.stop />
                            <span class="badge bg-light text-secondary border small">{{ getFilteredCoaOptions(cIdx).length }} hasil</span>
                          </div>
                          <div class="searchable-dropdown-options">
                            <div v-if="getFilteredCoaOptions(cIdx).length === 0" class="searchable-dropdown-no-results">
                              <i class="bi bi-info-circle d-block mb-1 fs-5"></i>
                              Tidak ada data rangkaian COA ditemukan
                            </div>
                            <div v-for="cItem in getFilteredCoaOptions(cIdx)" :key="cItem.id || cItem.rangkaianCoa"
                              class="searchable-dropdown-option"
                              :class="{ 'is-selected': coa.rangkaianCoa === cItem.rangkaianCoa }"
                              @click="selectCoa(cIdx, cItem)">
                              <div class="font-monospace fw-bold text-dark">{{ cItem.rangkaianCoa }}</div>
                              <div class="searchable-dropdown-option-sub">
                                <span class="badge-tag tag-emerald fw-medium text-truncate" style="max-width: 260px;" v-if="cItem.naturalAkun">
                                  {{ cItem.naturalAkun }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Data Natural Akun (Di sebelah kolom rangkaian COA) -->
                    <div class="field coa-col-natural">
                      <label :for="'legacyNaturalAkun' + (cIdx + 1)">Data Natural Akun {{ cIdx + 1 }}</label>
                      <input :id="'legacyNaturalAkun' + (cIdx + 1)" type="text" class="form-control"
                        v-model="coa.naturalAkun"
                        placeholder="Otomatis terisi atau ketik nama akun..." />
                    </div>

                    <!-- Nominal COA -->
                    <div class="field coa-col-nominal">
                      <label :for="'legacyCoaNominal' + (cIdx + 1)">Nominal (Rp)</label>
                      <div class="d-flex align-items-center gap-1">
                        <input :id="'legacyCoaNominal' + (cIdx + 1)" class="form-control is-money"
                          type="text" inputmode="numeric"
                          :value="formatRupiahInput(coa.nominal)"
                          @input="handleCoaNominalInput($event, cIdx)"
                          @blur="handleCoaNominalBlur($event, cIdx)"
                          @focus="handleNominalFocus($event)"
                          placeholder="Rp 0">
                        <button class="btn btn-sm btn-outline-primary" @click="autoBalanceCoa(cIdx)" title="Auto-balance (=)">=</button>
                        <button class="btn btn-sm btn-outline-secondary" @click="clearCoaSlot(cIdx)" title="Kosongkan"><i class="bi bi-x"></i></button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- COA Reconciliation Bar -->
                <div class="coa-reconciliation-bar" :class="isCoaBalanced ? 'matched' : 'mismatched'">
                  <span>Total Alokasi COA: <strong>{{ formatCurrency(totalNominalCoa) }}</strong></span>
                  <span v-if="isCoaBalanced"><i class="bi bi-check-circle-fill"></i> COA Seimbang (100% Match)</span>
                  <span v-else><i class="bi bi-exclamation-triangle-fill"></i> Selisih: {{ formatCurrency(selisihCoa) }}</span>
                </div>
              </div>

              <!-- Card 6: Pejabat Pengaju & Penyetuju -->
              <div class="form-card">
                <div class="card-header-custom">
                  <h3 class="card-title-custom">
                    <div class="card-icon-badge emerald"><i class="bi bi-pen"></i></div>
                    6. Pejabat Penandatangan & Otorisator
                  </h3>
                </div>

                <div class="field-grid-2">
                  <div class="field-group">
                    <label class="field-label" for="yangMengajukan">Yang Mengajukan</label>
                    <select id="yangMengajukan" class="select-control" v-model="form.yangMengajukan"
                      @change="onSelectPengaju(form.yangMengajukan)">
                      <option v-for="p in pejabatPengajuList" :key="p.nama" :value="p.nama">{{ p.nama }}</option>
                    </select>
                  </div>

                  <div class="field-group">
                    <label class="field-label" for="pangkatMengajukan">Pangkat / Jabatan Mengajukan</label>
                    <input id="pangkatMengajukan" type="text" class="input-control" v-model="form.pangkatMengajukan">
                  </div>
                </div>

                <div class="field-grid-2">
                  <div class="field-group mb-0">
                    <label class="field-label" for="yangMenyetujui">Yang Menyetujui</label>
                    <select id="yangMenyetujui" class="select-control" v-model="form.yangMenyetujui"
                      @change="onSelectPenyetuju(form.yangMenyetujui)">
                      <option v-for="p in pejabatPenyetujuList" :key="p.nama" :value="p.nama">{{ p.nama }}</option>
                    </select>
                  </div>

                  <div class="field-group mb-0">
                    <label class="field-label" for="pangkatMenyetujui">Pangkat / Jabatan Menyetujui</label>
                    <input id="pangkatMenyetujui" type="text" class="input-control" v-model="form.pangkatMenyetujui">
                  </div>
                </div>
              </div>

            </div>

          <!-- Sticky Bottom Action Toolbar (Hanya KEMBALI, CETAK, SAVE) -->
          <div class="form-action-sticky-bar">
            <div class="action-bar-inner">
              <div class="d-flex align-items-center gap-2">
                <span class="text-muted" style="font-size: 0.825rem;">
                  Batch Aktif: <strong class="text-primary">{{ form.noBatch || 'DRAFT BARU' }}</strong>
                </span>
                <span class="badge-tag tag-navy">{{ form.status }}</span>
              </div>

              <div class="action-button-group">
                <button class="btn-erp btn-erp-secondary" @click="goBack" title="Kembali ke Halaman Sebelumnya">
                  <i class="bi bi-arrow-left"></i> KEMBALI
                </button>

                <button v-if="hasPermission('print_disposisi')" class="btn-erp btn-erp-indigo" @click="printVoucher" title="Cetak Lembar Disposisi BI ERP">
                  <i class="bi bi-printer"></i> CETAK
                </button>

                <button v-if="hasPermission(form.id ? 'form_edit' : 'form_create')" class="btn-erp btn-erp-primary" @click="saveBatch" :disabled="isSubmitting" title="Simpan Data Batch">
                  <i class="bi bi-floppy"></i> {{ isSubmitting ? 'MENYIMPAN...' : 'SAVE' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW 3: DAFTAR BATCH MONITORING & DATA TABLE
             ================================================================ -->
        <div v-show="currentView === 'table'" class="content-container no-print">
          <div class="data-table-container">
            <div class="table-toolbar">
              <div class="table-search-group">
                <select class="select-control" style="max-width: 170px;" v-model="tableCriteria">
                  <option value="semua">Semua Kriteria</option>
                  <option value="noBatch">No. Batch</option>
                  <option value="noDokumen">No. Dokumen</option>
                  <option value="perihal">Perihal</option>
                  <option value="dariUker">Dari Uker</option>
                  <option value="rekanan">Nama Rekanan</option>
                </select>

                <input type="text" class="input-control" v-model="tableSearchKeyword"
                  placeholder="Cari nomor batch, dokumen, rekanan, atau perihal...">

                <button class="btn-erp btn-erp-primary" @click="currentPage = 1">
                  <i class="bi bi-search"></i> CARI
                </button>
                <button class="btn-erp btn-erp-secondary" v-if="tableSearchKeyword" @click="tableSearchKeyword = ''">
                  RESET
                </button>
              </div>

              <div class="d-flex align-items-center gap-2">
                <select class="select-control" style="width: 140px;" v-model="tableStatusFilter">
                  <option value="">Semua Status</option>
                  <option value="Diajukan">Diajukan</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Cair">Cair</option>
                  <option value="Draft">Draft</option>
                </select>

                <button class="btn-erp btn-erp-secondary" @click="exportToCSV">
                  <i class="bi bi-file-earmark-spreadsheet"></i> Ekspor CSV
                </button>
              </div>
            </div>

            <!-- Table -->
            <div class="table-responsive-wrapper">
              <table class="modern-data-table">
                <thead>
                  <tr>
                    <th style="width: 40px; text-align: center;">No.</th>
                    <th class="sortable" @click="changeSort('noBatch')">
                      No. Batch <i class="bi bi-arrow-down-up" style="font-size: 0.7rem;"></i>
                    </th>
                    <th class="sortable" @click="changeSort('noDokumen')">No. Dokumen</th>
                    <th>Perihal</th>
                    <th class="sortable" @click="changeSort('tglTransaksi')">Tanggal</th>
                    <th>Kepada Uker</th>
                    <th>Dari Uker</th>
                    <th>Jenis Invoice</th>
                    <th>Invoice 1</th>
                    <th>Tgl Inv 1</th>
                    <th style="text-align: right;" class="sortable" @click="changeSort('nominalTotal')">Nominal Total (Rp)</th>
                    <th>Status</th>
                    <th style="text-align: center;">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in paginatedBatches" :key="item.id"
                    :class="{ 'is-selected': selectedBatchId === item.id }" @click="loadBatchToForm(item)">
                    <td style="text-align: center; color: var(--text-dim);">{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
                    <td><span class="badge-tag tag-navy fw-bold">{{ item.noBatch }}</span></td>
                    <td class="fw-semibold">{{ item.noDokumen }}</td>
                    <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis;" :title="item.perihal">
                      {{ item.perihal }}
                    </td>
                    <td>{{ formatDateIndo(item.tglTransaksi) }}</td>
                    <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis;">{{ item.kepadaUker }}</td>
                    <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis;">{{ item.dariUker }}</td>
                    <td>{{ item.jenisInvoice }}</td>
                    <td>{{ item.invoices && item.invoices[0] ? item.invoices[0].noInvoice || '-' : '-' }}</td>
                    <td>{{ item.invoices && item.invoices[0] ? formatDateIndo(item.invoices[0].tglInvoice) : '-' }}</td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 700; color: var(--accent-emerald);">
                      {{ formatCurrency(calcBatchTotal(item)) }}
                    </td>
                    <td><span class="badge-tag tag-emerald">● {{ item.status }}</span></td>
                    <td style="text-align: center;">
                      <button class="btn btn-sm btn-outline-primary py-0 px-2" @click.stop="loadBatchToForm(item)">
                        Pilih & Edit
                      </button>
                    </td>
                  </tr>
                  <tr v-if="paginatedBatches.length === 0">
                    <td colspan="13" class="text-center py-4 text-muted">
                      Tidak ada data batch yang sesuai kriteria pencarian.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <div class="text-muted" style="font-size: 0.8rem;">
                Menampilkan {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredBatches.length) }}
                dari {{ filteredBatches.length }} data batch
              </div>
              <div class="d-flex align-items-center gap-2">
                <select class="select-control py-1" style="width: 80px;" v-model.number="pageSize">
                  <option :value="5">5 / hal</option>
                  <option :value="10">10 / hal</option>
                  <option :value="20">20 / hal</option>
                </select>
                <button class="btn-erp btn-erp-secondary py-1 px-2" :disabled="currentPage <= 1" @click="currentPage--">
                  ‹ Sebelumnya
                </button>
                <span style="font-size: 0.8rem; font-weight: 600;">{{ currentPage }} / {{ totalPages }}</span>
                <button class="btn-erp btn-erp-secondary py-1 px-2" :disabled="currentPage >= totalPages" @click="currentPage++">
                  Berikutnya ›
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ================================================================
             VIEW 4: PRATINJAU CETAK LEMBAR DISPOSISI BI ERP
             ================================================================ -->
        <div v-show="currentView === 'print' && canAccessView('print')" class="content-container no-print mb-4">
          <div class="form-card mx-auto" style="max-width: 920px;">
            <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom flex-wrap gap-2">
              <div>
                <h4 class="mb-0 fw-bold text-dark">
                  <i class="bi bi-file-earmark-text text-primary me-2"></i>Pratinjau Lembar Disposisi BI ERP
                </h4>
                <small class="text-muted">Format resmi Kantor Perwakilan Bank Indonesia Jember siap cetak A4 / PDF</small>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn-erp btn-erp-indigo" @click="openPrintConfigModal">
                  <i class="bi bi-gear-fill me-1"></i> Pengaturan Cetak (Huruf & Kertas)
                </button>
                <button type="button" class="btn-erp btn-erp-outline" @click="showDisposisiCustomize = !showDisposisiCustomize">
                  <i class="bi bi-sliders me-1"></i> {{ showDisposisiCustomize ? 'Tutup Parameter' : 'Parameter Nilai' }}
                </button>
                <button type="button" class="btn-erp btn-erp-secondary" @click="currentView = 'form'">
                  <i class="bi bi-arrow-left me-1"></i> Kembali ke Form
                </button>
                <button type="button" class="btn-erp btn-erp-primary" @click="triggerPrint">
                  <i class="bi bi-printer me-1"></i> Cetak Dokumen Sekarang
                </button>
              </div>
            </div>

            <!-- Panel Pengaturan Cepat Parameter Cetak (Opsional) -->
            <div v-if="showDisposisiCustomize" class="p-3 mb-3 border rounded bg-light">
              <div class="fw-bold text-primary small mb-2">
                <i class="bi bi-pencil-square me-1"></i> Kustomisasi Nilai Parameter Lembar Disposisi:
              </div>
              <div class="row g-2">
                <div class="col-md-3">
                  <label class="form-label small mb-1 fw-semibold">Kode Form (Box Kanan)</label>
                  <input type="text" class="form-control form-control-sm font-monospace" v-model="formDocCodeTop"
                    placeholder="AP-T-LDP-02" />
                </div>
                <div class="col-md-3">
                  <label class="form-label small mb-1 fw-semibold">No. Dokumen (Kiri Atas)</label>
                  <input type="text" class="form-control form-control-sm font-monospace" v-model="form.noDokumen"
                    placeholder="310/UN25.1.4" />
                </div>
                <div class="col-md-3">
                  <label class="form-label small mb-1 fw-semibold">No. Batch (Box Kanan)</label>
                  <input type="text" class="form-control form-control-sm font-monospace" v-model="form.noBatch"
                    placeholder="JR25 00998" />
                </div>
                <div class="col-md-3">
                  <label class="form-label small mb-1 fw-semibold">Tipe Pembayaran</label>
                  <input type="text" class="form-control form-control-sm" v-model="form.tipePembayaran"
                    placeholder="BIFAST" />
                </div>
                <div class="col-md-6">
                  <label class="form-label small mb-1 fw-semibold">Kepada (Uker Tujuan)</label>
                  <input type="text" class="form-control form-control-sm" v-model="form.kepadaUker"
                    placeholder="Unit Manajemen Intern" />
                </div>
                <div class="col-md-6">
                  <label class="form-label small mb-1 fw-semibold">Dari / Pembebanan Satker</label>
                  <input type="text" class="form-control form-control-sm" v-model="form.dariUker"
                    placeholder="Seksi Kehumasan" />
                </div>
                <div class="col-12">
                  <label class="form-label small mb-1 fw-semibold">Deskripsi Hasil Akhir Kegiatan</label>
                  <textarea rows="2" class="form-control form-control-sm" v-model="form.deskripsiHasilAkhir"
                    placeholder="Pelaksanaan kegiatan perpustakaan (pembelian buku, bedah buku, capacity building pustakawan) dalam rangka pengelolaan perpustakaan"></textarea>
                </div>
              </div>
            </div>

            <!-- PREVIEW HALAMAN 1 -->
            <div class="disposisi-page-separator">
              <span><i class="bi bi-file-earmark-text me-2"></i>HALAMAN 1: RINCIAN INVOICE, REKANAN & PEMBAYARAN</span>
              <span class="badge bg-secondary">A4 Portrait</span>
            </div>

            <!-- LEMBAR DISPOSISI BI ERP HALAMAN 1 -->
            <div class="disposisi-sheet mb-4" :class="printSettings.fontFamily === 'frutiger' ? 'font-cetak-frutiger' : 'font-cetak-standart'" :style="previewSheetStyle">
              <!-- HEADER LOGO & BOX KODE -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
                <div>
                  <div class="disposisi-header-logo">
                    <!-- SVG Logo Bank Indonesia -->
                    <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                      <circle cx="50" cy="50" r="46" stroke="#000000" stroke-width="6" fill="#ffffff" />
                      <path d="M28 26 H46 C56 26 62 31 62 38 C62 43 58 47 52 48 C59 50 64 55 64 62 C64 70 56 74 45 74 H28 Z M38 35 V44 H45 C50 44 53 42 53 39 C53 36 50 35 45 35 Z M38 52 V65 H46 C51 65 55 63 55 59 C55 55 51 52 46 52 Z" fill="#000000" />
                      <path d="M68 26 H78 V74 H68 Z" fill="#000000" />
                    </svg>
                    <span class="disposisi-bank-title">BANK INDONESIA</span>
                  </div>
                  <div class="disposisi-doc-no">
                    No. {{ form.noDokumen || '310/UN25.1.4' }}
                  </div>
                </div>

                <div>
                  <table class="disposisi-code-box">
                    <tbody>
                      <tr>
                        <td>{{ formDocCodeTop || 'AP-T-LDP-02' }}</td>
                      </tr>
                      <tr>
                        <td>{{ form.noBatch || 'JR25 00998' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- JUDUL DOKUMEN -->
              <div class="disposisi-title">
                LEMBAR DISPOSISI BI ERP
              </div>

              <!-- TABEL PERIHAL & TANGGAL -->
              <table class="disposisi-table">
                <thead>
                  <tr>
                    <th style="width: 72%;">PERIHAL</th>
                    <th style="width: 28%;">TANGGAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="text-transform: uppercase; line-height: 1.35; padding: 6px 8px;">
                      {{ form.perihal || 'UJI COBA 1' }}
                    </td>
                    <td style="text-align: center; vertical-align: middle; padding: 6px 8px;">
                      {{ formatFullDateIndo(form.tglTransaksi) || '01 Juli 2025' }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- METADATA SURAT -->
              <table class="disposisi-meta-simple">
                <tbody>
                  <tr>
                    <td style="width: 175px;">Kepada</td>
                    <td style="width: 15px;">:</td>
                    <td>{{ form.kepadaUker || 'Unit Manajemen Intern' }}</td>
                  </tr>
                  <tr>
                    <td>Dari</td>
                    <td>:</td>
                    <td>{{ form.dariUker || 'Seksi Kehumasan' }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="disposisi-p" style="margin: 4px 0 6px 0;">
                Menunjuk invoice dengan rincian :
              </div>

              <!-- TABEL RINCIAN INVOICE, REKANAN & PEMBAYARAN -->
              <table class="disposisi-table">
                <tbody>
                  <!-- INVOICE SECTIONS -->
                  <template v-for="(inv, idx) in displayInvoices" :key="'preview-inv-' + idx">
                    <tr>
                      <td colspan="2" class="disposisi-section-header">
                        INVOICE {{ idx + 1 }}
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 44%;">Nomor Invoice</td>
                      <td>{{ inv.noInvoice || '-' }}</td>
                    </tr>
                    <tr>
                      <td>Tanggal Invoice</td>
                      <td>{{ formatFullDateIndo(inv.tglInvoice) }}</td>
                    </tr>
                    <tr>
                      <td>Tanggal Invoice diterima</td>
                      <td>{{ formatFullDateIndo(form.processDate || form.ldapDate || form.tglTransaksi) }}</td>
                    </tr>
                    <tr>
                      <td>Nominal</td>
                      <td>{{ formatDecimalCommas(inv.nominal) }}</td>
                    </tr>
                    <tr v-if="inv.noFakturPajak">
                      <td>No Faktur Pajak (jika ada)</td>
                      <td>{{ inv.noFakturPajak }}</td>
                    </tr>
                    <tr v-if="inv.tglFakturPajak">
                      <td>Tanggal Faktur Pajak (jika ada)</td>
                      <td>{{ formatFullDateIndo(inv.tglFakturPajak) }}</td>
                    </tr>
                  </template>

                  <!-- REKANAN SECTION -->
                  <tr>
                    <td colspan="2" class="disposisi-section-header">
                      REKANAN
                    </td>
                  </tr>
                  <tr>
                    <td>Nama Rekanan</td>
                    <td style="text-transform: uppercase;">{{ form.namaRekanan || 'ABDUL ROZIK FANANI' }}</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>{{ form.alamatRekanan || 'Dsn Plembon RT 001 RW 002 Kel. Licin Kec. Licin Kab. Banyuwangi' }}</td>
                  </tr>
                  <tr>
                    <td>NPWP (jika ada)</td>
                    <td>{{ form.nikNpwp || '32107464673754853' }}</td>
                  </tr>
                  <tr>
                    <td>Nama Wajib Pajak (jika ada)</td>
                    <td style="text-transform: uppercase;">{{ form.namaWpRekanan || form.namaRekanan || 'JOHAN SAPUTRA' }}</td>
                  </tr>

                  <!-- PEMBAYARAN SECTION -->
                  <tr>
                    <td colspan="2" class="disposisi-section-header">
                      PEMBAYARAN
                    </td>
                  </tr>
                  <tr>
                    <td>Nama Bank</td>
                    <td>{{ form.namaBank || 'PT. BANK RAKYAT INDONESIA (PERSERO) Tbk' }}</td>
                  </tr>
                  <tr>
                    <td>Nama Rekening</td>
                    <td>{{ form.namaRekening || 'PT BPD JAWA TIMUR CAB JEMBER' }}</td>
                  </tr>
                  <tr>
                    <td>No Rekening</td>
                    <td>{{ form.nomorRekening || '2223345698886432' }}</td>
                  </tr>
                  <tr>
                    <td>Nominal</td>
                    <td>{{ formatDecimalCommas(displayTotalNominal) }}</td>
                  </tr>
                  <tr>
                    <td>Tipe Pembayaran</td>
                    <td style="text-transform: uppercase;">{{ form.tipePembayaran || 'BIFAST' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- PREVIEW HALAMAN 2 -->
            <div class="disposisi-page-separator">
              <span><i class="bi bi-file-earmark-check me-2"></i>HALAMAN 2: PEMBEBANAN AKUN ANGGARAN & LEMBAR PERSETUJUAN</span>
              <span class="badge bg-secondary">A4 Portrait</span>
            </div>

            <!-- LEMBAR DISPOSISI BI ERP HALAMAN 2 -->
            <div class="disposisi-sheet" :class="printSettings.fontFamily === 'frutiger' ? 'font-cetak-frutiger' : 'font-cetak-standart'" :style="previewSheetStyle">
              <!-- HEADER LOGO & BOX KODE HALAMAN 2 -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
                <div>
                  <div class="disposisi-header-logo">
                    <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                      <circle cx="50" cy="50" r="46" stroke="#000000" stroke-width="6" fill="#ffffff" />
                      <path d="M28 26 H46 C56 26 62 31 62 38 C62 43 58 47 52 48 C59 50 64 55 64 62 C64 70 56 74 45 74 H28 Z M38 35 V44 H45 C50 44 53 42 53 39 C53 36 50 35 45 35 Z M38 52 V65 H46 C51 65 55 63 55 59 C55 55 51 52 46 52 Z" fill="#000000" />
                      <path d="M68 26 H78 V74 H68 Z" fill="#000000" />
                    </svg>
                    <span class="disposisi-bank-title">BANK INDONESIA</span>
                  </div>
                  <div class="disposisi-doc-no">
                    No. {{ form.noDokumen || '310/UN25.1.4' }}
                  </div>
                </div>

                <div>
                  <table class="disposisi-code-box">
                    <tbody>
                      <tr>
                        <td>{{ formDocCodeTop || 'AP-T-LDP-02' }}</td>
                      </tr>
                      <tr>
                        <td>{{ form.noBatch || 'JR25 00998' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- JUDUL DOKUMEN -->
              <div class="disposisi-title">
                LEMBAR DISPOSISI BI ERP
              </div>

              <!-- TABEL PERIHAL & TANGGAL -->
              <table class="disposisi-table">
                <thead>
                  <tr>
                    <th style="width: 72%;">PERIHAL</th>
                    <th style="width: 28%;">TANGGAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="text-transform: uppercase; line-height: 1.35; padding: 6px 8px;">
                      {{ form.perihal || 'UJI COBA 1' }}
                    </td>
                    <td style="text-align: center; vertical-align: middle; padding: 6px 8px;">
                      {{ formatFullDateIndo(form.tglTransaksi) || '01 Juli 2025' }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- PENGANTAR ANGGARAN -->
              <p class="disposisi-p" style="margin: 8px 0 6px 0;">
                Mohon agar dilakukan proses pembayaran dengan rincian Akun Anggaran:
              </p>

              <!-- TABEL AKUN ANGGARAN & COA -->
              <table class="disposisi-table">
                <tbody>
                  <tr>
                    <td style="width: 32%; vertical-align: top;">
                      Pembebanan Uker /<br>Satker
                    </td>
                    <td style="vertical-align: top;">
                      <div style="display: flex; gap: 6px;">
                        <span>:</span>
                        <div>{{ form.bebanAnggaranUker || form.dariUker || form.pembebananSatker || 'Seksi Kehumasan' }}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top;">
                      Deskripsi Hasil Akhir
                    </td>
                    <td style="vertical-align: top;">
                      <div style="display: flex; gap: 6px;">
                        <span>:</span>
                        <div style="line-height: 1.35;">{{ form.deskripsiHasilAkhir || form.namaDha || form.perihal || 'Pelaksanaan kegiatan perpustakaan (pembelian buku, bedah buku, capacity building pustakawan) dalam rangka pengelolaan perpustakaan' }}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: top;">
                      Rangkaian COA
                    </td>
                    <td style="padding: 0; vertical-align: top;">
                      <div style="display: flex;">
                        <span style="padding: 4px 6px 0 6px;">:</span>
                        <table style="width: 100%; border-collapse: collapse; margin: 0; border: none;">
                          <tbody>
                            <tr v-for="(coa, idx) in displayCoas" :key="'preview-coa-' + idx" :style="idx < displayCoas.length - 1 ? 'border-bottom: 1px solid #000;' : ''">
                              <td style="border: none; padding: 4px 6px; font-family: 'Courier New', monospace; font-size: 8.5pt;">
                                {{ coa.rangkaianCoa }}
                              </td>
                              <td style="border: none; border-left: 1px solid #000; width: 130px; text-align: right; padding: 4px 6px; font-family: 'Courier New', monospace; font-size: 8.5pt;">
                                {{ formatNumCommas(coa.nominal) }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- PENUTUP -->
              <p class="disposisi-p" style="margin-top: 8px; margin-bottom: 2px;">
                Adapun dokumen pendukung terlampir (dokumen checklist dan kelengkapan dokumen lainnya)
              </p>
              <p class="disposisi-p" style="margin-top: 0; margin-bottom: 8px;">
                Atas perhatiannya kami ucapkan terima kasih.
              </p>

              <!-- TABEL TANDA TANGAN (BOX RESMI) -->
              <table class="disposisi-sign-table">
                <thead>
                  <tr>
                    <th style="width: 50%;">Yang Mengajukan</th>
                    <th style="width: 50%;">Yang Menyetujui</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="disposisi-sign-space"></td>
                    <td class="disposisi-sign-space"></td>
                  </tr>
                  <tr>
                    <td>{{ form.yangMengajukan || 'Doni Prasetiyo' }}</td>
                    <td>{{ form.yangMenyetujui || 'Niken Sih Wigati' }}</td>
                  </tr>
                  <tr>
                    <td>{{ form.pangkatMengajukan || 'Manajer' }}</td>
                    <td>{{ form.pangkatMenyetujui || 'Pelaksana' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <!-- Centered Footer (Sesuai Referensi Gambar) -->
      <footer class="erp-footer no-print">
        &copy; 2026 APPPERKUSI. copyright by nono.
      </footer>
    </div>

    <!-- ====================================================================
         PRINT ONLY VIEW (LEMBAR DISPOSISI BI ERP - RESMI SESUAI PDF LAMPIRAN)
         Tercetak secara otomatis saat window.print() / Dialog Cetak Browser
         Terdiri dari 2 Halaman A4 yang rapi dan presisi
         ==================================================================== -->
    <div class="print-only" :class="printSettings.fontFamily === 'frutiger' ? 'font-cetak-frutiger' : 'font-cetak-standart'">
      <!-- HALAMAN 1 CETAK -->
      <div class="disposisi-sheet disposisi-print-page-1" :class="printSettings.fontFamily === 'frutiger' ? 'font-cetak-frutiger' : 'font-cetak-standart'">
        <!-- HEADER LOGO & BOX KODE -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
          <div>
            <div class="disposisi-header-logo">
              <!-- SVG Logo Bank Indonesia -->
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                <circle cx="50" cy="50" r="46" stroke="#000000" stroke-width="6" fill="#ffffff" />
                <path d="M28 26 H46 C56 26 62 31 62 38 C62 43 58 47 52 48 C59 50 64 55 64 62 C64 70 56 74 45 74 H28 Z M38 35 V44 H45 C50 44 53 42 53 39 C53 36 50 35 45 35 Z M38 52 V65 H46 C51 65 55 63 55 59 C55 55 51 52 46 52 Z" fill="#000000" />
                <path d="M68 26 H78 V74 H68 Z" fill="#000000" />
              </svg>
              <span class="disposisi-bank-title">BANK INDONESIA</span>
            </div>
            <div class="disposisi-doc-no">
              No. {{ form.noDokumen || '310/UN25.1.4' }}
            </div>
          </div>

          <div>
            <table class="disposisi-code-box">
              <tbody>
                <tr>
                  <td>{{ formDocCodeTop || 'AP-T-LDP-02' }}</td>
                </tr>
                <tr>
                  <td>{{ form.noBatch || 'JR25 00998' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- JUDUL DOKUMEN -->
        <div class="disposisi-title">
          LEMBAR DISPOSISI BI ERP
        </div>

        <!-- TABEL PERIHAL & TANGGAL -->
        <table class="disposisi-table">
          <thead>
            <tr>
              <th style="width: 72%;">PERIHAL</th>
              <th style="width: 28%;">TANGGAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-transform: uppercase; line-height: 1.35; padding: 6px 8px;">
                {{ form.perihal || 'UJI COBA 1' }}
              </td>
              <td style="text-align: center; vertical-align: middle; padding: 6px 8px;">
                {{ formatFullDateIndo(form.tglTransaksi) || '01 Juli 2025' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- METADATA SURAT HALAMAN 1 -->
        <table class="disposisi-meta-simple">
          <tbody>
            <tr>
              <td style="width: 175px;">Kepada</td>
              <td style="width: 15px;">:</td>
              <td>{{ form.kepadaUker || 'Unit Manajemen Intern' }}</td>
            </tr>
            <tr>
              <td>Dari</td>
              <td>:</td>
              <td>{{ form.dariUker || 'Seksi Kehumasan' }}</td>
            </tr>
          </tbody>
        </table>

        <div class="disposisi-p" style="margin: 4px 0 6px 0;">
          Menunjuk invoice dengan rincian :
        </div>

        <!-- TABEL INVOICE, REKANAN & PEMBAYARAN -->
        <table class="disposisi-table">
          <tbody>
            <!-- INVOICE SECTIONS -->
            <template v-for="(inv, idx) in displayInvoices" :key="'print-inv-' + idx">
              <tr>
                <td colspan="2" class="disposisi-section-header">
                  INVOICE {{ idx + 1 }}
                </td>
              </tr>
              <tr>
                <td style="width: 44%;">Nomor Invoice</td>
                <td>{{ inv.noInvoice || '-' }}</td>
              </tr>
              <tr>
                <td>Tanggal Invoice</td>
                <td>{{ formatFullDateIndo(inv.tglInvoice) }}</td>
              </tr>
              <tr>
                <td>Tanggal Invoice diterima</td>
                <td>{{ formatFullDateIndo(form.processDate || form.ldapDate || form.tglTransaksi) }}</td>
              </tr>
              <tr>
                <td>Nominal</td>
                <td>{{ formatDecimalCommas(inv.nominal) }}</td>
              </tr>
              <tr v-if="inv.noFakturPajak">
                <td>No Faktur Pajak (jika ada)</td>
                <td>{{ inv.noFakturPajak }}</td>
              </tr>
              <tr v-if="inv.tglFakturPajak">
                <td>Tanggal Faktur Pajak (jika ada)</td>
                <td>{{ formatFullDateIndo(inv.tglFakturPajak) }}</td>
              </tr>
            </template>

            <!-- REKANAN SECTION -->
            <tr>
              <td colspan="2" class="disposisi-section-header">
                REKANAN
              </td>
            </tr>
            <tr>
              <td>Nama Rekanan</td>
              <td style="text-transform: uppercase;">{{ form.namaRekanan || 'ABDUL ROZIK FANANI' }}</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>{{ form.alamatRekanan || 'Dsn Plembon RT 001 RW 002 Kel. Licin Kec. Licin Kab. Banyuwangi' }}</td>
            </tr>
            <tr>
              <td>NPWP (jika ada)</td>
              <td>{{ form.nikNpwp || '32107464673754853' }}</td>
            </tr>
            <tr>
              <td>Nama Wajib Pajak (jika ada)</td>
              <td style="text-transform: uppercase;">{{ form.namaWpRekanan || form.namaRekanan || 'JOHAN SAPUTRA' }}</td>
            </tr>

            <!-- PEMBAYARAN SECTION -->
            <tr>
              <td colspan="2" class="disposisi-section-header">
                PEMBAYARAN
              </td>
            </tr>
            <tr>
              <td>Nama Bank</td>
              <td>{{ form.namaBank || 'PT. BANK RAKYAT INDONESIA (PERSERO) Tbk' }}</td>
            </tr>
            <tr>
              <td>Nama Rekening</td>
              <td>{{ form.namaRekening || 'PT BPD JAWA TIMUR CAB JEMBER' }}</td>
            </tr>
            <tr>
              <td>No Rekening</td>
              <td>{{ form.nomorRekening || '2223345698886432' }}</td>
            </tr>
            <tr>
              <td>Nominal</td>
              <td>{{ formatDecimalCommas(displayTotalNominal) }}</td>
            </tr>
            <tr>
              <td>Tipe Pembayaran</td>
              <td style="text-transform: uppercase;">{{ form.tipePembayaran || 'BIFAST' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- HALAMAN 2 CETAK -->
      <div class="disposisi-sheet disposisi-print-page-2" :class="printSettings.fontFamily === 'frutiger' ? 'font-cetak-frutiger' : 'font-cetak-standart'">
        <!-- HEADER LOGO & BOX KODE HALAMAN 2 -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px;">
          <div>
            <div class="disposisi-header-logo">
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                <circle cx="50" cy="50" r="46" stroke="#000000" stroke-width="6" fill="#ffffff" />
                <path d="M28 26 H46 C56 26 62 31 62 38 C62 43 58 47 52 48 C59 50 64 55 64 62 C64 70 56 74 45 74 H28 Z M38 35 V44 H45 C50 44 53 42 53 39 C53 36 50 35 45 35 Z M38 52 V65 H46 C51 65 55 63 55 59 C55 55 51 52 46 52 Z" fill="#000000" />
                <path d="M68 26 H78 V74 H68 Z" fill="#000000" />
              </svg>
              <span class="disposisi-bank-title">BANK INDONESIA</span>
            </div>
            <div class="disposisi-doc-no">
              No. {{ form.noDokumen || '310/UN25.1.4' }}
            </div>
          </div>

          <div>
            <table class="disposisi-code-box">
              <tbody>
                <tr>
                  <td>{{ formDocCodeTop || 'AP-T-LDP-02' }}</td>
                </tr>
                <tr>
                  <td>{{ form.noBatch || 'JR25 00998' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- JUDUL DOKUMEN -->
        <div class="disposisi-title">
          LEMBAR DISPOSISI BI ERP
        </div>

        <!-- TABEL PERIHAL & TANGGAL -->
        <table class="disposisi-table">
          <thead>
            <tr>
              <th style="width: 72%;">PERIHAL</th>
              <th style="width: 28%;">TANGGAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-transform: uppercase; line-height: 1.35; padding: 6px 8px;">
                {{ form.perihal || 'UJI COBA 1' }}
              </td>
              <td style="text-align: center; vertical-align: middle; padding: 6px 8px;">
                {{ formatFullDateIndo(form.tglTransaksi) || '01 Juli 2025' }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PENGANTAR ANGGARAN -->
        <p class="disposisi-p" style="margin: 8px 0 6px 0;">
          Mohon agar dilakukan proses pembayaran dengan rincian Akun Anggaran:
        </p>

        <!-- TABEL AKUN ANGGARAN & COA -->
        <table class="disposisi-table">
          <tbody>
            <tr>
              <td style="width: 32%; vertical-align: top;">
                Pembebanan Uker /<br>Satker
              </td>
              <td style="vertical-align: top;">
                <div style="display: flex; gap: 6px;">
                  <span>:</span>
                  <div>{{ form.bebanAnggaranUker || form.dariUker || form.pembebananSatker || 'Seksi Kehumasan' }}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">
                Deskripsi Hasil Akhir
              </td>
              <td style="vertical-align: top;">
                <div style="display: flex; gap: 6px;">
                  <span>:</span>
                  <div style="line-height: 1.35;">{{ form.deskripsiHasilAkhir || form.namaDha || form.perihal || 'Pelaksanaan kegiatan perpustakaan (pembelian buku, bedah buku, capacity building pustakawan) dalam rangka pengelolaan perpustakaan' }}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top;">
                Rangkaian COA
              </td>
              <td style="padding: 0; vertical-align: top;">
                <div style="display: flex;">
                  <span style="padding: 4px 6px 0 6px;">:</span>
                  <table style="width: 100%; border-collapse: collapse; margin: 0; border: none;">
                    <tbody>
                      <tr v-for="(coa, idx) in displayCoas" :key="'print-coa-' + idx" :style="idx < displayCoas.length - 1 ? 'border-bottom: 1px solid #000;' : ''">
                        <td style="border: none; padding: 4px 6px; font-family: 'Courier New', monospace; font-size: 8.5pt;">
                          {{ coa.rangkaianCoa }}
                        </td>
                        <td style="border: none; border-left: 1px solid #000; width: 130px; text-align: right; padding: 4px 6px; font-family: 'Courier New', monospace; font-size: 8.5pt;">
                          {{ formatNumCommas(coa.nominal) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PENUTUP -->
        <p class="disposisi-p" style="margin-top: 8px; margin-bottom: 2px;">
          Adapun dokumen pendukung terlampir (dokumen checklist dan kelengkapan dokumen lainnya)
        </p>
        <p class="disposisi-p" style="margin-top: 0; margin-bottom: 8px;">
          Atas perhatiannya kami ucapkan terima kasih.
        </p>

        <!-- TABEL TANDA TANGAN (BOX RESMI) -->
        <table class="disposisi-sign-table">
          <thead>
            <tr>
              <th style="width: 50%;">Yang Mengajukan</th>
              <th style="width: 50%;">Yang Menyetujui</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="disposisi-sign-space"></td>
              <td class="disposisi-sign-space"></td>
            </tr>
            <tr>
              <td>{{ form.yangMengajukan || 'Doni Prasetiyo' }}</td>
              <td>{{ form.yangMenyetujui || 'Niken Sih Wigati' }}</td>
            </tr>
            <tr>
              <td>{{ form.pangkatMengajukan || 'Manajer' }}</td>
              <td>{{ form.pangkatMenyetujui || 'Pelaksana' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= MODAL: MASTER DATA VIEW ================= -->
    <div class="modal-overlay" v-if="showMasterModal" @click.self="showMasterModal = false">
      <div class="modal-dialog-custom">
        <div class="modal-header-custom">
          <span><i class="bi bi-database me-2 text-primary"></i> Master Data: {{ masterModalTitle }}</span>
          <button class="btn btn-sm btn-link text-secondary" @click="showMasterModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <div v-if="masterModalType === 'rekanan'">
            <div v-for="r in rekananPresets" :key="r.nama" class="p-2 border rounded mb-2 bg-light">
              <div class="fw-bold">{{ r.nama }}</div>
              <div class="small text-muted">{{ r.alamat }} • NPWP: {{ r.nikNpwp }}</div>
              <div class="small text-primary mt-1">{{ r.bank }} - {{ r.rekening }} a.n {{ r.atasNama }}</div>
            </div>
          </div>
          <div v-else-if="masterModalType === 'dha'">
            <div v-for="d in dhaList" :key="d.nama" class="p-2 border rounded mb-2 bg-light">
              <div class="fw-bold">{{ d.nama }}</div>
              <div class="small text-success fw-bold">Saldo: {{ formatCurrency(d.saldo) }}</div>
            </div>
          </div>
          <div v-else-if="masterModalType === 'pejabat'">
            <div class="fw-bold small text-muted text-uppercase mb-2">Pejabat Pengaju:</div>
            <div v-for="p in pejabatPengajuList" :key="p.nama" class="p-2 border rounded mb-2 bg-light">
              <div class="fw-bold">{{ p.nama }}</div>
              <div class="small text-muted">{{ p.pangkat }}</div>
            </div>
            <div class="fw-bold small text-muted text-uppercase mt-3 mb-2">Pejabat Penyetuju:</div>
            <div v-for="p in pejabatPenyetujuList" :key="p.nama" class="p-2 border rounded mb-2 bg-light">
              <div class="fw-bold">{{ p.nama }}</div>
              <div class="small text-muted">{{ p.pangkat }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer-custom">
          <button class="btn-erp btn-erp-secondary" @click="showMasterModal = false">Tutup</button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: CHECKLIST KELENGKAPAN ================= -->
    <div class="modal-overlay" v-if="showChecklistModal" @click.self="showChecklistModal = false">
      <div class="modal-dialog-custom">
        <div class="modal-header-custom">
          <span><i class="bi bi-card-checklist text-primary"></i> Checklist Kelengkapan Dokumen Audit</span>
          <button class="btn btn-sm btn-link text-secondary" @click="showChecklistModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="text-muted" style="font-size: 0.825rem;">
            Pemeriksaan kelengkapan berkas fisik & kepatuhan sebelum pengeluaran dana:
          </p>

          <div v-for="item in checklistItems" :key="item.id" class="d-flex align-items-start gap-2 p-2 border rounded mb-2"
            :class="{ 'bg-light': item.checked }" style="cursor: pointer;" @click="item.checked = !item.checked">
            <input type="checkbox" class="form-check-input mt-1" :checked="item.checked" @click.stop="item.checked = !item.checked">
            <div>
              <div class="fw-bold" style="font-size: 0.85rem;">{{ item.title }}</div>
              <div class="text-muted" style="font-size: 0.75rem;">{{ item.desc }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer-custom">
          <button class="btn-erp btn-erp-secondary" @click="showChecklistModal = false">Tutup</button>
          <button class="btn-erp btn-erp-primary" @click="showChecklistModal = false; showToast('Checklist audit diperbarui!', 'success')">
            Konfirmasi Kelengkapan
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: KONFIRMASI REPLACE ================= -->
    <div class="modal-overlay" v-if="showReplaceModal" @click.self="showReplaceModal = false">
      <div class="modal-dialog-custom" style="max-width: 520px;">
        <div class="modal-header-custom text-primary">
          <span><i class="bi bi-arrow-repeat"></i> Konfirmasi Perbarui (Replace) Data Batch</span>
          <button class="btn btn-sm btn-link text-secondary" @click="showReplaceModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p style="font-size: 0.875rem;">
            Anda akan memperbarui record <strong>Batch {{ form.noBatch }}</strong> (No. Dokumen: {{ form.noDokumen }}).
          </p>
          <div class="p-2 bg-light border rounded" style="font-size: 0.8rem;">
            <div>Total Nominal Baru: <strong>{{ formatCurrency(totalNominalInvoice) }}</strong></div>
            <div>Rekanan: <strong>{{ form.namaRekanan }}</strong></div>
            <div>Status: <strong>{{ form.status }}</strong></div>
          </div>
          <p class="text-muted mt-2 mb-0" style="font-size: 0.75rem;">
            Perubahan akan dicatat dalam riwayat audit trail dengan identitas pengguna aktif.
          </p>
        </div>
        <div class="modal-footer-custom">
          <button class="btn-erp btn-erp-secondary" @click="showReplaceModal = false">Batal</button>
          <button class="btn-erp btn-erp-teal" @click="executeReplace">Ya, Perbarui Data</button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: KONFIRMASI DELETE ================= -->
    <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
      <div class="modal-dialog-custom" style="max-width: 460px;">
        <div class="modal-header-custom text-danger">
          <span><i class="bi bi-trash"></i> Konfirmasi Hapus Batch</span>
          <button class="btn btn-sm btn-link text-secondary" @click="showDeleteModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p style="font-size: 0.875rem;">
            Apakah Anda yakin ingin menghapus <strong>Batch {{ (batchToDelete && batchToDelete.noBatch) || form.noBatch }}</strong>?
          </p>
          <div v-if="batchToDelete" class="p-2 mb-2 rounded bg-light border text-start" style="font-size: 0.8rem;">
            <div v-if="batchToDelete.noDokumen"><strong>No. Dokumen:</strong> {{ batchToDelete.noDokumen }}</div>
            <div v-if="batchToDelete.perihal" class="text-truncate"><strong>Perihal:</strong> {{ batchToDelete.perihal }}</div>
            <div v-if="batchToDelete.tglTransaksi"><strong>Tanggal:</strong> {{ formatDateIndo(batchToDelete.tglTransaksi) }}</div>
          </div>
          <p class="text-muted mb-0" style="font-size: 0.775rem;">
            Sistem menerapkan soft-delete untuk menjaga jejak audit transaksi keuangan.
          </p>
        </div>
        <div class="modal-footer-custom">
          <button class="btn-erp btn-erp-secondary" @click="showDeleteModal = false">Batal</button>
          <button class="btn-erp btn-erp-danger" @click="executeDelete">Ya, Hapus Record</button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: DETAIL INVOICE AP ================= -->
    <div class="modal-overlay" v-if="showDetailModal && selectedDetailBatch" @click.self="closeDetailModal">
      <div class="modal-dialog-custom" style="max-width: 840px;">
        <div class="modal-header-custom text-primary d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <i class="bi bi-receipt-cutoff fs-5 text-primary"></i>
            <span class="fw-bold fs-6">Detail Transaksi • Batch {{ selectedDetailBatch.noBatch }}</span>
            <span class="badge-tag ms-2" :class="getBatchStatusBadgeClass(selectedDetailBatch.status)">
              <i class="bi" :class="(selectedDetailBatch.status === 'Disetujui' || selectedDetailBatch.status === 'Approved' || selectedDetailBatch.status === 'Selesai') ? 'bi-check-circle-fill' : (selectedDetailBatch.status === 'Ditolak' ? 'bi-x-circle-fill' : 'bi-clock-history')"></i>
              {{ selectedDetailBatch.status || 'Draft' }}
            </span>
          </div>
          <button class="btn btn-sm btn-link text-secondary" @click="closeDetailModal" title="Tutup">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom" style="max-height: 75vh; overflow-y: auto;">
          <!-- Info Dokumen & Satker -->
          <div class="p-3 mb-3 rounded border" style="background-color: #f8fafc;">
            <div class="row g-2">
              <div class="col-md-3">
                <div class="text-muted small">No. Batch</div>
                <div class="fw-bold font-monospace text-primary fs-6">{{ selectedDetailBatch.noBatch }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted small">No. Dokumen</div>
                <div class="fw-bold text-dark fs-6">{{ selectedDetailBatch.noDokumen || '-' }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted small">Tanggal Transaksi</div>
                <div class="fw-semibold text-dark">{{ formatDateIndo(selectedDetailBatch.tglTransaksi) }}</div>
              </div>
              <div class="col-md-3">
                <div class="text-muted small">Status Transaksi</div>
                <span class="badge-tag" :class="getBatchStatusBadgeClass(selectedDetailBatch.status)">
                  {{ selectedDetailBatch.status || 'Draft' }}
                </span>
              </div>
              <div class="col-12 mt-2">
                <div class="text-muted small">Perihal Transaksi</div>
                <div class="fw-semibold text-dark">{{ selectedDetailBatch.perihal || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Satuan Kerja & Beban Anggaran -->
          <div class="p-3 mb-3 rounded border bg-white">
            <div class="fw-bold text-dark small mb-2"><i class="bi bi-diagram-3 me-1 text-primary"></i> Satuan Kerja & Alokasi Beban</div>
            <div class="row g-2 small">
              <div class="col-md-4">
                <span class="text-muted">Satker Pengaju:</span>
                <div class="fw-semibold text-dark">{{ selectedDetailBatch.dariUker || '-' }}</div>
              </div>
              <div class="col-md-4">
                <span class="text-muted">Satker Tujuan:</span>
                <div class="fw-semibold text-dark">{{ selectedDetailBatch.kepadaUker || '-' }}</div>
              </div>
              <div class="col-md-4">
                <span class="text-muted">Beban Anggaran Uker:</span>
                <div class="fw-semibold text-dark">{{ selectedDetailBatch.bebanAnggaranUker || selectedDetailBatch.dariUker || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Rekanan & Rekening Bank -->
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <div class="card p-3 h-100 border bg-white shadow-none">
                <div class="fw-bold text-dark small mb-2"><i class="bi bi-building me-1 text-primary"></i> Data Rekanan / Vendor</div>
                <div class="small mb-1"><strong>Nama:</strong> {{ selectedDetailBatch.namaRekanan || '-' }}</div>
                <div class="small mb-1"><strong>NPWP:</strong> {{ selectedDetailBatch.nikNpwp || '-' }}</div>
                <div class="small mb-1" v-if="selectedDetailBatch.namaWpRekanan"><strong>Nama WP:</strong> {{ selectedDetailBatch.namaWpRekanan }}</div>
                <div class="small text-muted mb-2">{{ selectedDetailBatch.alamatRekanan || '-' }}</div>
                <div class="small text-muted border-top pt-2" v-if="selectedDetailBatch.noFakturPajak">
                  <strong>Faktur Pajak:</strong> {{ selectedDetailBatch.noFakturPajak }} ({{ formatDateIndo(selectedDetailBatch.tglFakturPajak) }})
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card p-3 h-100 border bg-white shadow-none">
                <div class="fw-bold text-dark small mb-2"><i class="bi bi-bank me-1 text-primary"></i> Rekening Tujuan Transfer</div>
                <div class="small mb-1"><strong>Metode/Tipe:</strong> <span class="badge-tag tag-navy py-0">{{ selectedDetailBatch.tipePembayaran || 'SKN' }}</span></div>
                <div class="small mb-1"><strong>Bank:</strong> {{ selectedDetailBatch.namaBank || '-' }}</div>
                <div class="small mb-1"><strong>No. Rekening:</strong> <code class="fw-bold fs-6">{{ selectedDetailBatch.nomorRekening || '-' }}</code></div>
                <div class="small"><strong>Atas Nama:</strong> {{ selectedDetailBatch.namaRekening || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Pembebanan Anggaran (DHA) & Tabel Alokasi COA -->
          <div class="p-3 mb-3 rounded border bg-white">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="fw-bold text-dark small"><i class="bi bi-pie-chart me-1 text-primary"></i> Rincian Alokasi Pembebanan Anggaran (COA)</div>
              <div class="small" v-if="selectedDetailBatch.namaDha">
                <span class="text-muted me-1">Pos DHA:</span>
                <span class="badge-tag tag-emerald">{{ selectedDetailBatch.namaDha }}</span>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-bordered small mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 50px; text-align: center;">No.</th>
                    <th>Rangkaian COA</th>
                    <th>Natural Akun</th>
                    <th style="width: 140px; text-align: right;">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="getDetailCoas(selectedDetailBatch).length === 0">
                    <td colspan="4" class="text-center py-2 text-muted">Belum ada rincian pembebanan COA</td>
                  </tr>
                  <tr v-for="(coa, cIdx) in getDetailCoas(selectedDetailBatch)" :key="'coa-' + cIdx">
                    <td style="text-align: center;">{{ cIdx + 1 }}</td>
                    <td class="font-monospace text-primary fw-semibold">{{ coa.rangkaianCoa || '-' }}</td>
                    <td class="text-dark">{{ coa.naturalAkun || '-' }}</td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
                      {{ formatCurrency(coa.nominal) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Rincian Kuitansi / Slot Invoice -->
          <div class="p-3 mb-3 rounded border bg-white">
            <div class="fw-bold text-dark small mb-2"><i class="bi bi-list-check me-1 text-primary"></i> Rincian Kuitansi / Invoice (Data Inputan)</div>
            <div class="table-responsive">
              <table class="table table-sm table-bordered small mb-2">
                <thead class="table-light">
                  <tr>
                    <th style="width: 50px; text-align: center;">No.</th>
                    <th>No. Invoice / Kuitansi</th>
                    <th>Tgl Invoice</th>
                    <th style="width: 140px; text-align: right;">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="getDetailInvoices(selectedDetailBatch).length === 0">
                    <td colspan="4" class="text-center py-2 text-muted">Belum ada rincian kuitansi/invoice</td>
                  </tr>
                  <tr v-for="(inv, idx) in getDetailInvoices(selectedDetailBatch)" :key="'inv-' + idx">
                    <td style="text-align: center;">{{ idx + 1 }}</td>
                    <td class="fw-semibold text-dark">{{ inv.noInvoice || '-' }}</td>
                    <td>{{ formatDateIndo(inv.tglInvoice) }}</td>
                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 600;">
                      {{ formatCurrency(inv.nominal) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="table-light fw-bold">
                    <td colspan="3" class="text-end">Total Nominal Invoice:</td>
                    <td style="text-align: right; font-family: var(--font-mono); color: #047857; font-size: 0.95rem;">
                      {{ formatCurrency(calcBatchTotal(selectedDetailBatch)) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="p-2 rounded bg-light small text-muted">
              Terbilang: <strong class="text-dark">{{ angkaKeTerbilang(calcBatchTotal(selectedDetailBatch)) }}</strong>
            </div>
          </div>

          <!-- Pejabat Penandatangan -->
          <div class="p-3 rounded border bg-white">
            <div class="fw-bold text-dark small mb-2"><i class="bi bi-person-check me-1 text-primary"></i> Pejabat Penandatangan Otorisasi</div>
            <div class="row g-2 small">
              <div class="col-md-6">
                <div class="p-2 border rounded bg-light">
                  <div class="text-muted" style="font-size: 0.72rem;">YANG MENGAJUKAN:</div>
                  <div class="fw-bold text-dark">{{ selectedDetailBatch.yangMengajukan || '-' }}</div>
                  <div class="text-muted" style="font-size: 0.72rem;">{{ selectedDetailBatch.pangkatMengajukan || 'Pelaksana' }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-2 border rounded bg-light">
                  <div class="text-muted" style="font-size: 0.72rem;">YANG MENYETUJUI:</div>
                  <div class="fw-bold text-dark">{{ selectedDetailBatch.yangMenyetujui || '-' }}</div>
                  <div class="text-muted" style="font-size: 0.72rem;">{{ selectedDetailBatch.pangkatMenyetujui || 'Asisten Manajer' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer-custom d-flex justify-content-between align-items-center">
          <button class="btn-erp btn-erp-secondary" @click="closeDetailModal">
            <i class="bi bi-x-lg me-1"></i> Tutup
          </button>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn-erp btn-erp-outline" @click="openPrintConfigModal" title="Pengaturan Cetak (Huruf, Margin, Kertas, Orientasi)">
              <i class="bi bi-gear me-1"></i> Atur Cetak
            </button>
            <button class="btn-erp btn-erp-teal" @click="closeDetailModal(); printBatchDetail(selectedDetailBatch)" title="Cetak Lembar Disposisi BI ERP">
              <i class="bi bi-printer me-1"></i> Cetak
            </button>
            <button class="btn-erp btn-erp-danger" @click="closeDetailModal(); rejectBatchDetail(selectedDetailBatch)" title="Tolak Transaksi Batch Ini">
              <i class="bi bi-x-circle me-1"></i> Ditolak
            </button>
            <button class="btn-erp btn-erp-success" @click="closeDetailModal(); approveBatchDetail(selectedDetailBatch)" title="Setujui Transaksi Batch Ini">
              <i class="bi bi-check-circle me-1"></i> Setujui
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: PENGATURAN CETAK (HURUF, MARGIN, UKURAN KERTAS, ORIENTASI) ================= -->
    <div class="modal-overlay" v-if="showPrintConfigModal" @click.self="closePrintConfigModal">
      <div class="modal-dialog-custom" style="max-width: 780px;">
        <div class="modal-header-custom text-primary d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-printer-fill fs-5 text-primary"></i>
            <div>
              <strong class="fs-6 d-block">Pengaturan Cetak & Tata Letak Dokumen</strong>
              <small class="text-muted" style="font-size: 0.75rem;">Konfigurasi jenis huruf, ukuran kertas, orientasi, dan margin lembar disposisi BI ERP</small>
            </div>
          </div>
          <button class="btn btn-sm btn-link text-secondary" @click="closePrintConfigModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body-custom" style="max-height: 75vh; overflow-y: auto;">
          <!-- 1. PENGATURAN JENIS & UKURAN HURUF -->
          <div class="p-3 mb-3 border rounded bg-light">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label class="form-label fw-bold text-dark small mb-0">
                <i class="bi bi-fonts text-primary me-1"></i> Jenis & Ukuran Huruf (Font Hasil Cetakan)
              </label>
              <span class="badge bg-primary text-white" style="font-size: 0.7rem;">Sesuai Standar BI</span>
            </div>

            <!-- Listbox Jenis Huruf dan Ukuran Huruf (Ukuran Toolbar Kompak) -->
            <div class="d-flex align-items-end gap-2 flex-wrap">
              <div style="width: 220px; max-width: 100%;">
                <label class="form-label small text-muted mb-1 fw-semibold d-block">Jenis Huruf (Font):</label>
                <select class="form-select form-select-sm shadow-sm" v-model="printSettings.fontFamily" @change="applyPrintSettingsToDOM()">
                  <option value="TimesNRCyrMT">TimesNRCyrMT</option>
                  <option value="Frutiger45 ligth">Frutiger45 ligth</option>
                  <option value="Arial">Arial</option>
                  <option value="sans-serif">sans-serif</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier new">Courier new</option>
                </select>
              </div>
              <div style="width: 85px;">
                <label class="form-label small text-muted mb-1 fw-semibold d-block text-center">Ukuran:</label>
                <select class="form-select form-select-sm shadow-sm text-center" v-model.number="printSettings.fontSize" @change="applyPrintSettingsToDOM()">
                  <option :value="8">8</option>
                  <option :value="8.5">8.5</option>
                  <option :value="9">9</option>
                  <option :value="9.5">9.5</option>
                  <option :value="10">10</option>
                  <option :value="10.5">10.5</option>
                  <option :value="11">11</option>
                  <option :value="12">12</option>
                  <option :value="14">14</option>
                  <option :value="16">16</option>
                  <option :value="18">18</option>
                  <option :value="20">20</option>
                </select>
              </div>
            </div>

            <!-- Live Preview Mini Contoh Font -->
            <div class="mt-2 p-2 border rounded bg-white d-flex align-items-center justify-content-between flex-wrap gap-1">
              <div :style="{ fontFamily: getFontFamilyCss(printSettings.fontFamily), fontSize: `${printSettings.fontSize || 11}pt` }" class="text-dark text-truncate">
                BANK INDONESIA • No. 310/UN25.1.4 • Rp 6.000.000
              </div>
              <span class="badge bg-light text-secondary border font-monospace ms-auto" style="font-size: 0.68rem; white-space: nowrap;">
                {{ printSettings.fontFamily }} • {{ printSettings.fontSize || 11 }}pt
              </span>
            </div>
          </div>

          <!-- 2. UKURAN KERTAS & ORIENTASI -->
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <div class="p-3 border rounded bg-light h-100">
                <label class="form-label fw-bold text-dark small mb-2">
                  <i class="bi bi-file-earmark-ruled text-primary me-1"></i> Ukuran Kertas
                </label>
                <select class="form-select form-select-sm" v-model="printSettings.paperSize" @change="applyPrintSettingsToDOM()">
                  <option value="A4">A4 (210 × 297 mm) — Standar BI</option>
                  <option value="F4">F4 / Folio (215 × 330 mm)</option>
                  <option value="Letter">Letter (215.9 × 279.4 mm)</option>
                  <option value="Legal">Legal (215.9 × 355.6 mm)</option>
                  <option value="A5">A5 (148 × 210 mm)</option>
                </select>
                <div class="text-muted mt-2" style="font-size: 0.72rem;">
                  Ukuran kertas menentukan dimensi target lembar cetak atau output berkas PDF.
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="p-3 border rounded bg-light h-100">
                <label class="form-label fw-bold text-dark small mb-2">
                  <i class="bi bi-compass text-primary me-1"></i> Orientasi Halaman
                </label>
                <div class="d-flex gap-2">
                  <button type="button" class="print-orientation-btn" :class="{ active: printSettings.orientation === 'portrait' }" @click="printSettings.orientation = 'portrait'; applyPrintSettingsToDOM();">
                    <i class="bi bi-file-earmark fs-5 d-block mb-1 text-primary"></i>
                    <span class="small d-block">Portrait</span>
                    <span class="text-muted" style="font-size: 0.68rem;">(Tegak)</span>
                  </button>
                  <button type="button" class="print-orientation-btn" :class="{ active: printSettings.orientation === 'landscape' }" @click="printSettings.orientation = 'landscape'; applyPrintSettingsToDOM();">
                    <i class="bi bi-file-earmark-landscape fs-5 d-block mb-1 text-primary"></i>
                    <span class="small d-block">Landscape</span>
                    <span class="text-muted" style="font-size: 0.68rem;">(Mendatar)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. PENGATURAN MARGIN -->
          <div class="p-3 mb-3 border rounded bg-light">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label class="form-label fw-bold text-dark small mb-0">
                <i class="bi bi-arrows-angle-expand text-primary me-1"></i> Pengaturan Margin Dokumen (Centimeter)
              </label>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'standar' ? 'btn-primary' : 'btn-outline-secondary'" @click="applyMarginPreset('standar')">
                  Standar BI (1.2 / 1.4 cm)
                </button>
                <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'sempit' ? 'btn-primary' : 'btn-outline-secondary'" @click="applyMarginPreset('sempit')">
                  Sempit (0.8 cm)
                </button>
                <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'sedang' ? 'btn-primary' : 'btn-outline-secondary'" @click="applyMarginPreset('sedang')">
                  Lebar (1.8 / 2.0 cm)
                </button>
                <button type="button" class="btn btn-sm" :class="printSettings.marginPreset === 'custom' ? 'btn-primary' : 'btn-outline-secondary'" @click="printSettings.marginPreset = 'custom'">
                  Kustom
                </button>
              </div>
            </div>

            <div class="row g-2 mt-1">
              <div class="col-6 col-md-3">
                <label class="form-label small mb-1">Atas (cm)</label>
                <div class="input-group input-group-sm">
                  <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginTop" @input="onCustomMarginChange" />
                  <span class="input-group-text">cm</span>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label small mb-1">Kanan (cm)</label>
                <div class="input-group input-group-sm">
                  <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginRight" @input="onCustomMarginChange" />
                  <span class="input-group-text">cm</span>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label small mb-1">Bawah (cm)</label>
                <div class="input-group input-group-sm">
                  <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginBottom" @input="onCustomMarginChange" />
                  <span class="input-group-text">cm</span>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label small mb-1">Kiri (cm)</label>
                <div class="input-group input-group-sm">
                  <input type="number" min="0" max="10" step="0.1" class="form-control text-center font-monospace" v-model.number="printSettings.marginLeft" @input="onCustomMarginChange" />
                  <span class="input-group-text">cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer-custom d-flex justify-content-between align-items-center">
          <button type="button" class="btn-erp btn-erp-secondary" @click="resetPrintSettings">
            <i class="bi bi-arrow-counterclockwise me-1"></i> Reset Standar
          </button>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn-erp btn-erp-secondary" @click="closePrintConfigModal">
              Tutup
            </button>
            <button type="button" class="btn-erp btn-erp-primary" @click="savePrintSettings">
              <i class="bi bi-check-lg me-1"></i> Simpan Pengaturan
            </button>
            <button type="button" class="btn-erp btn-erp-teal" @click="previewPrintDocument">
              <i class="bi bi-eye me-1"></i> Preview
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: FORM ISIAN DATA PEGAWAI ================= -->
    <div class="modal-overlay" v-if="showPegawaiModal" @click.self="showPegawaiModal = false">
      <div class="modal-dialog-custom" style="max-width: 600px;">
        <div class="modal-header-custom text-primary">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-person-vcard fs-5 text-primary"></i>
            <strong class="fs-6">{{ pegawaiFormMode === 'add' ? 'Form Tambah Data Pegawai' : 'Edit Data Pegawai' }}</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showPegawaiModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="text-muted small mb-3">
            Silakan lengkapi data master pegawai & pejabat Bank Indonesia untuk keperluan otorisasi transaksi:
          </p>
          <form @submit.prevent="savePegawai">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  NIP / Identitas Pegawai <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="pegawaiForm.nip" required
                  placeholder="Contoh: 19880412 201202 1 002" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  Nama Lengkap & Gelar <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="pegawaiForm.nama" required
                  placeholder="Contoh: Ahmad Fauzi, S.E." />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  Pangkat / Jabatan <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="pegawaiForm.pangkat" required
                  placeholder="Contoh: Pelaksana Madya Keuangan" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  Peran Otorisasi BI <span class="text-danger">*</span>
                </label>
                <select class="form-select form-select-sm" v-model="pegawaiForm.peran" required>
                  <option value="Pejabat Pengaju">Pejabat Pengaju</option>
                  <option value="Pejabat Penyetuju">Pejabat Penyetuju</option>
                  <option value="Staf Pelaksana Operasional">Staf Pelaksana Operasional</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1">
                  Unit Kerja / Satuan Kerja (Satker) <span class="text-danger">*</span>
                </label>
                <select class="form-select form-select-sm" v-model="pegawaiForm.uker" required>
                  <option v-for="u in ukerList" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">Status Kepegawaian</label>
                <select class="form-select form-select-sm" v-model="pegawaiForm.status">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                  <option value="Tugas Belajar / Mutasi">Tugas Belajar / Mutasi</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">Bank Rekening</label>
                <input type="text" class="form-control form-control-sm" v-model="pegawaiForm.bank"
                  placeholder="Contoh: PT. BANK CENTRAL ASIA, TBK" />
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1">Nomor Rekening</label>
                <input type="text" class="form-control form-control-sm font-monospace" v-model="pegawaiForm.noRek"
                  placeholder="Contoh: 0246190288" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showPegawaiModal = false">Batal</button>
          <button type="button" class="btn-erp btn-erp-primary" @click="savePegawai">
            <i class="bi bi-check-lg me-1"></i> {{ pegawaiFormMode === 'add' ? 'Simpan Data Pegawai' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: FORM ISIAN DATA BANK ================= -->
    <div class="modal-overlay" v-if="showBankModal" @click.self="showBankModal = false">
      <div class="modal-dialog-custom" style="max-width: 520px;">
        <div class="modal-header-custom text-primary">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-bank fs-5 text-primary"></i>
            <strong class="fs-6">{{ bankFormMode === 'add' ? 'Form Tambah Data Bank' : 'Edit Data Bank' }}</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showBankModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="text-muted small mb-3">
            Silakan lengkapi kode bank dan nama resmi bank operasional:
          </p>
          <form @submit.prevent="saveBank">
            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label fw-semibold small mb-1">
                  Kode / Sandi Bank <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm font-monospace" v-model="bankForm.kode" required
                  placeholder="Contoh: 014" />
              </div>
              <div class="col-md-7">
                <label class="form-label fw-semibold small mb-1">
                  Nama Bank <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="bankForm.nama" required
                  placeholder="Contoh: PT. BANK CENTRAL ASIA Tbk" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showBankModal = false">Batal</button>
          <button type="button" class="btn-erp btn-erp-primary" @click="saveBank">
            <i class="bi bi-check-lg me-1"></i> {{ bankFormMode === 'add' ? 'Simpan Data Bank' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: FORM ISIAN DATA REKANAN ================= -->
    <div class="modal-overlay" v-if="showRekananModal" @click.self="showRekananModal = false">
      <div class="modal-dialog-custom modal-dialog-visible" style="max-width: 620px;">
        <div class="modal-header-custom text-primary">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-building-add fs-5 text-primary"></i>
            <strong class="fs-6">{{ rekananFormMode === 'add' ? 'Form Tambah Data Rekanan' : 'Edit Data Rekanan' }}</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showRekananModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom modal-body-visible">
          <p class="text-muted small mb-3">
            Silakan lengkapi data penyedia / rekanan vendor Bank Indonesia untuk keperluan pembayaran transaksi:
          </p>
          <form @submit.prevent="saveRekanan">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1">
                  Nama Rekanan / Perusahaan / Lembaga <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="rekananForm.nama" required
                  placeholder="Contoh: CV. Sinergi Reborn Trans / Yayasan Peduli..." />
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1">
                  Alamat Lengkap Domisili / Usaha <span class="text-danger">*</span>
                </label>
                <textarea class="form-control form-control-sm" rows="2" v-model="rekananForm.alamat" required
                  placeholder="Contoh: Jl. Gajah Mada No. 45, Kaliwates, Jember"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  NIK / NPWP <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm font-monospace" v-model="rekananForm.nikNpwp" required
                  placeholder="Contoh: 01.234.567.8-654.000" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  Nama Wajib Pajak (Nama NPWP) <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="rekananForm.namaWp" required
                  placeholder="Contoh: CV. Sinergi Reborn Trans" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1" for="rekanan-bank-input">
                  Bank Rekening Tujuan <span class="text-danger">*</span>
                </label>
                <div class="partner-autocomplete partner-autocomplete-sm" @click.stop>
                  <div class="partner-autocomplete-input-wrap">
                    <input
                      id="rekanan-bank-input"
                      type="text"
                      class="partner-autocomplete-input"
                      :class="{ 'is-open': isRekananBankDropdownOpen }"
                      v-model="rekananBankSearchText"
                      @focus="openRekananBankDropdown"
                      @input="onRekananBankInput"
                      @keydown="onRekananBankKeydown"
                      placeholder="Cari atau pilih bank..."
                      autocomplete="off"
                      required
                    />
                    <div class="partner-autocomplete-actions">
                      <button
                        type="button"
                        class="partner-action-btn btn-clear"
                        v-if="rekananForm.bank || rekananBankSearchText"
                        @click.stop="clearRekananBank"
                        title="Hapus pilihan bank"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                      <button
                        type="button"
                        class="partner-action-btn btn-toggle"
                        @click.stop="toggleRekananBankDropdown"
                        tabindex="-1"
                        title="Buka / Tutup Daftar Bank"
                      >
                        <i class="bi" :class="isRekananBankDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Dropdown Menu Bank Rekening -->
                  <div class="partner-dropdown-menu rekanan-bank-dropdown-menu" v-if="isRekananBankDropdownOpen" @click.stop>
                    <div class="partner-dropdown-header">
                      <div class="d-flex align-items-center justify-content-between">
                        <span class="partner-header-text">
                          <i class="bi bi-bank me-1 text-primary"></i>
                          <strong>{{ filteredRekananBankOptions.length }}</strong> Bank tersedia
                        </span>
                        <span v-if="rekananBankSearchText" class="partner-filter-badge">
                          Filter: "{{ rekananBankSearchText }}"
                        </span>
                      </div>
                    </div>

                    <div class="partner-dropdown-list">
                      <div v-if="filteredRekananBankOptions.length === 0" class="partner-dropdown-empty">
                        <i class="bi bi-search d-block mb-1 fs-5 text-muted"></i>
                        <div>Tidak ada nama bank yang cocok</div>
                      </div>

                      <div
                        v-for="(item, idx) in displayedRekananBankOptions"
                        :key="item.kode || item.nama"
                        class="partner-dropdown-item"
                        :class="{
                          'is-selected': rekananForm.bank === item.nama,
                          'is-active': activeRekananBankIndex === idx
                        }"
                        @click="selectRekananBank(item)"
                        @mouseenter="activeRekananBankIndex = idx"
                      >
                        <div class="partner-item-icon-wrap">
                          <i class="bi bi-bank2 text-primary"></i>
                        </div>
                        <div class="partner-item-info">
                          <div class="partner-item-name">
                            <span>{{ item.nama }}</span>
                            <span v-if="item.kode" class="badge-tag tag-blue ms-1" style="font-size: 10px; padding: 1px 5px;">{{ item.kode }}</span>
                          </div>
                          <div class="partner-item-desc" v-if="item.jenis || item.singkatan">
                            <span v-if="item.singkatan">{{ item.singkatan }}</span>
                            <span v-if="item.jenis"> • {{ item.jenis }}</span>
                          </div>
                        </div>
                        <div class="partner-item-check" v-if="rekananForm.bank === item.nama">
                          <i class="bi bi-check-lg text-primary fw-bold fs-6"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">Nomor Rekening</label>
                <input type="text" class="form-control form-control-sm font-monospace" v-model="rekananForm.rekening"
                  placeholder="Contoh: 142-00-1928374-1" />
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1">Atas Nama Rekening</label>
                <input type="text" class="form-control form-control-sm" v-model="rekananForm.atasNama"
                  placeholder="Nama pemilik rekening bank (jika berbeda dengan nama rekanan)" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showRekananModal = false">Batal</button>
          <button type="button" class="btn-erp btn-erp-primary" @click="saveRekanan">
            <i class="bi bi-check-lg me-1"></i> {{ rekananFormMode === 'add' ? 'Simpan Data Rekanan' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: FORM ISIAN DATA MASTER DHA ================= -->
    <div class="modal-overlay" v-if="showDhaModal" @click.self="showDhaModal = false">
      <div class="modal-dialog-custom" style="max-width: 650px;">
        <div class="modal-header-custom text-primary">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-pie-chart-fill fs-5 text-primary"></i>
            <strong class="fs-6">{{ dhaFormMode === 'add' ? 'Form Tambah Data DHA' : 'Edit Data DHA' }}</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showDhaModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="text-muted small mb-3">
            Silakan lengkapi parameter Data Master DHA Bank Indonesia sesuai struktur himpunan anggaran:
          </p>
          <form @submit.prevent="saveDha">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1">
                  DHA (Uraian Kegiatan / Himpunan Anggaran) <span class="text-danger">*</span>
                </label>
                <textarea class="form-control form-control-sm" rows="2" v-model="dhaForm.dha" required
                  placeholder="Contoh: Pelaksanaan pengawasan KUPVA BB dalam rangka implementasi dan optimaliasi kel"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1">
                  Rangkaian COA <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm font-monospace" v-model="dhaForm.rangkaianCoa" required
                  placeholder="Contoh: 1-731001-713001-35-4100-063-011-040-8000-001-00000" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  ANGGARAN (Rp) <span class="text-danger">*</span>
                </label>
                <input type="text" inputmode="numeric" class="form-control form-control-sm font-monospace"
                  :value="formatRupiahInput(dhaForm.anggaran)"
                  @input="handleDhaAnggaranInput($event)"
                  @blur="handleDhaAnggaranBlur($event)"
                  @focus="handleNominalFocus($event)"
                  required placeholder="Contoh: Rp 1.119.622.455" />
                <div class="text-muted small mt-1 font-monospace" v-if="dhaForm.anggaran">
                  {{ formatCurrency(dhaForm.anggaran) }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  Natural Akun <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="dhaForm.naturalAkun" required
                  placeholder="Contoh: Penyediaan Sarana dan Prasarana Pendukung" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showDhaModal = false">Batal</button>
          <button type="button" class="btn-erp btn-erp-primary" @click="saveDha">
            <i class="bi bi-check-lg me-1"></i> {{ dhaFormMode === 'add' ? 'Simpan Data DHA' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: IMPORT EXCEL DATA MASTER DHA ================= -->
    <div class="modal-overlay" v-if="showImportDhaModal" @click.self="closeImportDhaModal">
      <div class="modal-dialog-custom modal-dialog-visible" style="max-width: 780px;">
        <div class="modal-header-custom text-success">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-file-earmark-excel-fill fs-5 text-success"></i>
            <strong class="fs-6">Impor Data Master DHA dari Excel</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="closeImportDhaModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <!-- Banner Petunjuk & Download Template -->
          <div class="alert alert-info py-2 px-3 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2 border-0 bg-info-subtle">
            <div class="small">
              <i class="bi bi-info-circle-fill me-1 text-info"></i>
              Gunakan file format <strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong> sesuai susunan kolom master DHA.
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary bg-white shadow-sm" @click="downloadDhaTemplate">
              <i class="bi bi-download me-1"></i> Unduh Template Excel
            </button>
          </div>

          <!-- Pilihan Mode Impor -->
          <div class="mb-3 p-3 border rounded bg-light">
            <label class="form-label fw-semibold small mb-2 text-dark">
              <i class="bi bi-gear me-1"></i> Mode Impor Data:
            </label>
            <div class="d-flex flex-wrap gap-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="dhaImportMode" id="modeUpsert" value="upsert" v-model="importDhaMode">
                <label class="form-check-label small" for="modeUpsert">
                  <strong>Sinkronisasi / Perbarui (Upsert) - Disarankan</strong>
                  <span class="text-muted d-block" style="font-size: 0.75rem;">Update jika data sudah ada, dan tambahkan baris baru</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="dhaImportMode" id="modeAppend" value="append" v-model="importDhaMode">
                <label class="form-check-label small" for="modeAppend">
                  <strong>Tambah / Gabung (Append)</strong>
                  <span class="text-muted d-block" style="font-size: 0.75rem;">Tambahkan baris baru ke master yang sudah ada</span>
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="dhaImportMode" id="modeReplace" value="replace" v-model="importDhaMode">
                <label class="form-check-label small" for="modeReplace">
                  <strong class="text-danger">Ganti Seluruh Data (Replace All)</strong>
                  <span class="text-muted d-block" style="font-size: 0.75rem;">Kosongkan master lama dan gantikan dengan file ini</span>
                </label>
              </div>
            </div>
          </div>

          <!-- File Upload Dropzone -->
          <div class="upload-dropzone p-4 text-center border border-2 border-dashed rounded mb-3 bg-white"
            style="border-color: #cbd5e1 !important; cursor: pointer;"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleFileDrop">
            <input type="file" ref="dhaFileInput" class="d-none" accept=".xlsx, .xls, .csv" @change="handleFileChange">
            <i class="bi bi-cloud-arrow-up text-success fs-1 mb-2 d-block"></i>
            <div class="fw-semibold text-dark">
              {{ importDhaFileName ? importDhaFileName : 'Pilih atau Tarik File Excel ke Sini' }}
            </div>
            <div class="text-muted small">
              Mendukung file .xlsx, .xls, atau .csv (maksimal 10 MB)
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary mt-2" @click.stop="triggerFileInput">
              <i class="bi bi-folder2-open me-1"></i> Telusuri File
            </button>
          </div>

          <!-- Error Alert jika format file bermasalah -->
          <div class="alert alert-danger py-2 px-3 small mb-3" v-if="importDhaError">
            <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ importDhaError }}
          </div>

          <!-- Preview Data Terdeteksi -->
          <div v-if="importDhaParsedData.length > 0">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="fw-semibold small text-dark">
                <i class="bi bi-table me-1"></i> Pratinjau Data Terdeteksi (5 Baris Pertama):
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge-tag tag-navy">{{ importDhaParsedData.length }} Baris Terbaca</span>
                <span class="badge-tag tag-emerald">Total {{ formatCurrency(importDhaTotalAnggaran) }}</span>
              </div>
            </div>
            <div class="table-responsive border rounded" style="max-height: 220px;">
              <table class="table table-sm table-striped table-hover mb-0" style="font-size: 0.78rem;">
                <thead class="table-light sticky-top">
                  <tr>
                    <th style="width: 40px;">No</th>
                    <th>DHA (Uraian Kegiatan)</th>
                    <th>Rangkaian COA</th>
                    <th style="text-align: right;">Anggaran</th>
                    <th>Natural Akun</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in importDhaPreviewRows" :key="idx">
                    <td>{{ idx + 1 }}</td>
                    <td class="fw-medium text-truncate" style="max-width: 250px;">{{ item.dha }}</td>
                    <td class="font-monospace">{{ item.rangkaianCoa }}</td>
                    <td style="text-align: right;" class="font-monospace fw-bold">{{ formatCurrency(item.anggaran) }}</td>
                    <td>{{ item.naturalAkun }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="text-muted small mt-1 text-end fst-italic" v-if="importDhaParsedData.length > 5">
              * Dan {{ importDhaParsedData.length - 5 }} baris data lainnya yang akan diimpor.
            </div>
          </div>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="closeImportDhaModal" :disabled="isImportingDha">
            Batal
          </button>
          <button type="button" class="btn-erp btn-erp-teal" @click="processImportDha" :disabled="importDhaParsedData.length === 0 || isImportingDha">
            <span v-if="isImportingDha" class="spinner-border spinner-border-sm me-1" role="status"></span>
            <i v-else class="bi bi-check-circle-fill me-1"></i>
            {{ isImportingDha ? 'Mengimpor Data...' : `Mulai Impor (${importDhaParsedData.length} Data)` }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: FORM ISIAN DATA UNIT KERJA ================= -->
    <div class="modal-overlay" v-if="showUnitKerjaModal" @click.self="showUnitKerjaModal = false">
      <div class="modal-dialog-custom" style="max-width: 520px;">
        <div class="modal-header-custom text-primary">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-diagram-3 fs-5 text-primary"></i>
            <strong class="fs-6">{{ unitKerjaFormMode === 'add' ? 'Form Tambah Data Unit Kerja' : 'Edit Data Unit Kerja' }}</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showUnitKerjaModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="text-muted small mb-3">
            Silakan lengkapi kode unit dan nama unit kerja operasional Bank Indonesia:
          </p>
          <form @submit.prevent="saveUnitKerja">
            <div class="row g-3">
              <div class="col-md-5">
                <label class="form-label fw-semibold small mb-1">
                  Kode Unit
                </label>
                <input type="text" class="form-control form-control-sm font-monospace text-uppercase" v-model="unitKerjaForm.kode_unit"
                  placeholder="Contoh: FDSEK" />
              </div>
              <div class="col-md-7">
                <label class="form-label fw-semibold small mb-1">
                  Nama Unit Kerja <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="unitKerjaForm.nama_unit" required
                  placeholder="Contoh: Unit Manajemen Keuangan KPw BI Jember" />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showUnitKerjaModal = false">Batal</button>
          <button type="button" class="btn-erp btn-erp-primary" @click="saveUnitKerja">
            <i class="bi bi-check-lg me-1"></i> {{ unitKerjaFormMode === 'add' ? 'Simpan Unit Kerja' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: FORM ISIAN PENGGUNA & HAK AKSES ================= -->
    <div class="modal-overlay" v-if="showUserModal" @click.self="showUserModal = false">
      <div class="modal-dialog-custom" style="max-width: 600px;">
        <div class="modal-header-custom text-primary">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-person-fill-gear fs-5 text-primary"></i>
            <strong class="fs-6">{{ userFormMode === 'add' ? 'Tambah Akun Pengguna Baru' : 'Edit Akun Pengguna' }}</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showUserModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="text-muted small mb-3">
            Lengkapi data profil operator, penetapan wewenang role, dan kredensial login aplikasi:
          </p>
          <form @submit.prevent="saveUser">
            <div class="row g-3">
              <!-- Baris 1: Nama Lengkap & Username Akun -->
              <div class="col-md-7">
                <label class="form-label fw-semibold small mb-1">
                  Nama Lengkap <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control form-control-sm" v-model="userForm.namaLengkap" required
                  placeholder="Contoh: Mochamad Hadi Sarosa" />
              </div>
              <div class="col-md-5">
                <label class="form-label fw-semibold small mb-1">
                  Username Akun <span class="text-danger">*</span>
                </label>
                <div class="input-group input-group-sm">
                  <span class="input-group-text">@</span>
                  <input type="text" class="form-control font-monospace" v-model="userForm.username" required
                    placeholder="hadi.sarosa" :disabled="userFormMode === 'edit'" />
                </div>
              </div>

              <!-- Baris 2: Role Wewenang & Status Akun Akses -->
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  Role Wewenang (RBAC) <span class="text-danger">*</span>
                </label>
                <select class="form-select form-select-sm" v-model="userForm.roleKey" required>
                  <option v-for="r in userRoles" :key="r.key" :value="r.key">
                    {{ r.name }}
                  </option>
                </select>
                <div class="text-muted small mt-1" style="font-size: 0.73rem;">
                  {{ (userRoles.find(r => r.key === userForm.roleKey) || {}).description }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small mb-1">
                  Status Akun Akses <span class="text-danger" v-if="userForm.roleKey !== 'super_admin'">*</span>
                </label>
                <select class="form-select form-select-sm" v-model="userForm.status"
                  :disabled="userForm.roleKey === 'super_admin'" required>
                  <option value="Aktif">Aktif (Diberi Izin Masuk)</option>
                  <option value="Terkunci" :disabled="userForm.roleKey === 'super_admin'">Terkunci (Akses Ditangguhkan)</option>
                </select>
                <div v-if="userForm.roleKey === 'super_admin'" class="text-success small mt-1 fw-semibold" style="font-size: 0.73rem;">
                  <i class="bi bi-shield-check me-1"></i>Otomatis Aktif untuk Super Admin
                </div>
              </div>

              <!-- Baris 3: NIP & Email Dinas (Disabled jika Super Admin) -->
              <div class="col-md-5">
                <label class="form-label fw-semibold small mb-1" :class="userForm.roleKey === 'super_admin' ? 'text-muted' : ''">
                  NIP / Identitas Pegawai
                  <span v-if="userForm.roleKey === 'super_admin'" class="badge bg-light text-secondary border ms-1" style="font-size: 0.65rem;">Disabled</span>
                </label>
                <input type="text" class="form-control form-control-sm font-monospace" v-model="userForm.nip"
                  :disabled="userForm.roleKey === 'super_admin'"
                  :placeholder="userForm.roleKey === 'super_admin' ? 'Nonaktif untuk Super Admin' : '19920314 201801 1 001'" />
              </div>
              <div class="col-md-7">
                <label class="form-label fw-semibold small mb-1" :class="userForm.roleKey === 'super_admin' ? 'text-muted' : ''">
                  Email Dinas Bank Indonesia <span class="text-danger" v-if="userForm.roleKey !== 'super_admin'">*</span>
                  <span v-if="userForm.roleKey === 'super_admin'" class="badge bg-light text-secondary border ms-1" style="font-size: 0.65rem;">Disabled</span>
                </label>
                <input type="email" class="form-control form-control-sm" v-model="userForm.email"
                  :required="userForm.roleKey !== 'super_admin'"
                  :disabled="userForm.roleKey === 'super_admin'"
                  :placeholder="userForm.roleKey === 'super_admin' ? 'Nonaktif untuk Super Admin' : 'hadi.sarosa@bi.go.id'" />
              </div>

              <!-- Baris 4: Satuan Kerja (Disabled jika Super Admin) -->
              <div class="col-12">
                <label class="form-label fw-semibold small mb-1" :class="userForm.roleKey === 'super_admin' ? 'text-muted' : ''">
                  Satuan Kerja / Unit Kerja <span class="text-danger" v-if="userForm.roleKey !== 'super_admin'">*</span>
                  <span v-if="userForm.roleKey === 'super_admin'" class="badge bg-light text-secondary border ms-1" style="font-size: 0.65rem;">Disabled</span>
                </label>
                <select class="form-select form-select-sm" v-model="userForm.satker"
                  :required="userForm.roleKey !== 'super_admin'"
                  :disabled="userForm.roleKey === 'super_admin'">
                  <option v-if="userForm.roleKey === 'super_admin'" value="Seluruh Satuan Kerja (Administrator Sistem)">
                    Seluruh Satuan Kerja (Administrator Sistem)
                  </option>
                  <option v-for="u in ukerList" :key="u" :value="u">{{ u }}</option>
                </select>
              </div>

              <!-- Baris 5: Kata Sandi Awal (Hanya di mode Tambah Pengguna Baru) -->
              <div class="col-12" v-if="userFormMode === 'add'">
                <label class="form-label fw-semibold small mb-1">
                  Kata Sandi Awal <span class="text-danger">*</span>
                </label>
                <input type="password" class="form-control form-control-sm font-monospace" v-model="userForm.password"
                  placeholder="Minimal 8 karakter..." required />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showUserModal = false">Batal</button>
          <button type="button" class="btn-erp btn-erp-primary" @click="saveUser">
            <i class="bi bi-check-lg me-1"></i> {{ userFormMode === 'add' ? 'Simpan Pengguna Baru' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: RESET PASSWORD PENGGUNA ================= -->
    <div class="modal-overlay" v-if="showResetPasswordModal" @click.self="showResetPasswordModal = false">
      <div class="modal-dialog-custom" style="max-width: 480px;">
        <div class="modal-header-custom text-warning">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-key-fill fs-5 text-warning"></i>
            <strong class="fs-6 text-dark">Reset Kata Sandi Pengguna</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showResetPasswordModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <div v-if="resetPasswordTargetUser" class="p-3 bg-light rounded border mb-3">
            <div class="d-flex align-items-center gap-2">
              <div class="user-avatar-circle" style="width: 38px; height: 38px; font-size: 1rem;">
                <span>{{ (resetPasswordTargetUser.namaLengkap || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <div class="fw-bold text-dark">{{ resetPasswordTargetUser.namaLengkap }}</div>
                <div class="text-muted small font-monospace">@{{ resetPasswordTargetUser.username }} &bull; {{ resetPasswordTargetUser.email }}</div>
              </div>
            </div>
          </div>
          <p class="text-muted small mb-3">
            Masukkan kata sandi baru untuk mengatur ulang akses login pengguna ini:
          </p>
          <form @submit.prevent="saveResetPassword">
            <div class="mb-3">
              <label class="form-label fw-semibold small mb-1">
                Kata Sandi Baru <span class="text-danger">*</span>
              </label>
              <input type="password" class="form-control form-control-sm font-monospace" v-model="resetPasswordForm.password"
                placeholder="Masukkan kata sandi baru..." required />
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small mb-1">
                Konfirmasi Kata Sandi Baru <span class="text-danger">*</span>
              </label>
              <input type="password" class="form-control form-control-sm font-monospace" v-model="resetPasswordForm.confirmPassword"
                placeholder="Ulangi kata sandi baru..." required />
            </div>
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="forceChange" v-model="resetPasswordForm.forceChangeOnLogin" />
              <label class="form-check-label small" for="forceChange">
                Wajibkan pengguna mengganti kata sandi saat pertama kali login
              </label>
            </div>
          </form>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showResetPasswordModal = false">Batal</button>
          <button type="button" class="btn-erp btn-erp-primary" @click="saveResetPassword">
            <i class="bi bi-shield-check me-1"></i> Perbarui Kata Sandi
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: KONFIRMASI HAPUS PENGGUNA ================= -->
    <div class="modal-overlay" v-if="showDeleteUserModal" @click.self="showDeleteUserModal = false">
      <div class="modal-dialog-custom" style="max-width: 460px;">
        <div class="modal-header-custom text-danger">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-trash-fill fs-5 text-danger"></i>
            <strong class="fs-6 text-dark">Konfirmasi Hapus Pengguna</strong>
          </span>
          <button class="btn btn-sm btn-link text-secondary" @click="showDeleteUserModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body-custom">
          <p class="text-secondary small mb-3">
            Apakah Anda yakin ingin menghapus akun pengguna berikut dari sistem aplikasi?
          </p>
          <div v-if="userToDelete" class="p-3 bg-light rounded border mb-3">
            <div class="d-flex align-items-center gap-3">
              <div class="user-avatar-circle" style="width: 44px; height: 44px; font-size: 1.15rem;">
                <span>{{ (userToDelete.namaLengkap || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-dark">{{ userToDelete.namaLengkap }}</div>
                <div class="text-muted small font-monospace">@{{ userToDelete.username }}</div>
                <div class="d-flex align-items-center gap-2 mt-1">
                  <span class="badge-tag" :class="getRoleBadgeClass(userToDelete.roleKey)">{{ userToDelete.roleName || userToDelete.roleKey }}</span>
                  <span class="badge bg-light text-secondary border font-monospace" style="font-size: 0.7rem;">{{ userToDelete.status }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="alert alert-warning py-2 px-3 small d-flex align-items-center gap-2 mb-0">
            <i class="bi bi-exclamation-triangle-fill text-warning fs-5"></i>
            <div>Akun yang dihapus tidak akan dapat masuk kembali ke sistem PERKUSI.</div>
          </div>
        </div>
        <div class="modal-footer-custom">
          <button type="button" class="btn-erp btn-erp-secondary" @click="showDeleteUserModal = false">Batal</button>
          <button type="button" class="btn btn-danger btn-sm px-3" @click="confirmDeleteUser">
            <i class="bi bi-trash me-1"></i> Ya, Hapus Pengguna
          </button>
        </div>
      </div>
    </div>

    </div>

    <!-- ================= TOAST NOTIFICATIONS (Enterprise Modern Style) ================= -->
    <div class="toast-container no-print" role="alert" aria-live="polite">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast-message"
        :class="'toast-' + (t.type || 'success')"
        @click="removeToast(t.id)"
      >
        <div class="toast-content">
          <i v-if="t.type === 'success' || t.type === 'logout' || !t.type" class="bi bi-check-circle toast-icon"></i>
          <i v-else-if="t.type === 'warning'" class="bi bi-exclamation-circle toast-icon"></i>
          <i v-else-if="t.type === 'error'" class="bi bi-x-circle toast-icon"></i>
          <i v-else class="bi bi-info-circle toast-icon"></i>
          <span class="toast-text">{{ t.message }}</span>
        </div>
        <button type="button" class="toast-close-btn" @click.stop="removeToast(t.id)" aria-label="Tutup">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import Swal from 'sweetalert2';
import LoginPage from './components/LoginPage.vue';
import {
  checkBackendHealth,
  getMasters,
  getBatches,
  checkDocumentDuplicate,
  createBatchApi,
  updateBatchApi,
  updateBatchStatusApi,
  deleteBatchApi,
  getPegawaiApi,
  createPegawaiApi,
  updatePegawaiApi,
  deletePegawaiApi,
  getBanksApi,
  createBankApi,
  updateBankApi,
  deleteBankApi,
  getUnitKerjaApi,
  createUnitKerjaApi,
  updateUnitKerjaApi,
  deleteUnitKerjaApi,
  getRekananApi,
  createRekananApi,
  updateRekananApi,
  deleteRekananApi,
  getDhaApi,
  createDhaApi,
  updateDhaApi,
  deleteDhaApi,
  importDhaApi,
  getRbacMatrixApi,
  updateRbacMatrixApi,
  resetRbacMatrixApi
} from './services/api.js';

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

export default {
  name: 'BiErpApp',
  components: {
    LoginPage
  },
  setup() {
    // Authentication State
    const isLoggedIn = ref(false);

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

    // Current Active View: 'dashboard', 'form', 'table', 'print', etc.
    const initialViewFromUrl = getViewFromUrl();
    const currentView = ref(initialViewFromUrl || 'dashboard');
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

    const settingTab = ref('profil');
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
      if (selectedDetailBatch && selectedDetailBatch.value) {
        loadBatchToForm(selectedDetailBatch.value);
      }
      setTimeout(() => {
        window.print();
      }, 50);
    }

    // Users & Access Control (RBAC)
    const userSubTab = ref('list'); // 'list', 'matrix', 'security'
    const userSearchKeyword = ref('');
    const userRoleFilter = ref('');
    const userStatusFilter = ref('');
    const showUserModal = ref(false);
    const userFormMode = ref('add'); // 'add' or 'edit'
    const showResetPasswordModal = ref(false);
    const resetPasswordTargetUser = ref(null);
    const showDeleteUserModal = ref(false);
    const userToDelete = ref(null);
    const resetPasswordForm = reactive({
      password: '',
      confirmPassword: '',
      forceChangeOnLogin: true
    });

    const userForm = reactive({
      id: null,
      username: '',
      namaLengkap: '',
      nip: '',
      email: '',
      satker: 'Unit Manajemen Keuangan KPw BI Jember',
      roleKey: 'maker',
      password: '',
      status: 'Aktif'
    });

    const securityPolicy = reactive({
      authProvider: 'local', // 'local' or 'sso'
      sessionTimeoutMinutes: '30',
      maxFailedAttempts: '3',
      requireMinLength: true,
      requireAlphaNumeric: true,
      forcePasswordChange90Days: false,
      logLoginAttempts: true
    });

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

    const isMatrixDirty = ref(false);
    const matrixSearchKeyword = ref('');
    const matrixRoleFilter = ref('');

    // Load initial matrix from localStorage or default
    let savedMatrix = null;
    try {
      const stored = localStorage.getItem('bi_erp_rbac_matrix');
      if (stored) savedMatrix = JSON.parse(stored);
    } catch (_) {}

    const rbacMatrixItems = ref(Array.isArray(savedMatrix) && savedMatrix.length > 0 ? savedMatrix : JSON.parse(JSON.stringify(DEFAULT_RBAC_MATRIX)));

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
        showToast('Wewenang Manajemen Pengguna untuk Super Admin tidak boleh dikunci untuk mencegah lockout.', 'warning');
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
        if (typeof updateRbacMatrixApi === 'function') {
          await updateRbacMatrixApi(rbacMatrixItems.value).catch(() => null);
        }
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
        if (typeof resetRbacMatrixApi === 'function') {
          await resetRbacMatrixApi().catch(() => null);
        }
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

    const usersList = ref([
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
        createdAt: '2025-01-15'
      },
      {
        id: 4,
        username: 'budi.santoso',
        namaLengkap: 'Budi Santoso, S.E., M.M.',
        nip: '19760820 200003 1 001',
        email: 'budi.santoso@bi.go.id',
        satker: 'Unit Manajemen Keuangan KPw BI Jember',
        roleKey: 'approver',
        roleName: 'Approver (Pejabat Penyetuju)',
        status: 'Aktif',
        lastLogin: '3 hari lalu',
        createdAt: '2025-01-10'
      },
      {
        id: 5,
        username: 'dewi.lestari',
        namaLengkap: 'Dewi Lestari, S.E., Ak.',
        nip: '19890710 201302 2 001',
        email: 'dewi.lestari@bi.go.id',
        satker: 'Seksi Kepatuhan & Manajemen Risiko',
        roleKey: 'auditor',
        roleName: 'Auditor (Pengawas Keuangan)',
        status: 'Aktif',
        lastLogin: '1 minggu lalu',
        createdAt: '2025-02-01'
      }
    ]);

    const filteredUsersList = computed(() => {
      let list = [...usersList.value];
      if (userRoleFilter.value) {
        list = list.filter(u => u.roleKey === userRoleFilter.value);
      }
      if (userStatusFilter.value) {
        list = list.filter(u => u.status === userStatusFilter.value);
      }
      if (userSearchKeyword.value.trim()) {
        const q = userSearchKeyword.value.toLowerCase().trim();
        list = list.filter(u =>
          (u.namaLengkap && u.namaLengkap.toLowerCase().includes(q)) ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.nip && u.nip.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.satker && u.satker.toLowerCase().includes(q))
        );
      }
      return list;
    });

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

    // Master Presets
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

    const rekananPresets = ref([
      {
        id: 1,
        nama: 'CV Surya Mandiri Jember',
        alamat: 'Jl. Gajah Mada No. 45, Jember',
        nikNpwp: '01.234.567.8-654.000',
        namaWp: 'CV Surya Mandiri Jember',
        bank: 'Bank Mandiri',
        rekening: '1430019283741',
        atasNama: 'CV Surya Mandiri Jember'
      },
      {
        id: 2,
        nama: 'PT Graha Mitra Sarana',
        alamat: 'Jl. Hayam Wuruk No. 12, Jember',
        nikNpwp: '02.345.678.9-654.000',
        namaWp: 'PT Graha Mitra Sarana',
        bank: 'Bank Rakyat Indonesia (BRI)',
        rekening: '002101002345501',
        atasNama: 'PT Graha Mitra Sarana'
      },
      {
        id: 3,
        nama: 'PT Kencana Perkasa Abadi',
        alamat: 'Jl. Kalimantan No. 88, Jember',
        nikNpwp: '03.456.789.0-654.000',
        namaWp: 'PT Kencana Perkasa Abadi',
        bank: 'Bank Central Asia (BCA)',
        rekening: '0351982734',
        atasNama: 'PT Kencana Perkasa Abadi'
      },
      {
        id: 4,
        nama: 'CV Pandawa Cipta Karya',
        alamat: 'Jl. Trunojoyo No. 15, Jember',
        nikNpwp: '04.567.890.1-654.000',
        namaWp: 'CV Pandawa Cipta Karya',
        bank: 'Bank Jatim',
        rekening: '0032049581',
        atasNama: 'CV Pandawa Cipta Karya'
      },
      {
        id: 5,
        nama: 'PT Indotech Pratama Solusindo',
        alamat: 'Jl. PB Sudirman No. 70, Jember',
        nikNpwp: '05.678.901.2-654.000',
        namaWp: 'PT Indotech Pratama Solusindo',
        bank: 'Bank Negara Indonesia (BNI)',
        rekening: '0238491823',
        atasNama: 'PT Indotech Pratama Solusindo'
      }
    ]);

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

    const dhaList = ref([
      {
        id: 1,
        dha: 'DHA/2025/KEU-01 - Beban Operasional Kantor & Rumah Tangga',
        nama: 'DHA/2025/KEU-01 - Beban Operasional Kantor & Rumah Tangga',
        rangkaianCoa: '5.1.03.01',
        anggaran: 750000000,
        saldo: 520000000,
        paguAwal: 750000000,
        naturalAkun: '5.1.03 - Beban Rumah Tangga & Utilitas'
      },
      {
        id: 2,
        dha: 'DHA/2025/PUR-02 - Penyelenggaraan Kas Keliling & Sosialisasi Rupiah',
        nama: 'DHA/2025/PUR-02 - Penyelenggaraan Kas Keliling & Sosialisasi Rupiah',
        rangkaianCoa: '5.1.02.04',
        anggaran: 450000000,
        saldo: 310000000,
        paguAwal: 450000000,
        naturalAkun: '5.1.02 - Beban Transportasi & Kegiatan Kas'
      },
      {
        id: 3,
        dha: 'DHA/2025/UMKM-03 - Fasilitasi Pengembangan Klaster UMKM Binaan BI',
        nama: 'DHA/2025/UMKM-03 - Fasilitasi Pengembangan Klaster UMKM Binaan BI',
        rangkaianCoa: '5.1.04.02',
        anggaran: 600000000,
        saldo: 485000000,
        paguAwal: 600000000,
        naturalAkun: '5.1.04 - Beban Fasilitasi Program UMKM'
      },
      {
        id: 4,
        dha: 'DHA/2025/KOM-04 - Komunikasi Kebijakan & Diseminasi Kajian Ekonomi',
        nama: 'DHA/2025/KOM-04 - Komunikasi Kebijakan & Diseminasi Kajian Ekonomi',
        rangkaianCoa: '5.1.05.01',
        anggaran: 350000000,
        saldo: 215000000,
        paguAwal: 350000000,
        naturalAkun: '5.1.05 - Beban Publikasi & Acara Media'
      },
      {
        id: 5,
        dha: 'DHA/2025/PSBI-05 - Program Sosial Bank Indonesia (PSBI) & Kepedulian',
        nama: 'DHA/2025/PSBI-05 - Program Sosial Bank Indonesia (PSBI) & Kepedulian',
        rangkaianCoa: '5.2.01.05',
        anggaran: 800000000,
        saldo: 640000000,
        paguAwal: 800000000,
        naturalAkun: '5.2.01 - Beban Bantuan Sosial Program Prioritas'
      }
    ]);

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

    // Form Model
    const form = reactive({
      id: null,
      noBatch: '',
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

      noPerintahBayar: '',
      penarikanUangMuka: 0,
      deskripsiHasilAkhir: '',
      pembebananSatker: 'KPwDN Jember',

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
          { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
          { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
          { rangkaianCoa: '', naturalAkun: '', nominal: 0 }
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
          { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
          { rangkaianCoa: '', naturalAkun: '', nominal: 0 },
          { rangkaianCoa: '', naturalAkun: '', nominal: 0 }
        ]
      }
    ];

    const cachedBatches = localStorage.getItem('bi_erp_batches');
    const batchList = ref(cachedBatches ? JSON.parse(cachedBatches) : JSON.parse(JSON.stringify(initialBatches)));

    watch(batchList, (newVal) => {
      localStorage.setItem('bi_erp_batches', JSON.stringify(newVal));
    }, { deep: true });

    function generateNextBatchNo() {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const prefix = `BT${currentYear}-`;
      let maxNum = 0;
      if (Array.isArray(batchList.value)) {
        for (const b of batchList.value) {
          const bNo = b.noBatch || b.batch || '';
          if (bNo.startsWith(prefix)) {
            const num = parseInt(bNo.replace(prefix, ''), 10);
            if (!isNaN(num) && num > maxNum) {
              maxNum = num;
            }
          }
        }
      }
      const next = maxNum + 1;
      return `${prefix}${String(next).padStart(4, '0')}`;
    }

    // Inisialisasi nomor batch baru yang belum pernah digunakan
    if (!form.noBatch) {
      form.noBatch = generateNextBatchNo();
    }

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
      try {
        if (typeof v === 'string') {
          const match = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (match) {
            return `${match[3]}/${match[2]}/${match[1]}`;
          }
        }
        const d = new Date(v.includes && v.includes('T') ? v : v + 'T00:00:00');
        if (isNaN(d.getTime())) return String(v);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (err) {
        return String(v);
      }
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
      form.noBatch = generateNextBatchNo();
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
          let res;
          const payload = JSON.parse(JSON.stringify(form));
          payload.nominalTotal = invoiceTotal.value;
          if (form.id) {
            res = await updateBatchApi(form.id, payload);
          } else {
            res = await createBatchApi(payload);
            if (res.data && res.data.id) form.id = res.data.id;
            if (res.data && res.data.noBatch) form.noBatch = res.data.noBatch;
          }
          const batchRes = await getBatches();
          if (batchRes && batchRes.data) {
            batchList.value = batchRes.data;
            localStorage.setItem('bi_erp_batches', JSON.stringify(batchRes.data));
          }
          showToast(res.message || `Draft batch ${form.noBatch} berhasil disimpan ke database!`, 'success');
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
          localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
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
          let res;
          const payload = JSON.parse(JSON.stringify(form));
          payload.namaRekanan = form.namaRekanan;
          payload.status = 'Menunggu proses';
          payload.nominalTotal = totInv;
          payload.nominal = totInv;

          if (form.id) {
            res = await updateBatchApi(form.id, payload);
          } else {
            res = await createBatchApi(payload);
            if (res.data && res.data.id) form.id = res.data.id;
            if (res.data && res.data.noBatch) form.noBatch = res.data.noBatch;
          }

          const batchRes = await getBatches();
          if (batchRes && batchRes.data && batchRes.data.length > 0) {
            batchList.value = batchRes.data;
            localStorage.setItem('bi_erp_batches', JSON.stringify(batchRes.data));
          }

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
          localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
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
      form.yangMengajukan = b.yangMengajukan || '';
      form.pangkatMengajukan = b.pangkatMengajukan || '';
      form.yangMenyetujui = b.yangMenyetujui || '';
      form.pangkatMenyetujui = b.pangkatMenyetujui || '';
      pengajuSearchText.value = form.yangMengajukan;
      penyetujuSearchText.value = form.yangMenyetujui;
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

    const handlePopState = (event) => {
      const v = (event && event.state && event.state.view) || getViewFromUrl();
      if (v && validViews.includes(v)) {
        currentView.value = v;
        ensureMenuOpenForView(v);
      } else if (!v) {
        currentView.value = 'dashboard';
      }
    };

    // Check backend connection
    onMounted(async () => {
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
        loadUsersFromStorage();
        fetchUsers();
      } catch (e) {}

      // Ambil cache lokal jika ada sebelumnya
      const cached = localStorage.getItem('bi_erp_batches');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            batchList.value = parsed;
          }
        } catch (e) {}
      }

      // Ambil cache lokal master data jika ada sebelumnya
      const cachedMasters = localStorage.getItem('bi_erp_cached_masters');
      if (cachedMasters) {
        try {
          const parsedM = JSON.parse(cachedMasters);
          if (parsedM.pegawaiList && parsedM.pegawaiList.length > 0 && pegawaiList.value.length === 0) pegawaiList.value = parsedM.pegawaiList;
          if (parsedM.masterBankList && parsedM.masterBankList.length > 0 && masterBankList.value.length === 0) masterBankList.value = parsedM.masterBankList;
          if (parsedM.rekananPresets && parsedM.rekananPresets.length > 0 && rekananPresets.value.length === 0) rekananPresets.value = parsedM.rekananPresets;
          if (parsedM.dhaList && parsedM.dhaList.length > 0 && dhaList.value.length === 0) dhaList.value = parsedM.dhaList;
          if (parsedM.masterUnitKerjaList && parsedM.masterUnitKerjaList.length > 0) masterUnitKerjaList.value = parsedM.masterUnitKerjaList;
        } catch (e) {}
      }

      const healthy = await checkBackendHealth();
      isOnline.value = Boolean(healthy);

      if (healthy) {
        try {
          const masters = await getMasters();
          if (masters) {
            if (masters.ukerList && masters.ukerList.length > 0) ukerList.value = masters.ukerList;
            if (masters.rekananPresets && masters.rekananPresets.length > 0) rekananPresets.value = masters.rekananPresets;
            if (masters.dhaList && masters.dhaList.length > 0) dhaList.value = masters.dhaList;
            if (masters.coaList && masters.coaList.length > 0) coaList.value = masters.coaList;
            if (masters.pegawaiList && masters.pegawaiList.length > 0) pegawaiList.value = masters.pegawaiList;
            if (masters.pejabatPengajuList && masters.pejabatPengajuList.length > 0) pejabatPengajuList.value = masters.pejabatPengajuList;
            if (masters.pejabatPenyetujuList && masters.pejabatPenyetujuList.length > 0) pejabatPenyetujuList.value = masters.pejabatPenyetujuList;
            if (masters.bankList && masters.bankList.length > 0) bankList.value = masters.bankList;
            if (masters.masterBankList && masters.masterBankList.length > 0) masterBankList.value = masters.masterBankList;
            if (masters.tipePembayaranList && masters.tipePembayaranList.length > 0) tipePembayaranList.value = masters.tipePembayaranList;
            if (masters.jenisInvoiceList && masters.jenisInvoiceList.length > 0) jenisInvoiceList.value = masters.jenisInvoiceList;
            if (masters.unitKerjaList && masters.unitKerjaList.length > 0) {
              masterUnitKerjaList.value = masters.unitKerjaList.map(u => ({
                id: u.id,
                kode_unit: u.kode_unit || u.kode || '',
                nama_unit: u.nama_unit || u.nama || '',
                kode: u.kode_unit || u.kode || '',
                nama: u.nama_unit || u.nama || ''
              }));
            }
            try {
              localStorage.setItem('bi_erp_cached_masters', JSON.stringify({
                pegawaiList: pegawaiList.value,
                masterBankList: masterBankList.value,
                rekananPresets: rekananPresets.value,
                dhaList: dhaList.value,
                masterUnitKerjaList: masterUnitKerjaList.value
              }));
            } catch (eCache) {}
          }

          if (pegawaiList.value.length === 0) {
            try {
              const pData = await getPegawaiApi();
              if (pData && pData.length > 0) pegawaiList.value = pData;
            } catch (ePegawai) {}
          }

          if (masterBankList.value.length === 0) {
            try {
              const bData = await getBanksApi();
              if (bData && bData.length > 0) {
                masterBankList.value = bData;
                bankList.value = bData.map(b => b.nama);
              }
            } catch (eBank) {}
          }

          if (masterUnitKerjaList.value.length === 0) {
            try {
              const uData = await getUnitKerjaApi();
              if (uData && uData.length > 0) {
                masterUnitKerjaList.value = uData.map(u => ({
                  id: u.id,
                  kode_unit: u.kode_unit || u.kode || '',
                  nama_unit: u.nama_unit || u.nama || '',
                  kode: u.kode_unit || u.kode || '',
                  nama: u.nama_unit || u.nama || ''
                }));
              }
            } catch (eUker) {}
          }

          const batchRes = await getBatches();
          if (batchRes && batchRes.data && batchRes.data.length > 0) {
            batchList.value = batchRes.data;
            localStorage.setItem('bi_erp_batches', JSON.stringify(batchRes.data));
            if (!form.id) {
              form.noBatch = generateNextBatchNo();
            }
          }

          try {
            const matrixRes = await getRbacMatrixApi();
            if (matrixRes && matrixRes.data && Array.isArray(matrixRes.data) && matrixRes.data.length > 0) {
              rbacMatrixItems.value = matrixRes.data;
              localStorage.setItem('bi_erp_rbac_matrix', JSON.stringify(matrixRes.data));
              syncRolesPermissionsFromMatrix();
            }
          } catch (_) {}
        } catch (e) {
          console.warn('API error saat memuat data:', e);
        }
      }

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('click', closeAllSearchableDropdowns);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('click', closeAllSearchableDropdowns);
    });

    // Calculations
    const totalNominalInvoice = computed(() => {
      return form.invoices.reduce((sum, inv) => sum + (Number(inv.nominal) || 0), 0);
    });

    const filledInvoicesCount = computed(() => {
      return form.invoices.filter(i => (i.noInvoice && i.noInvoice.trim()) || i.nominal > 0).length;
    });

    const totalNominalCoa = computed(() => {
      return form.coas.reduce((sum, c) => sum + (Number(c.nominal) || 0), 0);
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

    // Helper formatting khusus Lembar Disposisi BI ERP (Sesuai Dokumen Resmi)
    const displayNoPerintahBayar = computed(() => {
      if (form.noPerintahBayar && form.noPerintahBayar.trim()) {
        return form.noPerintahBayar.trim();
      }
      const datePart = (form.tglTransaksi ? String(form.tglTransaksi).replace(/-/g, '') : '20250415');
      return `${datePart}-731001-AP_CA-${String(form.id || 1).padStart(3, '0')}`;
    });

    const displayPenarikanUangMuka = computed(() => {
      if (form.penarikanUangMuka && Number(form.penarikanUangMuka) > 0) {
        return Number(form.penarikanUangMuka);
      }
      return Number(totalNominalInvoice.value) || 0;
    });

    const sisaKelebihanUangMuka = computed(() => {
      const penarikan = displayPenarikanUangMuka.value;
      const realisasi = Number(totalNominalInvoice.value) || 0;
      return penarikan - realisasi;
    });

    function formatFullDateIndo(dateStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    }

    function formatRpCommas(val) {
      const num = Number(val) || 0;
      return 'Rp ' + Math.round(num).toLocaleString('en-US');
    }

    function formatNumCommas(val) {
      const num = Number(val) || 0;
      return Math.round(num).toLocaleString('en-US');
    }

    const showDisposisiCustomize = ref(false);
    const formDocCodeTop = ref('AP-T-LDP-02');

    function formatDecimalCommas(val) {
      const num = Number(val) || 0;
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    const displayInvoices = computed(() => {
      const filled = form.invoices.filter(i => (i.noInvoice && i.noInvoice.trim()) || Number(i.nominal) > 0);
      if (filled.length > 0) {
        return filled.map((inv, idx) => ({
          ...inv,
          noFakturPajak: inv.noFakturPajak || (idx === 0 ? form.noFakturPajak : ''),
          tglFakturPajak: inv.tglFakturPajak || (idx === 0 ? form.tglFakturPajak : '')
        }));
      }
      return [
        {
          noInvoice: '311/UN25.1.4',
          tglInvoice: '2025-07-02',
          nominal: 2000000,
          noFakturPajak: '320/UN25.1.4',
          tglFakturPajak: '2025-07-06'
        },
        {
          noInvoice: '312/UN25.1.4',
          tglInvoice: '2025-07-03',
          nominal: 2000000,
          noFakturPajak: '',
          tglFakturPajak: ''
        },
        {
          noInvoice: '313/UN25.1.4',
          tglInvoice: '2025-07-04',
          nominal: 2000000,
          noFakturPajak: '',
          tglFakturPajak: ''
        },
        {
          noInvoice: '314/UN25.1.4',
          tglInvoice: '2025-07-05',
          nominal: 1000000,
          noFakturPajak: '',
          tglFakturPajak: ''
        }
      ];
    });

    const displayCoas = computed(() => {
      const filled = form.coas.filter(c => (c.rangkaianCoa && c.rangkaianCoa.trim()) || Number(c.nominal) > 0);
      if (filled.length > 0) return filled;
      return [
        { rangkaianCoa: '1-731001-841001-57-4100-102-011-040-2500-001', nominal: 2000000 },
        { rangkaianCoa: '1-731001-841005-57-4100-102-011-040-2500-001', nominal: 4000000 },
        { rangkaianCoa: '1-731001-841011-57-4100-102-011-040-2500-001', nominal: 1000000 }
      ];
    });

    const displayTotalNominal = computed(() => {
      if (activeInvoices.value.length > 0) {
        return totalNominalInvoice.value;
      }
      return 7000000;
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
      const totalAmount = batchList.value.reduce((acc, b) => acc + calcBatchTotal(b), 0);
      return { totalCount, totalAmount };
    });

    const approvedBatchCount = computed(() => {
      return batchList.value.filter(b => b.status === 'Disetujui' || b.status === 'Cair').length;
    });

    const pendingBatchCount = computed(() => {
      return batchList.value.filter(b => b.status === 'Diajukan' || b.status === 'Draft').length;
    });

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

    // Formatters
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
        if (typeof dateStr === 'string') {
          const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
          if (match) {
            return `${match[3]}/${match[2]}/${match[1]}`;
          }
        }
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (e) {
        return String(dateStr);
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

    // Form Slot Helpers
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

    // Auto-fill Handlers
    function onSelectRekanan(nama) {
      const r = rekananPresets.value.find(x => x.nama === nama);
      if (r) {
        form.alamatRekanan = r.alamat;
        form.nikNpwp = r.nikNpwp;
        form.namaWpRekanan = r.namaWp;
        form.namaBank = r.bank;
        form.namaRekening = r.atasNama;
        form.nomorRekening = String(r.rekening);
        showToast(`Data rekening & NPWP ${r.nama} terisi otomatis`, 'info');
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
          const res = await checkDocumentDuplicate(form.noDokumen, form.id);
          if (res.isDuplicate) {
            docDuplicateWarning.value = `Nomor dokumen sudah ada di Batch ${res.existingBatch.no_batch}`;
          } else {
            docDuplicateWarning.value = '';
          }
        } catch (e) {}
      } else {
        const found = batchList.value.find(b => b.noDokumen === form.noDokumen && b.id !== form.id);
        if (found) {
          docDuplicateWarning.value = `Nomor dokumen sudah ada di Batch ${found.noBatch}`;
        } else {
          docDuplicateWarning.value = '';
        }
      }
    }

    // Selected Batch & Table State
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

    // ERPHRIS: Invoice AP Filtered List & Detail Modal
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
            await updateBatchStatusApi(targetId, 'Disetujui', { updatedBy: updater });
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
            await updateBatchStatusApi(targetId, 'Ditolak', { updatedBy: updater });
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

    function startNewBatch() {
      if (!hasPermission('form_create')) {
        showToast(`Akses Dibatasi: Role ${currentUser.role || currentUser.roleKey} tidak memiliki wewenang untuk membuat transaksi baru (wewenang Maker / Super Admin).`, 'warning');
        return;
      }
      previousView.value = currentView.value;
      confirmClear();
      currentView.value = 'form';
    }

    function goBack() {
      currentView.value = previousView.value || 'invoice-ap';
    }

    // Data Pegawai (Data Master)
    const pegawaiList = ref([
      { id: 2, nip: '16244', nama: 'A Robith Mubarok', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK CENTRAL ASIA, TBK', noRek: '0246190288' },
      { id: 3, nip: '17379', nama: 'Achmad Maulidi Effendi', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK MANDIRI (PERSERO) TBK', noRek: '1430023910283' },
      { id: 4, nip: '14156', nama: 'Adam Masykur', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK MANDIRI (PERSERO) TBK', noRek: '1540019283741' },
      { id: 5, nip: '17388', nama: 'Adhytya Bagus Rizkianto', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK MANDIRI (PERSERO) TBK', noRek: '1430084920192' },
      { id: 6, nip: '16873', nama: 'Adi Purnomo', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK NEGARA INDONESIA', noRek: '0334075091' },
      { id: 7, nip: '15133', nama: 'Agapito Ganesha J.M.N', pangkat: 'Asisten Manajer', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Penyetuju', status: 'Aktif', bank: 'PT. BANK CENTRAL ASIA, TBK', noRek: '0243396601' }
    ]);

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

    // Form Isian Pegawai Modal & Actions
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
            const res = await createPegawaiApi(payload);
            if (res.data && res.data.id) insertedId = res.data.id;
          } catch (errApi) {
            console.warn('Gagal simpan pegawai ke database server:', errApi);
          }
        }

        const newPegawai = {
          id: insertedId || (pegawaiList.value.length ? Math.max(...pegawaiList.value.map(p => p.id || 0)) + 1 : 1),
          ...payload
        };
        pegawaiList.value.unshift(newPegawai);

        // Sinkronisasi otomatis ke pejabat pengaju / penyetuju
        if (pegawaiForm.peran === 'Pejabat Penyetuju') {
          if (!pejabatPenyetujuList.value.some(x => x.nama === newPegawai.nama)) {
            pejabatPenyetujuList.value.push({ nama: newPegawai.nama, pangkat: newPegawai.pangkat });
          }
        } else {
          if (!pejabatPengajuList.value.some(x => x.nama === newPegawai.nama)) {
            pejabatPengajuList.value.push({ nama: newPegawai.nama, pangkat: newPegawai.pangkat });
          }
        }

        showToast(`Pegawai ${newPegawai.nama} berhasil ditambahkan ke Data Master!`, 'success');
      } else {
        if (isOnline.value && pegawaiForm.id) {
          try {
            await updatePegawaiApi(pegawaiForm.id, payload);
          } catch (errApi) {
            console.warn('Gagal update pegawai di server:', errApi);
          }
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
          await deletePegawaiApi(id);
        } catch (errApi) {
          console.warn('Gagal hapus pegawai di server:', errApi);
        }
      }
      pegawaiList.value = pegawaiList.value.filter(p => p.id !== id);
      showToast(`Data pegawai ${name} berhasil dihapus.`, 'info');
    }

    // Data Bank (Data Master)
    const masterBankList = ref([
      { id: 1, kode: '002', nama: 'Bank Rakyat Indonesia (BRI)', singkatan: 'BRI', jenis: 'Bank BUMN', swift: 'ID002', kliring: 'BI-FAST / SKNBI / RTGS', status: 'Aktif' },
      { id: 2, kode: '008', nama: 'Bank Mandiri', singkatan: 'MANDIRI', jenis: 'Bank BUMN', swift: 'ID008', kliring: 'BI-FAST / SKNBI / RTGS', status: 'Aktif' },
      { id: 3, kode: '009', nama: 'Bank Negara Indonesia (BNI)', singkatan: 'BNI', jenis: 'Bank BUMN', swift: 'ID009', kliring: 'BI-FAST / SKNBI / RTGS', status: 'Aktif' },
      { id: 4, kode: '014', nama: 'Bank Central Asia (BCA)', singkatan: 'BCA', jenis: 'Bank Umum Swasta / Asing', swift: 'ID014', kliring: 'BI-FAST / SKNBI / RTGS', status: 'Aktif' },
      { id: 5, kode: '451', nama: 'Bank Syariah Indonesia (BSI)', singkatan: 'BSI', jenis: 'Bank Syariah', swift: 'ID451', kliring: 'BI-FAST / SKNBI / RTGS', status: 'Aktif' },
      { id: 6, kode: '114', nama: 'Bank Jatim', singkatan: 'JATIM', jenis: 'Bank Pembangunan Daerah (BPD)', swift: 'ID114', kliring: 'BI-FAST / SKNBI / RTGS', status: 'Aktif' }
    ]);

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
            const res = await createBankApi(payload);
            if (res.data && res.data.id) insertedId = res.data.id;
          } catch (errApi) {
            console.warn('Gagal simpan bank ke database:', errApi);
          }
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
            await updateBankApi(bankForm.id, payload);
          } catch (errApi) {
            console.warn('Gagal update bank:', errApi);
          }
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
          await deleteBankApi(id);
        } catch (errApi) {
          console.warn('Gagal hapus bank:', errApi);
        }
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
            const res = await createUnitKerjaApi(payload);
            if (res && res.data && res.data.id) insertedId = res.data.id;
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
            await updateUnitKerjaApi(unitKerjaForm.id, payload);
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
          await deleteUnitKerjaApi(id);
        } catch (errApi) {
          console.warn('Gagal hapus unit kerja di server:', errApi);
        }
      }
      masterUnitKerjaList.value = masterUnitKerjaList.value.filter(u => u.id !== id);
      ukerList.value = ukerList.value.filter(uName => uName !== name);
      showToast(`Unit Kerja "${name}" berhasil dihapus.`, 'info');
    }

    // Data Rekanan (Data Master)
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

    async function saveRekanan() {
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

      const payload = {
        nama: rekananForm.nama.trim(),
        alamat: rekananForm.alamat.trim(),
        nikNpwp: rekananForm.nikNpwp.trim(),
        namaWp: (rekananForm.namaWp || rekananForm.nama).trim(),
        bank: (rekananForm.bank || '').trim(),
        rekening: (rekananForm.rekening || '').trim(),
        atasNama: (rekananForm.atasNama || rekananForm.nama).trim()
      };

      if (rekananFormMode.value === 'add') {
        let insertedId = null;
        if (isOnline.value) {
          try {
            const res = await createRekananApi(payload);
            if (res && res.data && res.data.id) {
              insertedId = res.data.id;
            }
          } catch (errApi) {
            console.error('Gagal simpan rekanan ke database MySQL:', errApi);
            showToast(`Peringatan: Gagal simpan ke database server (${errApi.message || 'Error'})`, 'warning');
          }
        }

        const nextId = insertedId || (rekananPresets.value.length ? Math.max(...rekananPresets.value.map(r => r.id || 0)) + 1 : 1);
        const newRekanan = {
          id: nextId,
          ...payload
        };
        rekananPresets.value.unshift(newRekanan);
        showToast(`Rekanan ${newRekanan.nama} berhasil ditambahkan dan disimpan ke database!`, 'success');
      } else {
        if (isOnline.value && rekananForm.id) {
          try {
            await updateRekananApi(rekananForm.id, payload);
          } catch (errApi) {
            console.error('Gagal perbarui rekanan di MySQL:', errApi);
            showToast(`Peringatan: Gagal update di database server (${errApi.message || 'Error'})`, 'warning');
          }
        }

        const item = rekananPresets.value.find(r => r.id === rekananForm.id);
        if (item) {
          Object.assign(item, payload);
          showToast(`Data rekanan ${item.nama} berhasil diperbarui di database!`, 'success');
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
      if (isOnline.value && id) {
        try {
          await deleteRekananApi(id);
        } catch (errApi) {
          console.error('Gagal hapus rekanan dari database server:', errApi);
          showToast(`Peringatan: Gagal hapus dari database server (${errApi.message || 'Error'})`, 'warning');
        }
      }
      rekananPresets.value = rekananPresets.value.filter(r => r.id !== id);
      showToast(`Data rekanan ${name} berhasil dihapus dari database.`, 'info');
    }

    // Data DHA (Data Master)
    const dhaSearch = ref('');
    const dhaPage = ref(1);
    const dhaPageSize = ref(20);

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

    const dhaTotalPages = computed(() => Math.max(1, Math.ceil(filteredDhaList.value.length / dhaPageSize.value)));

    const paginatedDhaList = computed(() => {
      const start = (dhaPage.value - 1) * dhaPageSize.value;
      return filteredDhaList.value.slice(start, start + dhaPageSize.value);
    });

    watch(dhaSearch, () => {
      dhaPage.value = 1;
    });

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

      // Jika user sedang mencari kata kunci
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

      // Jika user sudah memilih Nama DHA, prioritaskan data rangkaian COA milik DHA tersebut
      if (form.namaDha) {
        const matching = dhaList.value.filter(d =>
          (d.nama === form.namaDha || d.dha === form.namaDha) && d.rangkaianCoa
        );
        if (matching.length > 0) {
          return matching;
        }
      }

      // Fallback: Tampilkan list COA umum
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

    function onSelectDha(nama) {
      // COA dibiarkan kosong secara default sesuai permintaan pengguna
    }

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
          createDhaApi(newDha).then(res => {
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
            updateDhaApi(item.id, item).catch(e => console.warn('Gagal sync edit DHA ke API:', e.message));
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
        deleteDhaApi(item.id).catch(e => console.warn('Gagal sync hapus DHA ke API:', e.message));
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
        script.onerror = () => reject(new Error('Gagal memuat pustaka XLSX dari CDN'));
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
            const apiRes = await importDhaApi(importDhaParsedData.value, mode);
            if (apiRes && apiRes.success) {
              apiSuccess = true;
              const masters = await getMasters();
              if (masters && masters.dhaList && masters.dhaList.length > 0) {
                dhaList.value = masters.dhaList;
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

    // Actions: SAVE (Otomatis Simpan Baru atau Perbarui jika sedang mengedit batch)
    async function saveBatch() {
      const isEditing = !!form.id;
      if (isEditing && !hasPermission('form_edit')) {
        showToast(`Akses Dibatasi: Role ${currentUser.role || currentUser.roleKey} tidak memiliki wewenang untuk mengubah data transaksi.`, 'warning');
        return;
      }
      if (!isEditing && !hasPermission('form_create')) {
        showToast(`Akses Dibatasi: Role ${currentUser.role || currentUser.roleKey} tidak memiliki wewenang untuk membuat transaksi baru.`, 'warning');
        return;
      }
      if (!form.noDokumen || !form.perihal) {
        showToast('Nomor Dokumen dan Perihal transaksi wajib diisi!', 'warning');
        return;
      }
      if (totalNominalInvoice.value <= 0) {
        showToast('Total nominal tagihan invoice harus lebih dari Rp 0!', 'warning');
        return;
      }
      if (!isCoaBalanced.value) {
        showToast(`Rangkaian COA belum seimbang! Selisih: ${formatCurrency(selisihCoa.value)}`, 'warning');
        return;
      }

      isSubmitting.value = true;
      try {
        if (isOnline.value) {
          let res;
          if (form.id) {
            // Mode perbarui record yang ada
            res = await updateBatchApi(form.id, form);
          } else {
            // Mode buat record baru
            res = await createBatchApi(form);
            if (res.data && res.data.id) {
              form.id = res.data.id;
              form.noBatch = res.data.noBatch || form.noBatch;
            }
          }
          showToast(res.message || 'Data batch berhasil disimpan!', 'success');
          const listRes = await getBatches();
          if (listRes.data) batchList.value = listRes.data;
        } else {
          if (form.id) {
            const idx = batchList.value.findIndex(b => b.id === form.id);
            if (idx !== -1) {
              batchList.value[idx] = JSON.parse(JSON.stringify(form));
              localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
              showToast(`Data Batch ${form.noBatch} berhasil diperbarui!`, 'success');
            }
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
            localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
            form.id = nextId;
            form.noBatch = newBatchNo;
            showToast(`Batch ${newBatchNo} berhasil disimpan!`, 'success');
          }
        }
      } catch (err) {
        showToast(err.message || 'Gagal menyimpan batch', 'error');
      } finally {
        isSubmitting.value = false;
      }
    }

    // Actions: REPLACE
    const showReplaceModal = ref(false);
    async function confirmReplace() {
      if (!form.id) {
        showToast('Data batch baru belum tersimpan. Gunakan tombol SAVE terlebih dahulu.', 'warning');
        return;
      }
      const confirmed = await showSweetConfirm({
        title: 'Timpa Data Batch (Replace)?',
        html: `Apakah Anda yakin ingin memperbarui dan menimpa data <b>Batch ${form.noBatch}</b> dengan data terbaru pada form?`,
        icon: 'question',
        confirmButtonText: '<i class="bi bi-arrow-repeat me-1"></i> Ya, Timpa Data',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#64748b'
      });
      if (confirmed) {
        await executeReplace();
      }
    }

    async function executeReplace() {
      showReplaceModal.value = false;
      try {
        if (isOnline.value) {
          const res = await updateBatchApi(form.id, form);
          showToast(res.message, 'success');
        } else {
          const idx = batchList.value.findIndex(b => b.id === form.id);
          if (idx !== -1) {
            batchList.value[idx] = JSON.parse(JSON.stringify(form));
            localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
            showToast(`Data Batch ${form.noBatch} berhasil diperbarui (Replace)!`, 'success');
          }
        }
      } catch (e) {
        showToast(e.message || 'Gagal memperbarui batch', 'error');
      }
    }

    // Actions: CLEAR
    function resetFormFields() {
      form.id = null;
      form.noBatch = generateNextBatchNo();
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
      resetFormFields();
      showToast('Formulir berhasil dikosongkan. Siap input batch baru.', 'info');
    }

    // Actions: DELETE
    const showDeleteModal = ref(false);
    const batchToDelete = ref(null);

    async function confirmDelete(batch = null) {
      if (!hasPermission('form_delete')) {
        showToast(`Akses Ditolak: Penghapusan atau pembatalan dokumen batch hanya diizinkan untuk peran yang memiliki hak form_delete (Super Admin).`, 'warning');
        return;
      }
      let target = batch;
      if (!target || (!target.id && !target.noBatch && !target.batch)) {
        if (!form.id && !form.noBatch) {
          showToast('Pilih batch dari tabel terlebih dahulu untuk dihapus.', 'warning');
          return;
        }
        target = batchList.value.find(b => (form.id && b.id === form.id) || (form.noBatch && (b.noBatch === form.noBatch || b.batch === form.noBatch))) || { id: form.id, noBatch: form.noBatch, noDokumen: form.noDokumen, perihal: form.perihal };
      }
      const targetNo = target?.noBatch || target?.batch || form.noBatch || 'transaksi ini';
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
      const targetNoBatch = target?.noBatch || target?.batch || form.noBatch || 'transaksi';

      if (!targetId && !targetNoBatch) return;

      try {
        if (isOnline.value) {
          try {
            const deleteKey = targetId || targetNoBatch;
            await deleteBatchApi(deleteKey, {
              user: currentUser.name || 'Admin ERP',
              noBatch: targetNoBatch
            });
          } catch (apiErr) {
            console.warn('Delete batch API notice:', apiErr.message);
            // Jika batch tidak ditemukan atau sudah dihapus di database (404),
            // itu berarti di database sudah bersih. Tetap lanjutkan pembersihan state lokal / localStorage.
            const isNotFoundOrAlreadyDeleted = apiErr.status === 404 || (
              apiErr.message && (
                apiErr.message.toLowerCase().includes('tidak ditemukan') ||
                apiErr.message.toLowerCase().includes('sudah dihapus')
              )
            );
            if (!isNotFoundOrAlreadyDeleted) {
              throw apiErr;
            }
          }
        }

        // Hapus dari batchList lokal & localStorage
        batchList.value = batchList.value.filter(b => {
          const matchId = targetId && (String(b.id) === String(targetId));
          const matchNo = targetNoBatch && (
            (b.noBatch && b.noBatch === targetNoBatch) ||
            (b.batch && b.batch === targetNoBatch)
          );
          return !matchId && !matchNo;
        });

        localStorage.setItem('bi_erp_batches', JSON.stringify(batchList.value));
        showToast(`Batch ${targetNoBatch} berhasil dihapus dari sistem!`, 'success');
        
        if (form.id === targetId || (targetNoBatch && (form.noBatch === targetNoBatch || form.batch === targetNoBatch))) {
          resetFormFields();
        }
        if (selectedDetailBatch.value && (
          (targetId && selectedDetailBatch.value.id === targetId) ||
          (targetNoBatch && (selectedDetailBatch.value.noBatch === targetNoBatch || selectedDetailBatch.value.batch === targetNoBatch))
        )) {
          closeDetailModal();
        }
      } catch (e) {
        showToast(e.message || 'Gagal menghapus batch', 'error');
      } finally {
        batchToDelete.value = null;
      }
    }

    // Actions: CHECKLIST
    const showChecklistModal = ref(false);
    const checklistItems = reactive([
      { id: 1, title: 'Kuitansi / Invoice Asli Bermaterai', desc: 'UU Bea Meterai untuk tagihan di atas Rp 5.000.000', checked: true },
      { id: 2, title: 'Faktur Pajak Elektronik (e-Faktur DJP)', desc: 'Validasi QR Code DJP dan kesesuaian NSFP', checked: true },
      { id: 3, title: 'Berita Acara Serah Terima (BAST) / SPK', desc: 'Ditandatangani Pejabat Berwenang & Penyedia Jasa', checked: true },
      { id: 4, title: 'Kesesuaian Kode Pembebanan COA & DHA', desc: 'Verifikasi pagu anggaran mencukupi pada SI-Anggaran BI', checked: true },
      { id: 5, title: 'Konfirmasi Nomor Rekening Tujuan & NPWP', desc: 'Rekening bank aktif dan sesuai buku rekening rekanan', checked: true }
    ]);

    function openChecklistModal() {
      if (!hasPermission('batch_verify')) {
        showToast('Akses Dibatasi: Peran Anda tidak memiliki hak akses verifikasi checklist kepatuhan (wewenang Checker / Super Admin).', 'warning');
        return;
      }
      showChecklistModal.value = true;
    }

    // Master Data Modal
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

    function logoutUser() {
      isLoggedIn.value = false;
      localStorage.removeItem('bi_erp_auth_user');
      sessionStorage.removeItem('bi_erp_auth_user');
      showUserMenu.value = false;
      showToast('Berhasil logout dari sistem.', 'logout');
    }

    function handleLoginSuccess(userData) {
      currentUser.name = userData.namaLengkap;
      currentUser.nip = userData.nip || '';
      currentUser.role = userData.roleName || userData.roleKey;
      currentUser.satker = userData.satker || 'Unit Manajemen Keuangan KPw BI Jember';
      currentUser.email = userData.email || '';
      currentUser.roleKey = userData.roleKey || 'maker';
      currentUser.username = userData.username || '';
      isLoggedIn.value = true;
      showToast(`Login berhasil! Selamat datang, ${userData.namaLengkap || 'Pegawai Bank Indonesia'}.`, 'success');
    }

    function triggerPrint() {
      applyPrintSettingsToDOM();
      window.print();
    }

    function printVoucher(directPrint = false) {
      applyPrintSettingsToDOM();
      currentView.value = 'print';
      if (directPrint) {
        setTimeout(() => {
          window.print();
        }, 350);
      }
    }

    function exportToCSV() {
      if (!hasPermission('export_report')) {
        showToast('Akses Dibatasi: Anda tidak memiliki wewenang untuk mengekspor laporan keuangan (export_report).', 'warning');
        return;
      }
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

    // Pengaturan Methods & User Management (RBAC)
    function getRoleBadgeClass(roleKey) {
      const found = userRoles.value.find(r => r.key === roleKey);
      return found ? found.badge : 'tag-gray';
    }

    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            usersList.value = json.data;
            saveUsersToStorage();
          }
        }
      } catch (err) {
        console.warn('Gagal memuat pengguna dari server, menggunakan cache lokal:', err);
      }
    }

    // Watcher: Jika memilih role super_admin, otomatis status menjadi Aktif
    watch(() => userForm.roleKey, (newRole) => {
      if (newRole === 'super_admin') {
        userForm.status = 'Aktif';
        if (!userForm.satker || userForm.satker === 'Unit Manajemen Keuangan KPw BI Jember') {
          userForm.satker = 'Seluruh Satuan Kerja (Administrator Sistem)';
        }
      } else {
        if (userForm.satker === 'Seluruh Satuan Kerja (Administrator Sistem)') {
          userForm.satker = (ukerList.value && ukerList.value[0]) ? ukerList.value[0] : 'Unit Manajemen Keuangan KPw BI Jember';
        }
      }
    });

    function openUserModal(mode = 'add') {
      userFormMode.value = mode;
      if (mode === 'add') {
        userForm.id = null;
        userForm.username = '';
        userForm.namaLengkap = '';
        userForm.nip = '';
        userForm.email = '';
        userForm.satker = 'Unit Manajemen Keuangan KPw BI Jember';
        userForm.roleKey = 'maker';
        userForm.password = '';
        userForm.status = 'Aktif';
      }
      showUserModal.value = true;
    }

    function editUser(u) {
      userFormMode.value = 'edit';
      userForm.id = u.id;
      userForm.username = u.username;
      userForm.namaLengkap = u.namaLengkap;
      userForm.nip = u.nip || '';
      userForm.email = u.email || '';
      userForm.satker = u.satker || 'Unit Manajemen Keuangan KPw BI Jember';
      userForm.roleKey = u.roleKey || 'maker';
      userForm.password = '';
      userForm.status = u.roleKey === 'super_admin' ? 'Aktif' : (u.status || 'Aktif');
      showUserModal.value = true;
    }

    async function saveUser() {
      const isSuper = userForm.roleKey === 'super_admin';
      if (!userForm.namaLengkap || !userForm.namaLengkap.trim()) {
        showToast('Nama Lengkap wajib diisi!', 'warning');
        return;
      }
      if (!userForm.username || !userForm.username.trim()) {
        showToast('Username Akun wajib diisi!', 'warning');
        return;
      }
      if (userFormMode.value === 'add' && (!userForm.password || !userForm.password.trim())) {
        showToast('Kata Sandi Awal wajib diisi!', 'warning');
        return;
      }
      if (!isSuper && (!userForm.email || !userForm.email.trim())) {
        showToast('Email Dinas Bank Indonesia wajib diisi!', 'warning');
        return;
      }
      if (!isSuper && (!userForm.satker || !userForm.satker.trim())) {
        showToast('Satuan Kerja / Unit Kerja wajib dipilih!', 'warning');
        return;
      }

      if (isSuper) {
        userForm.status = 'Aktif';
        if (!userForm.satker) userForm.satker = 'Seluruh Satuan Kerja (Administrator Sistem)';
        if (!userForm.email) userForm.email = `${userForm.username.trim()}@bi.go.id`;
        if (!userForm.nip) userForm.nip = '-';
      }

      const roleObj = userRoles.value.find(r => r.key === userForm.roleKey) || { name: userForm.roleKey };
      const payload = {
        username: userForm.username.trim(),
        namaLengkap: userForm.namaLengkap.trim(),
        nip: isSuper ? '-' : (userForm.nip ? userForm.nip.trim() : ''),
        email: isSuper ? (userForm.email || `${userForm.username.trim()}@bi.go.id`) : userForm.email.trim(),
        satker: isSuper ? (userForm.satker || 'Seluruh Satuan Kerja (Administrator Sistem)') : userForm.satker,
        roleKey: userForm.roleKey,
        roleName: roleObj.name,
        status: isSuper ? 'Aktif' : userForm.status,
        password: userForm.password
      };

      try {
        if (userFormMode.value === 'add') {
          const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              usersList.value.push(data.user);
            } else {
              fallbackAddUser(payload);
            }
          } else {
            fallbackAddUser(payload);
          }
          showToast(`Pengguna baru "${payload.namaLengkap}" berhasil ditambahkan.`, 'success');
        } else {
          const res = await fetch(`/api/users/${userForm.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              const idx = usersList.value.findIndex(x => x.id === userForm.id);
              if (idx !== -1) usersList.value[idx] = data.user;
            } else {
              fallbackUpdateUser(payload);
            }
          } else {
            fallbackUpdateUser(payload);
          }
          showToast(`Data pengguna "${payload.namaLengkap}" berhasil diperbarui.`, 'success');
        }
        showUserModal.value = false;
        saveUsersToStorage();
      } catch (err) {
        if (userFormMode.value === 'add') {
          fallbackAddUser(payload);
          showToast(`Pengguna baru "${payload.namaLengkap}" tersimpan di cache lokal.`, 'success');
        } else {
          fallbackUpdateUser(payload);
          showToast(`Data pengguna "${payload.namaLengkap}" diperbarui di cache lokal.`, 'success');
        }
        showUserModal.value = false;
        saveUsersToStorage();
      }
    }

    function fallbackAddUser(payload) {
      const newId = usersList.value.length ? Math.max(...usersList.value.map(x => x.id || 0)) + 1 : 1;
      usersList.value.push({
        id: newId,
        ...payload,
        lastLogin: 'Belum pernah',
        createdAt: new Date().toISOString().split('T')[0]
      });
    }

    function fallbackUpdateUser(payload) {
      const idx = usersList.value.findIndex(x => x.id === userForm.id);
      if (idx !== -1) {
        usersList.value[idx] = { ...usersList.value[idx], ...payload };
      }
    }

    async function toggleUserStatus(u) {
      const newStatus = u.status === 'Aktif' ? 'Terkunci' : 'Aktif';
      try {
        const res = await fetch(`/api/users/${u.id}/toggle-status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            u.status = data.user.status;
          } else {
            u.status = newStatus;
          }
        } else {
          u.status = newStatus;
        }
      } catch (e) {
        u.status = newStatus;
      }
      showToast(`Status akses akun ${u.namaLengkap} diubah menjadi: ${u.status}`, 'info');
      saveUsersToStorage();
    }

    function openResetPasswordModal(u) {
      resetPasswordTargetUser.value = u;
      resetPasswordForm.password = '';
      resetPasswordForm.confirmPassword = '';
      resetPasswordForm.forceChangeOnLogin = true;
      showResetPasswordModal.value = true;
    }

    async function saveResetPassword() {
      if (!resetPasswordForm.password) {
        showToast('Kata sandi baru tidak boleh kosong!', 'warning');
        return;
      }
      if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
        showToast('Konfirmasi kata sandi tidak cocok!', 'error');
        return;
      }
      if (securityPolicy.requireMinLength && resetPasswordForm.password.length < 8) {
        showToast('Kata sandi harus minimal 8 karakter sesuai kebijakan keamanan!', 'warning');
        return;
      }

      const u = resetPasswordTargetUser.value;
      try {
        await fetch(`/api/users/${u.id}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword: resetPasswordForm.password })
        });
      } catch (err) {
        console.warn('Reset password backend error, updated in UI:', err);
      }
      showToast(`Kata sandi untuk @${u.username} (${u.namaLengkap}) berhasil diatur ulang!`, 'success');
      showResetPasswordModal.value = false;
    }

    async function openDeleteUserModal(u) {
      userToDelete.value = u;
      const confirmed = await showSweetConfirm({
        title: 'Hapus Akun Pengguna?',
        html: `Apakah Anda yakin ingin menghapus akun pengguna <b>"${u.namaLengkap || u.username}"</b> (@${u.username})?<br><small class="text-danger">Tindakan ini akan mencabut seluruh hak akses akun dari sistem.</small>`,
        icon: 'warning',
        confirmButtonText: '<i class="bi bi-trash me-1"></i> Ya, Hapus Pengguna',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b'
      });
      if (confirmed) {
        await confirmDeleteUser();
      }
    }

    async function confirmDeleteUser() {
      if (!userToDelete.value) return;
      const u = userToDelete.value;
      const targetId = u.id;
      const targetUsername = u.username;

      try {
        await fetch(`/api/users/${targetId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Delete user backend error:', e);
      }

      usersList.value = usersList.value.filter(x => x.id !== targetId && x.username !== targetUsername);
      saveUsersToStorage();
      showDeleteUserModal.value = false;
      showToast(`Akun pengguna "${u.namaLengkap}" (@${targetUsername}) berhasil dihapus.`, 'info');

      // Jika user yang dihapus kebetulan sedang aktif dipakai di currentUser
      if (currentUser.name === u.namaLengkap || currentUser.email === u.email) {
        if (usersList.value.length > 0) {
          switchUser(usersList.value[0]);
        }
      }
      userToDelete.value = null;
    }

    function deleteUser(u) {
      openDeleteUserModal(u);
    }

    function switchUser(u) {
      if (u.status === 'Terkunci') {
        showToast(`Akun @${u.username} saat ini terkunci/nonaktif. Harap buka kunci akses terlebih dahulu.`, 'error');
        return;
      }
      currentUser.name = u.namaLengkap;
      currentUser.nip = u.nip || '';
      currentUser.role = u.roleName || u.roleKey;
      currentUser.satker = u.satker || 'Unit Manajemen Keuangan KPw BI Jember';
      currentUser.email = u.email;
      currentUser.roleKey = u.roleKey;
      u.lastLogin = 'Baru saja';
      showToast(`Berhasil beralih sesi sebagai: ${u.namaLengkap} (${u.roleName || u.roleKey})`, 'success');
      saveUsersToStorage();
      localStorage.setItem('bi_erp_user', JSON.stringify(currentUser));
    }

    function saveSecurityPolicy() {
      localStorage.setItem('bi_erp_security_policy', JSON.stringify(securityPolicy));
      showToast('Kebijakan akses masuk dan parameter keamanan berhasil disimpan!', 'success');
    }

    function saveUsersToStorage() {
      try {
        localStorage.setItem('bi_erp_users_list', JSON.stringify(usersList.value));
      } catch (e) {}
    }

    function loadUsersFromStorage() {
      try {
        const storedUsers = localStorage.getItem('bi_erp_users_list');
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            usersList.value = parsed;
          }
        }
        const storedPolicy = localStorage.getItem('bi_erp_security_policy');
        if (storedPolicy) {
          Object.assign(securityPolicy, JSON.parse(storedPolicy));
        }
      } catch (e) {}
    }

    function saveSettings() {
      try {
        localStorage.setItem('bi_erp_user', JSON.stringify(currentUser));
        localStorage.setItem('bi_erp_settings', JSON.stringify(appSettings));
        saveUsersToStorage();
        saveSecurityPolicy();
        showToast('Pengaturan sistem, profil operator, & wewenang pengguna berhasil disimpan!', 'success');
      } catch (e) {
        showToast('Gagal menyimpan pengaturan: ' + e.message, 'error');
      }
    }

    async function testServerConnection() {
      showToast('Memeriksa konektivitas REST API server & database...', 'info');
      try {
        const healthy = await checkBackendHealth();
        isOnline.value = Boolean(healthy);
        if (healthy) {
          showToast('Koneksi ke backend REST API (port 5000) & database MySQL berhasil terhubung!', 'success');
        } else {
          showToast('Backend REST API tidak merespons (Offline). Berjalan di Standalone Mode.', 'warning');
        }
      } catch (err) {
        isOnline.value = false;
        showToast('Gagal terhubung ke backend server: ' + err.message, 'error');
      }
    }

    async function refreshAllMasters() {
      showToast('Memuat ulang seluruh data master dari database...', 'info');
      try {
        const healthy = await checkBackendHealth();
        isOnline.value = Boolean(healthy);
        if (healthy) {
          const masters = await getMasters();
          if (masters) {
            if (masters.ukerList && masters.ukerList.length > 0) ukerList.value = masters.ukerList;
            if (masters.rekananPresets && masters.rekananPresets.length > 0) rekananPresets.value = masters.rekananPresets;
            if (masters.dhaList && masters.dhaList.length > 0) dhaList.value = masters.dhaList;
            if (masters.coaList && masters.coaList.length > 0) coaList.value = masters.coaList;
            if (masters.pegawaiList && masters.pegawaiList.length > 0) pegawaiList.value = masters.pegawaiList;
            if (masters.pejabatPengajuList && masters.pejabatPengajuList.length > 0) pejabatPengajuList.value = masters.pejabatPengajuList;
            if (masters.pejabatPenyetujuList && masters.pejabatPenyetujuList.length > 0) pejabatPenyetujuList.value = masters.pejabatPenyetujuList;
            if (masters.bankList && masters.bankList.length > 0) bankList.value = masters.bankList;
            if (masters.masterBankList && masters.masterBankList.length > 0) masterBankList.value = masters.masterBankList;
            if (masters.unitKerjaList && masters.unitKerjaList.length > 0) {
              masterUnitKerjaList.value = masters.unitKerjaList.map(u => ({
                id: u.id,
                kode_unit: u.kode_unit || u.kode || '',
                nama_unit: u.nama_unit || u.nama || '',
                kode: u.kode_unit || u.kode || '',
                nama: u.nama_unit || u.nama || ''
              }));
            }
          }
          const pData = await getPegawaiApi();
          if (pData && pData.length > 0) pegawaiList.value = pData;
          const bData = await getBanksApi();
          if (bData && bData.length > 0) {
            masterBankList.value = bData;
            bankList.value = bData.map(b => b.nama);
          }
          try {
            const uData = await getUnitKerjaApi();
            if (uData && uData.length > 0) {
              masterUnitKerjaList.value = uData.map(u => ({
                id: u.id,
                kode_unit: u.kode_unit || u.kode || '',
                nama_unit: u.nama_unit || u.nama || '',
                kode: u.kode_unit || u.kode || '',
                nama: u.nama_unit || u.nama || ''
              }));
            }
          } catch (eUker) {}
          showToast('Seluruh data master (Pegawai, Bank, DHA, Rekanan, Unit Kerja) berhasil dimuat ulang!', 'success');
        } else {
          showToast('Backend offline. Tidak dapat memuat ulang dari database.', 'warning');
        }
      } catch (err) {
        showToast('Gagal memuat ulang data master: ' + err.message, 'error');
      }
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
            rekananPresets: rekananPresets.value
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
        `"${b.noBatch || ''}"`, `"${b.noDokumen || ''}"`, `"${formatDateIndo(b.tglTransaksi)}"`,
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

    // Toasts
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

    return {
      isLoggedIn, handleLoginSuccess, logoutUser,
      currentView, isSidebarCollapsed, showUserMenu, isOnline, isSubmitting, currentUser, liveTime,
      getViewUrl, navigateView, handleDropdownToggle,
      ukerList, rekananPresets, bankList, tipePembayaranList, jenisInvoiceList, dhaList, coaList,
      pejabatPengajuList, pejabatPenyetujuList, form, batchList, selectedBatchId,
      totalNominalInvoice, filledInvoicesCount, totalNominalCoa, selisihCoa, isCoaBalanced,
      terbilangInvoice, currentDha, sisaSaldoDha, persentaseDha, activeInvoices, activeCoas,
      stats, approvedBatchCount, pendingBatchCount, calcBatchTotal, formatCurrency, formatDateIndo,
      formatIsoToDmy, parseDmyToIso, handleDateTextInput, handleDateBlur, openDatePickerNative,
      clearInvoiceSlot, clearCoaSlot, autoBalanceCoa, onSelectRekanan, onSelectPengaju, onSelectPenyetuju,
      checkDocUniqueness, docDuplicateWarning, tableSearchKeyword, tableCriteria, tableStatusFilter,
      tableSortBy, tableSortOrder, currentPage, pageSize, filteredBatches, totalPages, paginatedBatches,
      changeSort, loadBatchToForm, startNewBatch, saveBatch, showReplaceModal, confirmReplace, executeReplace,
      confirmClear, showDeleteModal, batchToDelete, confirmDelete, executeDelete, showChecklistModal, checklistItems,
      openChecklistModal, showMasterModal, masterModalType, masterModalTitle, openMasterModal,
      confirmExit, triggerPrint, printVoucher, exportToCSV, toasts, showToast, removeToast,
      printSettings, showPrintConfigModal, openPrintConfigModal, closePrintConfigModal,
      savePrintSettings, resetPrintSettings, applyMarginPreset, onCustomMarginChange,
      applyPrintSettingsToDOM, previewSheetStyle, printWithCurrentSettings, getFontFamilyCss, previewPrintDocument,
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
      dhaPage, dhaPageSize, dhaTotalPages, paginatedDhaList, onSelectDha,
      showDhaModal, dhaFormMode, dhaForm, openDhaModal, editDha, saveDha, deleteDha,
      exportDhaToExcel, downloadDhaTemplate,
      showImportDhaModal, openImportDhaModal, closeImportDhaModal,
      importDhaFile, importDhaFileName, importDhaParsedData, importDhaMode, isImportingDha, importDhaError,
      dhaFileInput, triggerFileInput, handleFileChange, handleFileDrop, processImportDha,
      importDhaTotalAnggaran, importDhaPreviewRows,
      settingTab, appSettings, saveSettings, testServerConnection, refreshAllMasters, exportAllDataJson, clearLocalCache,
      userSubTab, userSearchKeyword, userRoleFilter, userStatusFilter,
      showUserModal, userFormMode, showResetPasswordModal, resetPasswordTargetUser, resetPasswordForm,
      showDeleteUserModal, userToDelete, openDeleteUserModal, confirmDeleteUser,
      userForm, securityPolicy, userRoles, rbacMatrixItems, usersList, filteredUsersList,
      isMatrixDirty, matrixSearchKeyword, matrixRoleFilter, filteredRbacMatrixItems,
      toggleRolePermission, bulkSetRolePermissions, saveRbacMatrix, resetRbacMatrixToDefault, switchTestRole, exportRbacMatrixCSV, hasPermission,
      canAccessView, getViewRequiredPermission, getPermissionName,
      getRoleBadgeClass, fetchUsers, openUserModal, editUser, saveUser,
      toggleUserStatus, openResetPasswordModal, saveResetPassword, deleteUser, switchUser,
      saveSecurityPolicy,
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
      formatRupiah, formatCompactRupiah, formatShortDate, invoiceTotal, invoiceCount, coaTotal, coaDiff, coaStatus,
      formatRupiahInput, parseRupiahInput, formatFromRawString,
      handleInvoiceNominalInput, handleInvoiceNominalBlur,
      handleCoaNominalInput, handleCoaNominalBlur,
      handleDhaAnggaranInput, handleDhaAnggaranBlur, handleNominalFocus,
      validateStep1, validateStep2, setStep, nextStep, prevStep, jumpStep, clearInvoices,
      resetFormBatch, saveDraftBatch, saveCompleteBatch, openBatchInForm,
      historySearch, historyStatusFilter, filteredHistoryBatches, historyTotalNominal, historyDraftCount,
      isDhaDropdownOpen, dhaFilterText, dhaSearchInputRef,
      isCoaDropdownOpen, coaFilterText, uniqueDhaList, filteredDhaOptions,
      toggleDhaDropdown, selectDha, clearDhaSelection,
      toggleCoaDropdown, getFilteredCoaOptions, selectCoa, clearCoaSelection,
      isTunai, onTipePembayaranChange, unitKerjaOptions,
      formatFullDateIndo, formatRpCommas, formatNumCommas, formatDecimalCommas, showDisposisiCustomize,
      formDocCodeTop, displayInvoices, displayCoas, displayTotalNominal
    };
  }
};
</script>
