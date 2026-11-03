const { pool } = require('../config/database');

// Static Fallbacks jika database belum siap / sedang inisialisasi
const FALLBACK_MASTERS = {
  uker: [
    'Fungsi Data, Statistik & Kajian Ekonomi',
    'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)',
    'Unit Manajemen Keuangan KPw BI Jember',
    'Seksi Kepatuhan & Manajemen Risiko',
    'Unit Operasional Sistem Pembayaran & PUR',
    'Unit Manajemen Logistik & Rumah Tangga',
    'Fungsi Kehumasan & Komunikasi Kebijakan',
    'Seksi Kehumasan & Sistem Informasi'
  ],
  unitKerjaList: [
    { id: 1, kode: 'FDSEK', nama: 'Fungsi Data, Statistik & Kajian Ekonomi', kode_unit: 'FDSEK', nama_unit: 'Fungsi Data, Statistik & Kajian Ekonomi' },
    { id: 2, kode: 'FPPU', nama: 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)', kode_unit: 'FPPU', nama_unit: 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)' },
    { id: 3, kode: 'UMK', nama: 'Unit Manajemen Keuangan KPw BI Jember', kode_unit: 'UMK', nama_unit: 'Unit Manajemen Keuangan KPw BI Jember' },
    { id: 4, kode: 'KMR', nama: 'Seksi Kepatuhan & Manajemen Risiko', kode_unit: 'KMR', nama_unit: 'Seksi Kepatuhan & Manajemen Risiko' },
    { id: 5, kode: 'PUR', nama: 'Unit Operasional Sistem Pembayaran & PUR', kode_unit: 'PUR', nama_unit: 'Unit Operasional Sistem Pembayaran & PUR' },
    { id: 6, kode: 'LOG', nama: 'Unit Manajemen Logistik & Rumah Tangga', kode_unit: 'LOG', nama_unit: 'Unit Manajemen Logistik & Rumah Tangga' },
    { id: 7, kode: 'HUMAS', nama: 'Fungsi Kehumasan & Komunikasi Kebijakan', kode_unit: 'HUMAS', nama_unit: 'Fungsi Kehumasan & Komunikasi Kebijakan' },
    { id: 8, kode: 'SI-TI', nama: 'Seksi Kehumasan & Sistem Informasi', kode_unit: 'SI-TI', nama_unit: 'Seksi Kehumasan & Sistem Informasi' }
  ],
  rekanan: [
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
  ],
  bank: [
    'Bank Mandiri',
    'Bank Rakyat Indonesia (BRI)',
    'Bank Negara Indonesia (BNI)',
    'Bank Central Asia (BCA)',
    'Bank Syariah Indonesia (BSI)',
    'Bank Jatim',
    'Bank Tabungan Negara (BTN)'
  ],
  tipePembayaran: [
    'Tunai',
    'BIFast',
    'SKN',
    'RTGS',
    'SWIFT'
  ],
  jenisInvoice: [
    'Invoice Non matching',
    'Invoice matching'
  ],
  dha: [
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
  ],
  coa: [
    '5.1.02.01 - Biaya Honorarium Narasumber / MC Kegiatan',
    '5.1.02.04 - Biaya Sewa Kendaraan Operasional & Transportasi',
    '5.1.03.01 - Biaya Konsumsi Kegiatan Rapat & Sarasehan',
    '5.2.01.05 - Biaya Bantuan Sosial / Santunan Program Prioritas',
    '5.1.04.02 - Biaya Fasilitasi Pelaksana Program Pendukung UMKM',
    '5.1.05.01 - Biaya Publikasi, Dokumentasi & Perlengkapan Acara',
    '5.1.01.02 - Beban Perjalanan Dinas Dalam Negeri Operasional',
    '5.1.03.05 - Beban Pemeliharaan Peralatan Kantor & Teknologi Informasi'
  ],
  pejabatPengaju: [
    { nama: 'Ahmad Fauzi, S.E.', pangkat: 'Pelaksana Madya Keuangan' },
    { nama: 'Bambang Prasetyo, S.E., M.M.', pangkat: 'Asisten Manajer Pengadaan' },
    { nama: 'Rina Wulandari, S.Kom.', pangkat: 'Pelaksana Sistem Pembayaran' }
  ],
  pejabatPenyetuju: [
    { nama: 'Dra. Sri Wahyuni, M.Si.', pangkat: 'Kepala Seksi Keuangan & Akuntansi' },
    { nama: 'Ir. Gunawan Santoso, M.M.', pangkat: 'Deputi Kepala Perwakilan KPw BI Jember' },
    { nama: 'H. Mochammad Arifin, S.E., Ak.', pangkat: 'Manajer Operasional KPw BI Jember' }
  ],
  pegawaiList: [
    { id: 2, nip: '16244', nama: 'A Robith Mubarok', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK CENTRAL ASIA, TBK', noRek: '0246190288' },
    { id: 3, nip: '17379', nama: 'Achmad Maulidi Effendi', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK MANDIRI (PERSERO) TBK', noRek: '1430023910283' },
    { id: 4, nip: '14156', nama: 'Adam Masykur', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK MANDIRI (PERSERO) TBK', noRek: '1540019283741' },
    { id: 5, nip: '17388', nama: 'Adhytya Bagus Rizkianto', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK MANDIRI (PERSERO) TBK', noRek: '1430084920192' },
    { id: 6, nip: '16873', nama: 'Adi Purnomo', pangkat: 'Pelaksana', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Pengaju', status: 'Aktif', bank: 'PT. BANK NEGARA INDONESIA', noRek: '0334075091' },
    { id: 7, nip: '15133', nama: 'Agapito Ganesha J.M.N', pangkat: 'Asisten Manajer', jabatan: 'Maker', uker: 'Kantor Perwakilan Bank Indonesia Jember', peran: 'Pejabat Penyetuju', status: 'Aktif', bank: 'PT. BANK CENTRAL ASIA, TBK', noRek: '0243396601' }
  ]
};

async function getAllMasters(req, res, next) {
  try {
    let uker = [];
    let rekanan = [];
    let dha = [];
    let coa = [];
    let pegawaiList = [];
    let pejabatPengaju = [];
    let pejabatPenyetuju = [];

    // 1. Ambil data Uker & Unit Kerja
    let unitKerjaList = [];
    try {
      const [uRows] = await pool.query('SELECT id, COALESCE(kode_unit, "") AS kode_unit, COALESCE(nama_unit, "") AS nama_unit FROM unit_kerja ORDER BY id ASC');
      if (uRows && uRows.length > 0) {
        unitKerjaList = uRows.map(r => ({
          id: r.id,
          kode: String(r.kode_unit || '').trim(),
          nama: String(r.nama_unit || '').trim(),
          kode_unit: String(r.kode_unit || '').trim(),
          nama_unit: String(r.nama_unit || '').trim()
        }));
        uker = uRows.map(r => r.nama_unit).filter(Boolean);
      }
    } catch (errUker) {
      try {
        const [ukerRows] = await pool.query('SELECT nama_uker FROM master_uker WHERE is_active = 1');
        if (ukerRows && ukerRows.length > 0) {
          uker = ukerRows.map(r => r.nama_uker);
          unitKerjaList = ukerRows.map((r, i) => ({
            id: i + 1,
            kode: `UK-${i + 1}`,
            nama: r.nama_uker
          }));
        }
      } catch (e) {}
    }

    // 2. Ambil data Rekanan / Vendor
    try {
      await ensureRekananTable();
      const [rekananRows] = await pool.query(`
        SELECT 
          id, 
          COALESCE(nama_rekanan, '') AS nama, 
          COALESCE(alamat, '') AS alamat, 
          COALESCE(nik_npwp, '') AS nikNpwp, 
          COALESCE(nama_wp, '') AS namaWp, 
          COALESCE(bank_default, '') AS bank, 
          COALESCE(rekening_default, '') AS rekening, 
          COALESCE(atas_nama_default, '') AS atasNama 
        FROM master_rekanan 
        WHERE is_active = 1 
        ORDER BY id DESC
      `);
      if (rekananRows && rekananRows.length > 0) {
        rekanan = rekananRows;
      }
    } catch (errRekanan) {
      console.warn('Gagal membaca master_rekanan:', errRekanan.message);
      try {
        const [altRows] = await pool.query('SELECT * FROM rekanan LIMIT 100');
        if (altRows && altRows.length > 0) {
          rekanan = altRows.map((r, i) => ({
            id: r.id || i + 1,
            nama: r.nama_rekanan || r.nama || r.nama_vendor || '',
            alamat: r.alamat || '',
            nikNpwp: r.nik_npwp || r.nikNpwp || r.npwp || '',
            namaWp: r.nama_wp || r.namaWp || r.nama || '',
            bank: r.bank_default || r.bank || '',
            rekening: r.rekening_default || r.rekening || r.nomor_rekening || '',
            atasNama: r.atas_nama_default || r.atasNama || r.atas_nama || r.nama || ''
          }));
        }
      } catch (e2) {}
    }

    // 3. Ambil data DHA dari database
    try {
      const [dhaRows] = await pool.query(`
        SELECT 
          id, 
          COALESCE(dha, '') AS dha,
          COALESCE(dha, '') AS nama,
          COALESCE(rangkaian_coa, '') AS rangkaianCoa,
          COALESCE(anggaran, 0) AS anggaran,
          COALESCE(anggaran, 0) AS saldo,
          COALESCE(natural_akun, '') AS naturalAkun
        FROM master_coa 
        WHERE dha != '' AND dha IS NOT NULL
        ORDER BY id ASC
      `);
      if (dhaRows && dhaRows.length > 0) {
        dha = dhaRows;
      }
    } catch (errDha) {
      try {
        const [altDha] = await pool.query(`
          SELECT 
            id, 
            COALESCE(dha, nama_dha, '') AS dha,
            COALESCE(dha, nama_dha, '') AS nama,
            COALESCE(rangkaian_coa, '') AS rangkaianCoa,
            COALESCE(anggaran, saldo_tersedia, 0) AS anggaran,
            COALESCE(saldo_tersedia, anggaran, 0) AS saldo,
            COALESCE(natural_akun, '') AS naturalAkun
          FROM master_dha 
          WHERE is_active = 1
          ORDER BY id ASC
        `);
        if (altDha && altDha.length > 0) {
          dha = altDha;
        }
      } catch (eAlt) {}
    }

    // 4. Ambil data COA
    try {
      const [coaRows] = await pool.query('SELECT kode_coa, nama_akun FROM master_coa WHERE is_active = 1 ORDER BY kode_coa ASC');
      if (coaRows && coaRows.length > 0) {
        coa = coaRows.map(r => `${r.kode_coa} - ${r.nama_akun}`);
      }
    } catch (errCoa) {}

    if (coa.length === 0 && dha.length > 0) {
      const seen = new Set();
      for (const r of dha) {
        if (r.rangkaianCoa && !seen.has(r.rangkaianCoa)) {
          seen.add(r.rangkaianCoa);
          coa.push(r.naturalAkun ? `${r.rangkaianCoa} - ${r.naturalAkun}` : r.rangkaianCoa);
        }
      }
    }

    // 5. Ambil data Pegawai & Pejabat dari tabel `pejabat` (prioritas utama)
    try {
      let ukerMap = {};
      try {
        const [ukRows] = await pool.query('SELECT id, nama_unit FROM unit_kerja');
        ukRows.forEach(u => { ukerMap[u.id] = u.nama_unit; });
      } catch (eUk1) {
        try {
          const [ukRows2] = await pool.query('SELECT id, nama_uker AS nama_unit FROM master_uker');
          ukRows2.forEach(u => { ukerMap[u.id] = u.nama_unit; });
        } catch (eUk2) {}
      }

      // Query data tabel `pejabat` yang ada di database form_batch_erp
      const [pRows] = await pool.query(`
        SELECT 
          id, 
          COALESCE(nama, '') AS nama, 
          COALESCE(nip, '') AS nip, 
          COALESCE(pangkat, '') AS pangkat, 
          COALESCE(jabatan, '') AS jabatan, 
          COALESCE(alamat, '') AS alamat, 
          COALESCE(no_rek, '') AS noRek, 
          COALESCE(bank, '') AS bank, 
          unit_kerja_id AS unitKerjaId
        FROM pejabat 
        WHERE LOWER(TRIM(COALESCE(nama, ''))) != 'nama' 
          AND LOWER(TRIM(COALESCE(nip, ''))) != 'nip'
        ORDER BY id ASC
      `);

      if (pRows && pRows.length > 0) {
        pegawaiList = pRows.map(r => {
          let peran = 'Pejabat Pengaju';
          const jab = (r.jabatan || '').toLowerCase();
          const pangk = (r.pangkat || '').toLowerCase();

          if (
            jab.includes('checker') || 
            jab.includes('signer') || 
            jab.includes('approv') || 
            jab.includes('setuju') || 
            pangk.includes('manajer') || 
            pangk.includes('kepala') || 
            pangk.includes('deputi')
          ) {
            peran = 'Pejabat Penyetuju';
          }

          let satker = 'Kantor Perwakilan Bank Indonesia Jember';
          if (r.unitKerjaId && ukerMap[r.unitKerjaId]) {
            satker = ukerMap[r.unitKerjaId];
          } else if (r.alamat && r.alamat.includes('KPwBI')) {
            satker = 'KPw BI Jember';
          }

          return {
            id: r.id,
            nip: String(r.nip || '').trim(),
            nama: String(r.nama || '').trim(),
            pangkat: String(r.pangkat || r.jabatan || 'Pelaksana').trim(),
            jabatan: String(r.jabatan || '').trim(),
            uker: satker,
            peran: peran,
            status: 'Aktif',
            bank: String(r.bank || '').trim(),
            noRek: String(r.noRek || '').trim(),
            alamat: String(r.alamat || '').trim()
          };
        });

        // Pegawai Pengaju di form batch
        pejabatPengaju = pegawaiList.map(p => ({
          nama: p.nama,
          pangkat: p.pangkat ? `${p.pangkat} (${p.jabatan || 'Maker'})` : (p.jabatan || 'Pelaksana')
        }));

        // Pegawai Penyetuju di form batch
        const approvers = pegawaiList.filter(p => p.peran === 'Pejabat Penyetuju');
        pejabatPenyetuju = approvers.length > 0
          ? approvers.map(p => ({ nama: p.nama, pangkat: p.pangkat }))
          : pegawaiList.map(p => ({ nama: p.nama, pangkat: p.pangkat }));
      }
    } catch (errPejabat) {
      console.warn('[Master Warning] Gagal query tabel pejabat:', errPejabat.message);
      // Fallback ke master_pejabat jika tabel pejabat belum ada
      try {
        const [mpRows] = await pool.query("SELECT id, nip, nama_pejabat AS nama, pangkat_jabatan AS pangkat, role_pejabat AS role FROM master_pejabat WHERE is_active = 1");
        if (mpRows && mpRows.length > 0) {
          pegawaiList = mpRows.map(r => ({
            id: r.id,
            nip: r.nip || '-',
            nama: r.nama,
            pangkat: r.pangkat,
            jabatan: '',
            uker: 'Kantor Perwakilan Bank Indonesia Jember',
            peran: r.role === 'penyetuju' ? 'Pejabat Penyetuju' : 'Pejabat Pengaju',
            status: 'Aktif'
          }));
          pejabatPengaju = mpRows.filter(r => r.role === 'pengaju' || r.role === 'keduanya').map(r => ({ nama: r.nama, pangkat: r.pangkat }));
          pejabatPenyetuju = mpRows.filter(r => r.role === 'penyetuju' || r.role === 'keduanya').map(r => ({ nama: r.nama, pangkat: r.pangkat }));
        }
      } catch (eMp) {}
    }

    // 6. Ambil data Bank dari tabel `bank` (database form_batch_erp)
    let masterBankList = [];
    let bankList = [];
    try {
      const [bRows] = await pool.query(`
        SELECT 
          id, 
          COALESCE(kode_bank, '') AS kode_bank, 
          COALESCE(nama_bank, '') AS nama_bank 
        FROM bank 
        WHERE LOWER(TRIM(COALESCE(kode_bank, ''))) != 'kode bank' 
          AND LOWER(TRIM(COALESCE(nama_bank, ''))) != 'nama bank'
        ORDER BY id ASC
      `);

      if (bRows && bRows.length > 0) {
        masterBankList = bRows.map(r => {
          const nama = String(r.nama_bank || '').trim();
          const kode = String(r.kode_bank || '').trim();

          let jenis = 'Bank Umum Swasta / Asing';
          const upper = nama.toUpperCase();
          if (upper.includes('SYARIAH')) {
            jenis = 'Bank Syariah';
          } else if (
            upper.includes('MANDIRI') || 
            upper.includes('NEGARA INDONESIA') || 
            upper.includes('RAKYAT INDONESIA') || 
            upper.includes('TABUNGAN NEGARA')
          ) {
            jenis = 'Bank BUMN';
          } else if (
            upper.includes('DAERAH') || 
            upper.includes('BPD') || 
            upper.includes('JATIM') || 
            upper.includes('JABAR') || 
            upper.includes('DKI') || 
            upper.includes('JATENG')
          ) {
            jenis = 'Bank Pembangunan Daerah (BPD)';
          }

          return {
            id: r.id,
            kode: kode,
            nama: nama,
            singkatan: kode ? `BANK-${kode}` : 'BANK',
            jenis: jenis,
            swift: `ID${kode.padStart(3, '0')}`,
            kliring: 'BI-FAST / SKNBI / RTGS',
            status: 'Aktif'
          };
        });

        bankList = masterBankList.map(b => b.nama);
      }
    } catch (errBank) {
      console.warn('[Master Warning] Gagal query tabel bank:', errBank.message);
    }

    // 7. Ambil data Tipe/Jenis Pembayaran dari tabel `jenis_pembayaran`
    let tipePembayaranList = [];
    try {
      const [jpRows] = await pool.query('SELECT jenis FROM jenis_pembayaran ORDER BY id ASC');
      if (jpRows && jpRows.length > 0) {
        tipePembayaranList = jpRows.map(r => r.jenis).filter(Boolean);
      }
    } catch (errJp) {
      console.warn('[Master Warning] Gagal query jenis_pembayaran:', errJp.message);
    }

    if (tipePembayaranList.length === 0) {
      try {
        const [colRows] = await pool.query("SHOW COLUMNS FROM jenis_pembayaran LIKE 'jenis'");
        if (colRows && colRows.length > 0) {
          const typeStr = colRows[0].Type;
          const match = typeStr.match(/enum\((.*)\)/i);
          if (match && match[1]) {
            tipePembayaranList = match[1].split(',').map(s => s.replace(/'/g, '').trim());
          }
        }
      } catch (eEnum) {}
    }

    if (tipePembayaranList.length === 0) {
      tipePembayaranList = FALLBACK_MASTERS.tipePembayaran;
    }

    res.json({
      success: true,
      data: {
        ukerList: uker.length > 0 ? uker : FALLBACK_MASTERS.uker,
        unitKerjaList: unitKerjaList.length > 0 ? unitKerjaList : FALLBACK_MASTERS.unitKerjaList,
        rekananPresets: rekanan.length > 0 ? rekanan : FALLBACK_MASTERS.rekanan,
        bankList: bankList.length > 0 ? bankList : FALLBACK_MASTERS.bank,
        masterBankList: masterBankList.length > 0 ? masterBankList : [],
        tipePembayaranList: tipePembayaranList,
        jenisInvoiceList: FALLBACK_MASTERS.jenisInvoice,
        dhaList: dha.length > 0 ? dha : FALLBACK_MASTERS.dha,
        coaList: coa.length > 0 ? coa : FALLBACK_MASTERS.coa,
        pegawaiList: pegawaiList.length > 0 ? pegawaiList : FALLBACK_MASTERS.pegawaiList,
        pejabatPengajuList: pejabatPengaju.length > 0 ? pejabatPengaju : FALLBACK_MASTERS.pejabatPengaju,
        pejabatPenyetujuList: pejabatPenyetuju.length > 0 ? pejabatPenyetuju : FALLBACK_MASTERS.pejabatPenyetuju
      }
    });
  } catch (error) {
    res.json({
      success: true,
      data: FALLBACK_MASTERS,
      warning: error.message
    });
  }
}

// GET /api/masters/pegawai
async function getPegawai(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        COALESCE(nama, '') AS nama, 
        COALESCE(nip, '') AS nip, 
        COALESCE(pangkat, '') AS pangkat, 
        COALESCE(jabatan, '') AS jabatan, 
        COALESCE(alamat, '') AS alamat, 
        COALESCE(no_rek, '') AS noRek, 
        COALESCE(bank, '') AS bank, 
        unit_kerja_id AS unitKerjaId
      FROM pejabat 
      WHERE LOWER(TRIM(COALESCE(nama, ''))) != 'nama' 
        AND LOWER(TRIM(COALESCE(nip, ''))) != 'nip'
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows.map(r => ({
        id: r.id,
        nip: String(r.nip || '').trim(),
        nama: String(r.nama || '').trim(),
        pangkat: String(r.pangkat || r.jabatan || 'Pelaksana').trim(),
        jabatan: String(r.jabatan || '').trim(),
        uker: 'Kantor Perwakilan Bank Indonesia Jember',
        peran: ((r.jabatan || '').toLowerCase().includes('signer') || (r.pangkat || '').toLowerCase().includes('manajer')) ? 'Pejabat Penyetuju' : 'Pejabat Pengaju',
        status: 'Aktif',
        bank: String(r.bank || '').trim(),
        noRek: String(r.noRek || '').trim(),
        alamat: String(r.alamat || '').trim()
      }))
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/masters/pegawai
async function createPegawai(req, res, next) {
  try {
    const { nama, nip, pangkat, jabatan = 'Maker', alamat = 'KPwBI Jember', noRek = '', bank = '' } = req.body;
    if (!nama || !nip) {
      return res.status(400).json({ success: false, message: 'Nama dan NIP wajib diisi' });
    }
    const [result] = await pool.query(
      `INSERT INTO pejabat (nama, nip, pangkat, jabatan, alamat, no_rek, bank) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama, nip, pangkat || 'Pelaksana', jabatan, alamat, noRek, bank]
    );
    res.status(201).json({
      success: true,
      message: 'Data pegawai berhasil disimpan ke database',
      data: {
        id: result.insertId,
        nama,
        nip,
        pangkat,
        jabatan,
        uker: 'Kantor Perwakilan Bank Indonesia Jember',
        status: 'Aktif'
      }
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/masters/pegawai/:id
async function updatePegawai(req, res, next) {
  try {
    const { id } = req.params;
    const { nama, nip, pangkat, jabatan = 'Maker', alamat = '', noRek = '', bank = '' } = req.body;
    await pool.query(
      `UPDATE pejabat SET nama = ?, nip = ?, pangkat = ?, jabatan = ?, alamat = COALESCE(NULLIF(?, ''), alamat), no_rek = COALESCE(NULLIF(?, ''), no_rek), bank = COALESCE(NULLIF(?, ''), bank) WHERE id = ?`,
      [nama, nip, pangkat, jabatan, alamat, noRek, bank, id]
    );
    res.json({
      success: true,
      message: 'Data pegawai berhasil diperbarui di database'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/masters/pegawai/:id
async function deletePegawai(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM pejabat WHERE id = ?`, [id]);
    res.json({
      success: true,
      message: 'Data pegawai berhasil dihapus dari database'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/masters/banks
async function getBanks(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        COALESCE(kode_bank, '') AS kode_bank, 
        COALESCE(nama_bank, '') AS nama_bank 
      FROM bank 
      WHERE LOWER(TRIM(COALESCE(kode_bank, ''))) != 'kode bank' 
        AND LOWER(TRIM(COALESCE(nama_bank, ''))) != 'nama bank'
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows.map(r => {
        const nama = String(r.nama_bank || '').trim();
        const kode = String(r.kode_bank || '').trim();

        let jenis = 'Bank Umum Swasta / Asing';
        const upper = nama.toUpperCase();
        if (upper.includes('SYARIAH')) {
          jenis = 'Bank Syariah';
        } else if (
          upper.includes('MANDIRI') || 
          upper.includes('NEGARA INDONESIA') || 
          upper.includes('RAKYAT INDONESIA') || 
          upper.includes('TABUNGAN NEGARA')
        ) {
          jenis = 'Bank BUMN';
        } else if (
          upper.includes('DAERAH') || 
          upper.includes('BPD') || 
          upper.includes('JATIM') || 
          upper.includes('JABAR') || 
          upper.includes('DKI') || 
          upper.includes('JATENG')
        ) {
          jenis = 'Bank Pembangunan Daerah (BPD)';
        }

        return {
          id: r.id,
          kode: kode,
          nama: nama,
          singkatan: kode ? `BANK-${kode}` : 'BANK',
          jenis: jenis,
          swift: `ID${kode.padStart(3, '0')}`,
          kliring: 'BI-FAST / SKNBI / RTGS',
          status: 'Aktif'
        };
      })
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/masters/banks
async function createBank(req, res, next) {
  try {
    const { kode, nama } = req.body;
    if (!kode || !nama) {
      return res.status(400).json({ success: false, message: 'Kode bank dan nama bank wajib diisi' });
    }
    const cleanKode = String(kode).trim();
    const cleanNama = String(nama).trim();
    const [result] = await pool.query(
      `INSERT INTO bank (kode_bank, nama_bank) VALUES (?, ?)`,
      [cleanKode, cleanNama]
    );
    res.status(201).json({
      success: true,
      message: 'Data bank berhasil disimpan ke database',
      data: {
        id: result.insertId,
        kode: cleanKode,
        nama: cleanNama,
        singkatan: cleanKode ? `BANK-${cleanKode}` : 'BANK',
        jenis: 'Bank Umum Swasta / Asing',
        swift: `ID${cleanKode.padStart(3, '0')}`,
        kliring: 'BI-FAST / SKNBI / RTGS',
        status: 'Aktif'
      }
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/masters/banks/:id
async function updateBank(req, res, next) {
  try {
    const { id } = req.params;
    const { kode, nama } = req.body;
    await pool.query(
      `UPDATE bank SET kode_bank = ?, nama_bank = ? WHERE id = ?`,
      [String(kode).trim(), String(nama).trim(), id]
    );
    res.json({
      success: true,
      message: 'Data bank berhasil diperbarui di database'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/masters/banks/:id
async function deleteBank(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM bank WHERE id = ?`, [id]);
    res.json({
      success: true,
      message: 'Data bank berhasil dihapus dari database'
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/masters/unit-kerja
async function getUnitKerja(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        COALESCE(kode_unit, '') AS kode_unit, 
        COALESCE(nama_unit, '') AS nama_unit 
      FROM unit_kerja 
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      data: rows.map(r => ({
        id: r.id,
        kode: String(r.kode_unit || '').trim(),
        nama: String(r.nama_unit || '').trim()
      }))
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/masters/unit-kerja
async function createUnitKerja(req, res, next) {
  try {
    const rawKode = req.body.kode_unit !== undefined ? req.body.kode_unit : req.body.kode;
    const rawNama = req.body.nama_unit !== undefined ? req.body.nama_unit : req.body.nama;
    if (!rawNama || !String(rawNama).trim()) {
      return res.status(400).json({ success: false, message: 'Nama unit kerja wajib diisi' });
    }
    const cleanKode = String(rawKode || '').trim();
    const cleanNama = String(rawNama || '').trim();
    const [result] = await pool.query(
      `INSERT INTO unit_kerja (kode_unit, nama_unit) VALUES (?, ?)`,
      [cleanKode, cleanNama]
    );
    res.status(201).json({
      success: true,
      message: 'Data unit kerja berhasil disimpan ke database',
      data: {
        id: result.insertId,
        kode: cleanKode,
        nama: cleanNama,
        kode_unit: cleanKode,
        nama_unit: cleanNama
      }
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/masters/unit-kerja/:id
async function updateUnitKerja(req, res, next) {
  try {
    const { id } = req.params;
    const rawKode = req.body.kode_unit !== undefined ? req.body.kode_unit : req.body.kode;
    const rawNama = req.body.nama_unit !== undefined ? req.body.nama_unit : req.body.nama;
    const cleanKode = String(rawKode || '').trim();
    const cleanNama = String(rawNama || '').trim();
    await pool.query(
      `UPDATE unit_kerja SET kode_unit = ?, nama_unit = ? WHERE id = ?`,
      [cleanKode, cleanNama, id]
    );
    res.json({
      success: true,
      message: 'Data unit kerja berhasil diperbarui di database'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/masters/unit-kerja/:id
async function deleteUnitKerja(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM unit_kerja WHERE id = ?`, [id]);
    res.json({
      success: true,
      message: 'Data unit kerja berhasil dihapus dari database'
    });
  } catch (err) {
    next(err);
  }
}

// =============================================
// CRUD MASTER REKANAN / VENDOR
// =============================================

// Helper: Memastikan tabel master_rekanan ada di database MySQL dan ada data awal
async function ensureRekananTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS master_rekanan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_rekanan VARCHAR(255) NOT NULL,
        alamat TEXT NULL,
        nik_npwp VARCHAR(50) NULL,
        nama_wp VARCHAR(255) NULL,
        bank_default VARCHAR(100) NULL,
        rekening_default VARCHAR(50) NULL,
        atas_nama_default VARCHAR(255) NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Jika tabel kosong, inisialisasi dengan data default dari FALLBACK_MASTERS
    const [cnt] = await pool.query('SELECT COUNT(*) AS total FROM master_rekanan');
    if (cnt[0]?.total === 0 && Array.isArray(FALLBACK_MASTERS.rekanan)) {
      for (const r of FALLBACK_MASTERS.rekanan) {
        await pool.query(
          `INSERT INTO master_rekanan (nama_rekanan, alamat, nik_npwp, nama_wp, bank_default, rekening_default, atas_nama_default, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
          [r.nama, r.alamat, r.nikNpwp, r.namaWp || r.nama, r.bank, r.rekening, r.atasNama || r.nama]
        );
      }
    }
  } catch (errEnsure) {
    console.warn('[Database Notice] Gagal verifikasi/inisialisasi master_rekanan:', errEnsure.message);
  }
}

// GET /api/masters/rekanan
async function getRekanan(req, res, next) {
  try {
    await ensureRekananTable();
    const [rows] = await pool.query(`
      SELECT
        id,
        COALESCE(nama_rekanan, '') AS nama,
        COALESCE(alamat, '') AS alamat,
        COALESCE(nik_npwp, '') AS nikNpwp,
        COALESCE(nama_wp, '') AS namaWp,
        COALESCE(bank_default, '') AS bank,
        COALESCE(rekening_default, '') AS rekening,
        COALESCE(atas_nama_default, '') AS atasNama,
        is_active AS isActive
      FROM master_rekanan
      WHERE is_active = 1
      ORDER BY id DESC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

// POST /api/masters/rekanan
async function createRekanan(req, res, next) {
  try {
    await ensureRekananTable();
    const { nama, alamat, nikNpwp, namaWp, bank, rekening, atasNama } = req.body;
    if (!nama || !nama.trim()) {
      return res.status(400).json({ success: false, message: 'Nama Rekanan wajib diisi' });
    }
    const cleanNama = nama.trim();
    const cleanAlamat = (alamat || '').trim();
    const cleanNikNpwp = (nikNpwp && String(nikNpwp).trim()) ? String(nikNpwp).trim() : '-';
    const cleanNamaWp = (namaWp && String(namaWp).trim()) ? String(namaWp).trim() : cleanNama;
    const cleanBank = (bank || '').trim();
    const cleanRekening = (rekening || '').trim();
    const cleanAtasNama = (atasNama && String(atasNama).trim()) ? String(atasNama).trim() : cleanNama;

    const [result] = await pool.query(
      `INSERT INTO master_rekanan (nama_rekanan, alamat, nik_npwp, nama_wp, bank_default, rekening_default, atas_nama_default, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        cleanNama,
        cleanAlamat,
        cleanNikNpwp,
        cleanNamaWp,
        cleanBank,
        cleanRekening,
        cleanAtasNama
      ]
    );

    res.status(201).json({
      success: true,
      message: `Rekanan ${cleanNama} berhasil disimpan ke database`,
      data: {
        id: result.insertId,
        nama: cleanNama,
        alamat: cleanAlamat,
        nikNpwp: cleanNikNpwp,
        namaWp: cleanNamaWp,
        bank: cleanBank,
        rekening: cleanRekening,
        atasNama: cleanAtasNama
      }
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/masters/rekanan/:id
async function updateRekanan(req, res, next) {
  try {
    await ensureRekananTable();
    const { id } = req.params;
    const { nama, alamat, nikNpwp, namaWp, bank, rekening, atasNama } = req.body;
    if (!nama || !nama.trim()) {
      return res.status(400).json({ success: false, message: 'Nama Rekanan wajib diisi' });
    }
    const cleanNama = nama.trim();
    const cleanAlamat = (alamat || '').trim();
    const cleanNikNpwp = (nikNpwp && String(nikNpwp).trim()) ? String(nikNpwp).trim() : '-';
    const cleanNamaWp = (namaWp && String(namaWp).trim()) ? String(namaWp).trim() : cleanNama;
    const cleanBank = (bank || '').trim();
    const cleanRekening = (rekening || '').trim();
    const cleanAtasNama = (atasNama && String(atasNama).trim()) ? String(atasNama).trim() : cleanNama;

    await pool.query(
      `UPDATE master_rekanan
       SET nama_rekanan = ?, alamat = ?, nik_npwp = ?, nama_wp = ?,
           bank_default = ?, rekening_default = ?, atas_nama_default = ?
       WHERE id = ?`,
      [
        cleanNama,
        cleanAlamat,
        cleanNikNpwp,
        cleanNamaWp,
        cleanBank,
        cleanRekening,
        cleanAtasNama,
        id
      ]
    );
    res.json({ success: true, message: `Data rekanan ${cleanNama} berhasil diperbarui di database` });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/masters/rekanan/:id
async function deleteRekanan(req, res, next) {
  try {
    await ensureRekananTable();
    const { id } = req.params;
    await pool.query(`UPDATE master_rekanan SET is_active = 0 WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Data rekanan berhasil dihapus dari database' });
  } catch (err) {
    next(err);
  }
}

// =============================================
// CRUD MASTER DHA & ANGGARAN
// =============================================

async function ensureDhaTable() {
  try {
    const [cols] = await pool.query("SHOW COLUMNS FROM master_coa LIKE 'dha'");
    if (cols && cols.length > 0) {
      return 'master_coa';
    }
  } catch (e) {}

  try {
    const [tbls] = await pool.query("SHOW TABLES LIKE 'master_dha'");
    if (tbls && tbls.length > 0) {
      return 'master_dha';
    }
  } catch (e) {}

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS master_dha (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dha TEXT NOT NULL,
        rangkaian_coa VARCHAR(100) NOT NULL,
        anggaran DECIMAL(18,2) NOT NULL DEFAULT 0.00,
        natural_akun VARCHAR(255) NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    return 'master_dha';
  } catch (e) {
    return 'master_coa';
  }
}

// GET /api/masters/dha
async function getDha(req, res, next) {
  try {
    const table = await ensureDhaTable();
    const [rows] = await pool.query(`
      SELECT 
        id, 
        COALESCE(dha, '') AS dha,
        COALESCE(dha, '') AS nama,
        COALESCE(rangkaian_coa, '') AS rangkaianCoa,
        COALESCE(anggaran, 0) AS anggaran,
        COALESCE(anggaran, 0) AS saldo,
        COALESCE(natural_akun, '') AS naturalAkun
      FROM \`${table}\`
      WHERE dha != '' AND dha IS NOT NULL
      ORDER BY id ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
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

// POST /api/masters/dha
async function createDha(req, res, next) {
  try {
    const table = await ensureDhaTable();
    const cleanDha = String(req.body.dha || req.body.nama || '').trim();
    const cleanCoa = String(req.body.rangkaianCoa || req.body.rangkaian_coa || '').trim();
    const cleanAnggaran = parseCurrencyNumber(req.body.anggaran !== undefined ? req.body.anggaran : req.body.saldo);
    const cleanNatural = String(req.body.naturalAkun || req.body.natural_akun || '').trim();

    if (!cleanDha || !cleanCoa) {
      return res.status(400).json({ success: false, message: 'DHA dan Rangkaian COA wajib diisi!' });
    }

    let hasSaldoCol = false;
    let hasPaguCol = false;
    try {
      const [cols] = await pool.query(`SHOW COLUMNS FROM \`${table}\``);
      const colNames = cols.map(c => c.Field.toLowerCase());
      hasSaldoCol = colNames.includes('saldo_tersedia');
      hasPaguCol = colNames.includes('pagu_awal');
    } catch (eCols) {}

    let result;
    if (hasSaldoCol && hasPaguCol) {
      const [r] = await pool.query(
        `INSERT INTO \`${table}\` (dha, rangkaian_coa, anggaran, natural_akun, saldo_tersedia, pagu_awal) VALUES (?, ?, ?, ?, ?, ?)`,
        [cleanDha, cleanCoa, cleanAnggaran, cleanNatural, cleanAnggaran, cleanAnggaran]
      );
      result = r;
    } else {
      const [r] = await pool.query(
        `INSERT INTO \`${table}\` (dha, rangkaian_coa, anggaran, natural_akun) VALUES (?, ?, ?, ?)`,
        [cleanDha, cleanCoa, cleanAnggaran, cleanNatural]
      );
      result = r;
    }

    res.status(201).json({
      success: true,
      message: 'Data DHA berhasil disimpan ke database',
      data: {
        id: result.insertId,
        dha: cleanDha,
        nama: cleanDha,
        rangkaianCoa: cleanCoa,
        anggaran: cleanAnggaran,
        saldo: cleanAnggaran,
        naturalAkun: cleanNatural
      }
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/masters/dha/:id
async function updateDha(req, res, next) {
  try {
    const table = await ensureDhaTable();
    const { id } = req.params;
    const cleanDha = String(req.body.dha || req.body.nama || '').trim();
    const cleanCoa = String(req.body.rangkaianCoa || req.body.rangkaian_coa || '').trim();
    const cleanAnggaran = parseCurrencyNumber(req.body.anggaran !== undefined ? req.body.anggaran : req.body.saldo);
    const cleanNatural = String(req.body.naturalAkun || req.body.natural_akun || '').trim();

    let hasSaldoCol = false;
    let hasPaguCol = false;
    try {
      const [cols] = await pool.query(`SHOW COLUMNS FROM \`${table}\``);
      const colNames = cols.map(c => c.Field.toLowerCase());
      hasSaldoCol = colNames.includes('saldo_tersedia');
      hasPaguCol = colNames.includes('pagu_awal');
    } catch (eCols) {}

    if (hasSaldoCol && hasPaguCol) {
      await pool.query(
        `UPDATE \`${table}\` SET dha = ?, rangkaian_coa = ?, anggaran = ?, natural_akun = ?, saldo_tersedia = ?, pagu_awal = ? WHERE id = ?`,
        [cleanDha, cleanCoa, cleanAnggaran, cleanNatural, cleanAnggaran, cleanAnggaran, id]
      );
    } else {
      await pool.query(
        `UPDATE \`${table}\` SET dha = ?, rangkaian_coa = ?, anggaran = ?, natural_akun = ? WHERE id = ?`,
        [cleanDha, cleanCoa, cleanAnggaran, cleanNatural, id]
      );
    }

    res.json({
      success: true,
      message: 'Data DHA berhasil diperbarui di database'
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/masters/dha/:id
async function deleteDha(req, res, next) {
  try {
    const table = await ensureDhaTable();
    const { id } = req.params;
    await pool.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
    res.json({
      success: true,
      message: 'Data DHA berhasil dihapus dari database'
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/masters/dha/import
async function importDha(req, res, next) {
  try {
    const table = await ensureDhaTable();
    const { items, mode = 'upsert' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Tidak ada data item DHA yang dikirim untuk diimpor.' });
    }

    const validRows = [];
    for (const item of items) {
      const dha = String(item.dha || item.nama || '').trim();
      const rangkaianCoa = String(item.rangkaianCoa || item.rangkaian_coa || '').trim();
      const rawAnggaran = item.anggaran !== undefined ? item.anggaran : item.saldo;
      const anggaran = parseCurrencyNumber(rawAnggaran);
      const naturalAkun = String(item.naturalAkun || item.natural_akun || '').trim();

      if (dha || rangkaianCoa) {
        validRows.push({ dha, rangkaianCoa, anggaran, naturalAkun });
      }
    }

    if (validRows.length === 0) {
      return res.status(400).json({ success: false, message: 'Data dalam file tidak mengandung baris DHA atau Rangkaian COA yang valid.' });
    }

    let hasSaldoCol = false;
    let hasPaguCol = false;
    try {
      const [cols] = await pool.query(`SHOW COLUMNS FROM \`${table}\``);
      const colNames = cols.map(c => c.Field.toLowerCase());
      hasSaldoCol = colNames.includes('saldo_tersedia');
      hasPaguCol = colNames.includes('pagu_awal');
    } catch (eCols) {}

    const insertCols = hasSaldoCol && hasPaguCol
      ? '(dha, rangkaian_coa, anggaran, natural_akun, saldo_tersedia, pagu_awal)'
      : '(dha, rangkaian_coa, anggaran, natural_akun)';

    const rowMapper = (r) => hasSaldoCol && hasPaguCol
      ? [r.dha, r.rangkaianCoa, r.anggaran, r.naturalAkun, r.anggaran, r.anggaran]
      : [r.dha, r.rangkaianCoa, r.anggaran, r.naturalAkun];

    if (mode === 'replace') {
      await pool.query(`DELETE FROM \`${table}\``);
      const chunkSize = 500;
      for (let i = 0; i < validRows.length; i += chunkSize) {
        const chunk = validRows.slice(i, i + chunkSize).map(rowMapper);
        await pool.query(
          `INSERT INTO \`${table}\` ${insertCols} VALUES ?`,
          [chunk]
        );
      }
    } else if (mode === 'upsert') {
      // Map existing records by rangkaian_coa or dha
      const [existing] = await pool.query(`SELECT id, dha, rangkaian_coa FROM \`${table}\``);
      const coaMap = new Map();
      const dhaMap = new Map();
      for (const ex of existing) {
        if (ex.rangkaian_coa && ex.rangkaian_coa.trim()) {
          coaMap.set(ex.rangkaian_coa.trim().toLowerCase(), ex.id);
        }
        if (ex.dha && ex.dha.trim()) {
          dhaMap.set(ex.dha.trim().toLowerCase(), ex.id);
        }
      }

      const toInsert = [];
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        for (const item of validRows) {
          const coaKey = item.rangkaianCoa ? item.rangkaianCoa.toLowerCase() : '';
          const dhaKey = item.dha ? item.dha.toLowerCase() : '';
          const existingId = (coaKey && coaMap.get(coaKey)) || (dhaKey && dhaMap.get(dhaKey));

          if (existingId) {
            if (hasSaldoCol && hasPaguCol) {
              await conn.query(
                `UPDATE \`${table}\` SET dha = ?, rangkaian_coa = ?, anggaran = ?, natural_akun = ?, saldo_tersedia = ?, pagu_awal = ? WHERE id = ?`,
                [item.dha, item.rangkaianCoa, item.anggaran, item.naturalAkun, item.anggaran, item.anggaran, existingId]
              );
            } else {
              await conn.query(
                `UPDATE \`${table}\` SET dha = ?, rangkaian_coa = ?, anggaran = ?, natural_akun = ? WHERE id = ?`,
                [item.dha, item.rangkaianCoa, item.anggaran, item.naturalAkun, existingId]
              );
            }
          } else {
            toInsert.push(rowMapper(item));
            if (coaKey) coaMap.set(coaKey, true);
            if (dhaKey) dhaMap.set(dhaKey, true);
          }
        }

        if (toInsert.length > 0) {
          const chunkSize = 500;
          for (let i = 0; i < toInsert.length; i += chunkSize) {
            const chunk = toInsert.slice(i, i + chunkSize);
            await conn.query(
              `INSERT INTO \`${table}\` ${insertCols} VALUES ?`,
              [chunk]
            );
          }
        }
        await conn.commit();
      } catch (upsertErr) {
        await conn.rollback();
        throw upsertErr;
      } finally {
        conn.release();
      }
    } else {
      // Mode append: tambahkan baris baru
      const chunkSize = 500;
      for (let i = 0; i < validRows.length; i += chunkSize) {
        const chunk = validRows.slice(i, i + chunkSize).map(rowMapper);
        await pool.query(
          `INSERT INTO \`${table}\` ${insertCols} VALUES ?`,
          [chunk]
        );
      }
    }

    res.json({
      success: true,
      message: `Berhasil mengimpor ${validRows.length} data DHA ke database (Mode: ${mode})!`,
      count: validRows.length
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllMasters,
  getPegawai,
  createPegawai,
  updatePegawai,
  deletePegawai,
  getBanks,
  createBank,
  updateBank,
  deleteBank,
  getUnitKerja,
  createUnitKerja,
  updateUnitKerja,
  deleteUnitKerja,
  getRekanan,
  createRekanan,
  updateRekanan,
  deleteRekanan,
  getDha,
  createDha,
  updateDha,
  deleteDha,
  importDha,
  FALLBACK_MASTERS
};
