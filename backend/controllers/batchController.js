const { pool } = require('../config/database');

async function getBatches(req, res, next) {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      criteria = 'semua',
      startDate = '',
      endDate = '',
      uker = '',
      status = '',
      tipePembayaran = '',
      sortBy = 'id',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

    let whereClauses = ['b.is_deleted = 0'];
    let params = [];

    // Search query
    if (search.trim()) {
      const q = `%${search.trim()}%`;
      if (criteria === 'noBatch') {
        whereClauses.push('b.no_batch LIKE ?');
        params.push(q);
      } else if (criteria === 'noDokumen') {
        whereClauses.push('b.no_dokumen LIKE ?');
        params.push(q);
      } else if (criteria === 'perihal') {
        whereClauses.push('b.perihal LIKE ?');
        params.push(q);
      } else if (criteria === 'dariUker') {
        whereClauses.push('b.dari_uker LIKE ?');
        params.push(q);
      } else if (criteria === 'rekanan') {
        whereClauses.push('b.nama_rekanan LIKE ?');
        params.push(q);
      } else {
        whereClauses.push('(b.no_batch LIKE ? OR b.no_dokumen LIKE ? OR b.perihal LIKE ? OR b.dari_uker LIKE ? OR b.nama_rekanan LIKE ?)');
        params.push(q, q, q, q, q);
      }
    }

    if (startDate) {
      whereClauses.push('b.tgl_transaksi >= ?');
      params.push(startDate);
    }
    if (endDate) {
      whereClauses.push('b.tgl_transaksi <= ?');
      params.push(endDate);
    }
    if (uker) {
      whereClauses.push('b.dari_uker = ?');
      params.push(uker);
    }
    if (status) {
      whereClauses.push('b.status = ?');
      params.push(status);
    }
    if (tipePembayaran) {
      whereClauses.push('b.tipe_pembayaran = ?');
      params.push(tipePembayaran);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const allowedSortCols = {
      id: 'b.id',
      noBatch: 'b.no_batch',
      noDokumen: 'b.no_dokumen',
      tglTransaksi: 'b.tgl_transaksi',
      status: 'b.status',
      nominalTotal: 'total_nominal'
    };
    const orderCol = allowedSortCols[sortBy] || 'b.id';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM batches b ${whereSql}`,
      params
    );
    const totalRecords = countRows[0].total;

    const querySql = `
      SELECT 
        b.id,
        b.no_batch AS noBatch,
        b.no_dokumen AS noDokumen,
        DATE_FORMAT(b.tgl_transaksi, '%Y-%m-%d') AS tglTransaksi,
        b.dari_uker AS dariUker,
        b.kepada_uker AS kepadaUker,
        b.perihal,
        b.nama_rekanan AS namaRekanan,
        b.alamat_rekanan AS alamatRekanan,
        b.nik_npwp AS nikNpwp,
        b.nama_wp_rekanan AS namaWpRekanan,
        b.no_faktur_pajak AS noFakturPajak,
        DATE_FORMAT(b.tgl_faktur_pajak, '%Y-%m-%d') AS tglFakturPajak,
        b.tipe_pembayaran AS tipePembayaran,
        b.nama_bank AS namaBank,
        b.nama_rekening AS namaRekening,
        b.nomor_rekening AS nomorRekening,
        b.beban_anggaran_uker AS bebanAnggaranUker,
        b.jenis_invoice AS jenisInvoice,
        b.nama_dha AS namaDha,
        b.yang_mengajukan AS yangMengajukan,
        b.pangkat_mengajukan AS pangkatMengajukan,
        b.yang_menyetujui AS yangMenyetujui,
        b.pangkat_menyetujui AS pangkatMenyetujui,
        b.status,
        b.created_by AS createdBy,
        b.created_at AS createdAt,
        COALESCE(SUM(bi.nominal), 0) AS totalNominal
      FROM batches b
      LEFT JOIN batch_invoices bi ON b.id = bi.batch_id
      ${whereSql}
      GROUP BY b.id
      ORDER BY ${orderCol} ${orderDirection}
      LIMIT ? OFFSET ?
    `;

    const [batchRows] = await pool.query(querySql, [...params, validLimit, offset]);

    if (batchRows.length > 0) {
      const batchIds = batchRows.map(r => r.id);
      const [invoiceRows] = await pool.query(
        `SELECT batch_id, slot_index, no_invoice AS noInvoice, DATE_FORMAT(tgl_invoice, '%Y-%m-%d') AS tglInvoice, nominal 
         FROM batch_invoices WHERE batch_id IN (?) ORDER BY slot_index ASC`,
        [batchIds]
      );
      const [coaRows] = await pool.query(
        `SELECT batch_id, slot_index, rangkaian_coa AS rangkaianCoa, COALESCE(natural_akun, '') AS naturalAkun, nominal 
         FROM batch_coas WHERE batch_id IN (?) ORDER BY slot_index ASC`,
        [batchIds]
      );

      const invoicesByBatch = {};
      invoiceRows.forEach(inv => {
        if (!invoicesByBatch[inv.batch_id]) invoicesByBatch[inv.batch_id] = [];
        invoicesByBatch[inv.batch_id].push({
          noInvoice: inv.noInvoice || '',
          tglInvoice: inv.tglInvoice || '',
          nominal: Number(inv.nominal) || 0
        });
      });

      const coasByBatch = {};
      coaRows.forEach(c => {
        if (!coasByBatch[c.batch_id]) coasByBatch[c.batch_id] = [];
        coasByBatch[c.batch_id].push({
          rangkaianCoa: c.rangkaianCoa || '',
          naturalAkun: c.naturalAkun || '',
          nominal: Number(c.nominal) || 0
        });
      });

      batchRows.forEach(b => {
        b.invoices = invoicesByBatch[b.id] || [
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 },
          { noInvoice: '', tglInvoice: '', nominal: 0 }
        ];
        b.coas = coasByBatch[b.id] || [
          { rangkaianCoa: '', nominal: 0 },
          { rangkaianCoa: '', nominal: 0 },
          { rangkaianCoa: '', nominal: 0 }
        ];
      });
    }

    res.json({
      success: true,
      data: batchRows,
      pagination: {
        total: totalRecords,
        page: parseInt(page),
        limit: validLimit,
        totalPages: Math.ceil(totalRecords / validLimit)
      }
    });
  } catch (error) {
    console.error('[Database Error in getBatches]:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal membaca transaksi batch dari database: ' + error.message,
      data: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 }
    });
  }
}

async function checkDocDuplicate(req, res, next) {
  try {
    const { noDokumen, excludeId } = req.query;
    if (!noDokumen) {
      return res.json({ success: true, isDuplicate: false });
    }

    let query = 'SELECT id, no_batch FROM batches WHERE no_dokumen = ? AND is_deleted = 0';
    let params = [noDokumen.trim()];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      isDuplicate: rows.length > 0,
      existingBatch: rows[0] || null
    });
  } catch (error) {
    next(error);
  }
}

async function getBatchById(req, res, next) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT 
        b.id, b.no_batch AS noBatch, b.no_dokumen AS noDokumen,
        DATE_FORMAT(b.tgl_transaksi, '%Y-%m-%d') AS tglTransaksi,
        b.dari_uker AS dariUker, b.kepada_uker AS kepadaUker, b.perihal,
        b.nama_rekanan AS namaRekanan, b.alamat_rekanan AS alamatRekanan,
        b.nik_npwp AS nikNpwp, b.nama_wp_rekanan AS namaWpRekanan,
        b.no_faktur_pajak AS noFakturPajak,
        DATE_FORMAT(b.tgl_faktur_pajak, '%Y-%m-%d') AS tglFakturPajak,
        b.tipe_pembayaran AS tipePembayaran, b.nama_bank AS namaBank,
        b.nama_rekening AS namaRekening, b.nomor_rekening AS nomorRekening,
        b.beban_anggaran_uker AS bebanAnggaranUker, b.jenis_invoice AS jenisInvoice,
        b.nama_dha AS namaDha, b.yang_mengajukan AS yangMengajukan,
        b.pangkat_mengajukan AS pangkatMengajukan, b.yang_menyetujui AS yangMenyetujui,
        b.pangkat_menyetujui AS pangkatMenyetujui, b.status, b.created_by AS createdBy
      FROM batches b WHERE b.id = ? AND b.is_deleted = 0`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data batch tidak ditemukan' });
    }

    const batch = rows[0];

    const [invoices] = await pool.query(
      `SELECT slot_index, no_invoice AS noInvoice, DATE_FORMAT(tgl_invoice, '%Y-%m-%d') AS tglInvoice, nominal 
       FROM batch_invoices WHERE batch_id = ? ORDER BY slot_index ASC`,
      [id]
    );

    const [coas] = await pool.query(
      `SELECT slot_index, rangkaian_coa AS rangkaianCoa, COALESCE(natural_akun, '') AS naturalAkun, nominal 
       FROM batch_coas WHERE batch_id = ? ORDER BY slot_index ASC`,
      [id]
    );

    batch.invoices = invoices;
    batch.coas = coas;

    res.json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
}

// Helper: Dapatkan nomor batch unik berikutnya dengan format BT{YY}-{XXXX}
async function getNextBatchNumber(connection) {
  const currentYear = new Date().getFullYear().toString().slice(-2); // "26"
  const prefix = `BT${currentYear}-`;

  // Cari semua no_batch yang menggunakan format ini
  const [rows] = await connection.query(
    'SELECT no_batch FROM batches WHERE no_batch LIKE ? ORDER BY id DESC',
    [`${prefix}%`]
  );

  let maxNum = 0;
  for (const r of rows) {
    if (r.no_batch) {
      // Hilangkan suffix _DEL_ jika berasal dari batch yang pernah dihapus
      const cleanNo = r.no_batch.split('_DEL_')[0];
      const match = cleanNo.match(/BT\d+-(\d+)/i);
      if (match) {
        const n = parseInt(match[1], 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    }
  }

  let candidateNum = maxNum + 1;
  let candidate = `${prefix}${String(candidateNum).padStart(4, '0')}`;

  // Pastikan candidate benar-benar belum dipakai di tabel batches (baik aktif maupun deleted)
  while (true) {
    const [chk] = await connection.query('SELECT id FROM batches WHERE no_batch = ?', [candidate]);
    if (chk.length === 0) break;
    candidateNum++;
    candidate = `${prefix}${String(candidateNum).padStart(4, '0')}`;
  }

  return candidate;
}

async function createBatch(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const payload = req.body;

    if (!payload.noDokumen || !payload.noDokumen.trim()) {
      return res.status(400).json({ success: false, message: 'Nomor Dokumen wajib diisi!' });
    }
    if (!payload.perihal || !payload.perihal.trim()) {
      return res.status(400).json({ success: false, message: 'Perihal Transaksi wajib diisi!' });
    }
    if (!payload.tglTransaksi) {
      return res.status(400).json({ success: false, message: 'Tanggal Transaksi wajib diisi!' });
    }
    if (!payload.namaRekanan) {
      return res.status(400).json({ success: false, message: 'Data Rekanan wajib dipilih!' });
    }

    const [dup] = await connection.query(
      'SELECT id, no_batch FROM batches WHERE no_dokumen = ? AND is_deleted = 0',
      [payload.noDokumen.trim()]
    );
    if (dup.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Nomor Dokumen "${payload.noDokumen}" sudah pernah digunakan pada Batch ${dup[0].no_batch}!`
      });
    }

    const invoices = Array.isArray(payload.invoices) ? payload.invoices : [];
    const totalInvoice = invoices.reduce((sum, inv) => sum + (Number(inv.nominal) || 0), 0);

    let coas = Array.isArray(payload.coas) ? payload.coas : [];
    let totalCoa = coas.reduce((sum, c) => sum + (Number(c.nominal) || 0), 0);

    const isDraft = payload.status === 'Draft';

    if (!isDraft) {
      if (totalInvoice <= 0) {
        return res.status(400).json({ success: false, message: 'Nominal invoice harus lebih besar dari Rp 0!' });
      }

      // Auto-assign COA ke slot 1 jika belum diisi secara spesifik
      if (totalCoa === 0 && totalInvoice > 0) {
        coas = [{
          rangkaianCoa: payload.namaDha ? '1-731001-861001-99-4500-102-014-040-1810-001-00000' : '1-731001-861001-99-4500-102-014-040-1810-001-00000',
          naturalAkun: 'Penyediaan Sarana dan Prasarana Pendukung',
          nominal: totalInvoice
        }];
        totalCoa = totalInvoice;
      }

      if (totalInvoice !== totalCoa) {
        return res.status(400).json({
          success: false,
          message: `Total alokasi COA (Rp ${totalCoa.toLocaleString('id-ID')}) harus sama dengan total invoice (Rp ${totalInvoice.toLocaleString('id-ID')})!`
        });
      }
    }

    await connection.beginTransaction();

    // 1. Lepaskan nomor batch pada record yang pernah dihapus (is_deleted = 1) agar tidak mengunci UNIQUE constraint
    try {
      await connection.query(
        "UPDATE batches SET no_batch = CONCAT(no_batch, '_DEL_', id) WHERE is_deleted = 1 AND no_batch NOT LIKE '%_DEL_%'"
      );
    } catch (eClean) {
      console.warn('Notice saat merapikan deleted batches:', eClean.message);
    }

    // 2. Tentukan noBatch yang unik dan aman
    let noBatch = payload.noBatch ? payload.noBatch.trim() : '';
    if (noBatch) {
      const [dupBatch] = await connection.query('SELECT id, is_deleted FROM batches WHERE no_batch = ?', [noBatch]);
      if (dupBatch.length > 0) {
        if (dupBatch[0].is_deleted === 1) {
          // Jika noBatch tersebut pernah dipakai oleh record yang dihapus, lepaskan nomor lama
          await connection.query('UPDATE batches SET no_batch = CONCAT(no_batch, "_DEL_", id) WHERE id = ?', [dupBatch[0].id]);
        } else {
          // Jika noBatch tersebut sudah dipakai oleh batch aktif lain, generate nomor batch unik berikutnya
          noBatch = await getNextBatchNumber(connection);
        }
      }
    } else {
      noBatch = await getNextBatchNumber(connection);
    }

    const insertBatchSql = `
      INSERT INTO batches (
        no_batch, no_dokumen, tgl_transaksi, dari_uker, kepada_uker, perihal,
        nama_rekanan, alamat_rekanan, nik_npwp, nama_wp_rekanan, no_faktur_pajak, tgl_faktur_pajak,
        tipe_pembayaran, nama_bank, nama_rekening, nomor_rekening, beban_anggaran_uker, jenis_invoice,
        nama_dha, yang_mengajukan, pangkat_mengajukan, yang_menyetujui, pangkat_menyetujui, status, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertParams = (batchNum) => [
      batchNum,
      payload.noDokumen.trim(),
      payload.tglTransaksi,
      payload.dariUker || 'Fungsi Pelaksana Pengedaran Uang Rupiah (FPPU)',
      payload.kepadaUker || 'Unit Manajemen Keuangan KPw BI Jember',
      payload.perihal.trim(),
      payload.namaRekanan,
      payload.alamatRekanan || null,
      payload.nikNpwp || null,
      payload.namaWpRekanan || null,
      payload.noFakturPajak || null,
      payload.tglFakturPajak || null,
      payload.tipePembayaran || 'Transfer Bank Antar Rekening',
      payload.namaBank || 'Bank Mandiri',
      payload.namaRekening || '',
      String(payload.nomorRekening || ''),
      payload.bebanAnggaranUker || 'Unit Manajemen Keuangan KPw BI Jember',
      payload.jenisInvoice || 'Invoice Non PO / Kontrak Langsung',
      payload.namaDha || '',
      payload.yangMengajukan || '',
      payload.pangkatMengajukan || '',
      payload.yangMenyetujui || '',
      payload.pangkatMenyetujui || '',
      payload.status || 'Diajukan',
      payload.createdBy || 'Admin ERP'
    ];

    let insertResult;
    try {
      [insertResult] = await connection.query(insertBatchSql, insertParams(noBatch));
    } catch (errInsert) {
      // Jika terjadi collision duplicate entry pada no_batch, generate ulang dan coba sekali lagi
      if (errInsert.code === 'ER_DUP_ENTRY' && errInsert.message.includes('no_batch')) {
        noBatch = await getNextBatchNumber(connection);
        [insertResult] = await connection.query(insertBatchSql, insertParams(noBatch));
      } else {
        throw errInsert;
      }
    }

    const batchId = insertResult.insertId;

    for (let i = 0; i < 4; i++) {
      const inv = invoices[i] || {};
      await connection.query(
        `INSERT INTO batch_invoices (batch_id, slot_index, no_invoice, tgl_invoice, nominal) VALUES (?, ?, ?, ?, ?)`,
        [
          batchId,
          i + 1,
          inv.noInvoice || null,
          inv.tglInvoice || null,
          Number(inv.nominal) || 0
        ]
      );
    }

    for (let j = 0; j < 3; j++) {
      const coaItem = coas[j] || {};
      await connection.query(
        `INSERT INTO batch_coas (batch_id, slot_index, rangkaian_coa, natural_akun, nominal) VALUES (?, ?, ?, ?, ?)`,
        [
          batchId,
          j + 1,
          coaItem.rangkaianCoa || null,
          coaItem.naturalAkun || null,
          Number(coaItem.nominal) || 0
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: `Batch transaksi ${noBatch} berhasil disimpan ke database ERP!`,
      data: {
        id: batchId,
        noBatch,
        noDokumen: payload.noDokumen
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function updateBatch(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const payload = req.body;

    const [existing] = await connection.query('SELECT id, no_batch FROM batches WHERE id = ? AND is_deleted = 0', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Data batch yang akan diperbarui tidak ditemukan' });
    }

    await connection.beginTransaction();

    const updateSql = `
      UPDATE batches SET
        no_dokumen = ?, tgl_transaksi = ?, dari_uker = ?, kepada_uker = ?, perihal = ?,
        nama_rekanan = ?, alamat_rekanan = ?, nik_npwp = ?, nama_wp_rekanan = ?,
        no_faktur_pajak = ?, tgl_faktur_pajak = ?, tipe_pembayaran = ?, nama_bank = ?,
        nama_rekening = ?, nomor_rekening = ?, beban_anggaran_uker = ?, jenis_invoice = ?,
        nama_dha = ?, yang_mengajukan = ?, pangkat_mengajukan = ?,
        yang_menyetujui = ?, pangkat_menyetujui = ?, status = ?, updated_by = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    await connection.query(updateSql, [
      payload.noDokumen.trim(),
      payload.tglTransaksi,
      payload.dariUker,
      payload.kepadaUker,
      payload.perihal.trim(),
      payload.namaRekanan,
      payload.alamatRekanan || null,
      payload.nikNpwp || null,
      payload.namaWpRekanan || null,
      payload.noFakturPajak || null,
      payload.tglFakturPajak || null,
      payload.tipePembayaran,
      payload.namaBank,
      payload.namaRekening,
      String(payload.nomorRekening || ''),
      payload.bebanAnggaranUker,
      payload.jenisInvoice,
      payload.namaDha,
      payload.yangMengajukan,
      payload.pangkatMengajukan,
      payload.yangMenyetujui,
      payload.pangkatMenyetujui,
      payload.status || 'Diajukan',
      payload.updatedBy || 'Admin ERP',
      id
    ]);

    await connection.query('DELETE FROM batch_invoices WHERE batch_id = ?', [id]);
    await connection.query('DELETE FROM batch_coas WHERE batch_id = ?', [id]);

    const invoices = Array.isArray(payload.invoices) ? payload.invoices : [];
    const totalInvoice = invoices.reduce((sum, inv) => sum + (Number(inv.nominal) || 0), 0);
    let coas = Array.isArray(payload.coas) ? payload.coas : [];
    let totalCoa = coas.reduce((sum, c) => sum + (Number(c.nominal) || 0), 0);

    if (totalCoa === 0 && totalInvoice > 0) {
      coas = [{
        rangkaianCoa: payload.namaDha ? '1-731001-861001-99-4500-102-014-040-1810-001-00000' : '1-731001-861001-99-4500-102-014-040-1810-001-00000',
        naturalAkun: 'Penyediaan Sarana dan Prasarana Pendukung',
        nominal: totalInvoice
      }];
    }

    for (let i = 0; i < 4; i++) {
      const inv = invoices[i] || {};
      await connection.query(
        `INSERT INTO batch_invoices (batch_id, slot_index, no_invoice, tgl_invoice, nominal) VALUES (?, ?, ?, ?, ?)`,
        [id, i + 1, inv.noInvoice || null, inv.tglInvoice || null, Number(inv.nominal) || 0]
      );
    }

    for (let j = 0; j < 3; j++) {
      const coaItem = coas[j] || {};
      await connection.query(
        `INSERT INTO batch_coas (batch_id, slot_index, rangkaian_coa, natural_akun, nominal) VALUES (?, ?, ?, ?, ?)`,
        [id, j + 1, coaItem.rangkaianCoa || null, coaItem.naturalAkun || null, Number(coaItem.nominal) || 0]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: `Data batch ${existing[0].no_batch} berhasil diperbarui (Replace)!`
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function deleteBatch(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.body?.user || 'Admin ERP';
    const noBatchBody = req.body?.noBatch || req.query?.noBatch || '';

    const isNumericId = /^\d+$/.test(String(id).trim());
    let query;
    let params;

    if (isNumericId) {
      if (noBatchBody) {
        query = "UPDATE batches SET no_batch = IF(no_batch LIKE '%_DEL_%', no_batch, CONCAT(no_batch, '_DEL_', id)), is_deleted = 1, deleted_at = NOW(), updated_by = ? WHERE (id = ? OR no_batch = ? OR no_batch = ?) AND is_deleted = 0";
        params = [user, parseInt(id, 10), String(id).trim(), String(noBatchBody).trim()];
      } else {
        query = "UPDATE batches SET no_batch = IF(no_batch LIKE '%_DEL_%', no_batch, CONCAT(no_batch, '_DEL_', id)), is_deleted = 1, deleted_at = NOW(), updated_by = ? WHERE (id = ? OR no_batch = ?) AND is_deleted = 0";
        params = [user, parseInt(id, 10), String(id).trim()];
      }
    } else {
      query = "UPDATE batches SET no_batch = IF(no_batch LIKE '%_DEL_%', no_batch, CONCAT(no_batch, '_DEL_', id)), is_deleted = 1, deleted_at = NOW(), updated_by = ? WHERE no_batch = ? AND is_deleted = 0";
      params = [user, String(id).trim()];
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      // Periksa apakah batch pernah ada dan sudah berstatus is_deleted = 1
      let checkQuery;
      let checkParams;
      if (isNumericId) {
        checkQuery = noBatchBody
          ? 'SELECT id, no_batch, is_deleted FROM batches WHERE id = ? OR no_batch = ? OR no_batch = ?'
          : 'SELECT id, no_batch, is_deleted FROM batches WHERE id = ? OR no_batch = ?';
        checkParams = noBatchBody
          ? [parseInt(id, 10), String(id).trim(), String(noBatchBody).trim()]
          : [parseInt(id, 10), String(id).trim()];
      } else {
        checkQuery = 'SELECT id, no_batch, is_deleted FROM batches WHERE no_batch = ?';
        checkParams = [String(id).trim()];
      }

      const [existing] = await pool.query(checkQuery, checkParams);

      if (existing.length > 0 && existing[0].is_deleted === 1) {
        // Record sudah berstatus dihapus, tanggapi dengan sukses (idempotent delete)
        return res.json({
          success: true,
          alreadyDeleted: true,
          message: `Data batch ${existing[0].no_batch || id} sudah dihapus dari sistem ERP.`
        });
      }

      return res.status(404).json({
        success: false,
        notFound: true,
        message: 'Data batch tidak ditemukan atau sudah dihapus'
      });
    }

    res.json({
      success: true,
      message: 'Data batch berhasil dihapus (soft-delete) dari sistem ERP.'
    });
  } catch (error) {
    next(error);
  }
}

async function updateBatchStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note, updatedBy } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Parameter status wajib diisi' });
    }
    const [existing] = await pool.query('SELECT id, no_batch, status FROM batches WHERE id = ? AND is_deleted = 0', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Data batch tidak ditemukan atau sudah dihapus' });
    }
    await pool.query(
      'UPDATE batches SET status = ?, updated_by = ?, updated_at = NOW() WHERE id = ?',
      [status, updatedBy || 'Pejabat Penyetuju', id]
    );
    res.json({
      success: true,
      message: `Status Batch ${existing[0].no_batch} berhasil diperbarui menjadi "${status}"!`,
      data: { id: Number(id), noBatch: existing[0].no_batch, status, note }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getBatches,
  getBatchById,
  checkDocDuplicate,
  createBatch,
  updateBatch,
  updateBatchStatus,
  deleteBatch
};
