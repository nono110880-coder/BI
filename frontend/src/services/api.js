/**
 * Service API Komunikasi Frontend & Backend
 * Mendukung REST API Express & Fallback Offline jika database server belum dinyalakan
 */

const API_BASE_URL = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function getMasters() {
  try {
    const res = await fetch(`${API_BASE_URL}/masters`);
    if (!res.ok) throw new Error('Gagal memuat master data dari API');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Warning] Fallback ke master data lokal:', err.message);
    return null;
  }
}

export async function getBatches(queryParams = {}) {
  const query = new URLSearchParams(queryParams).toString();
  const res = await fetch(`${API_BASE_URL}/batches?${query}`);
  if (!res.ok) throw new Error('Gagal memuat data batch dari server');
  return await res.json();
}

export async function checkDocumentDuplicate(noDokumen, excludeId = null) {
  let url = `${API_BASE_URL}/batches/check-doc?noDokumen=${encodeURIComponent(noDokumen)}`;
  if (excludeId) url += `&excludeId=${excludeId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal validasi nomor dokumen');
  return await res.json();
}

export async function createBatchApi(payload) {
  const res = await fetch(`${API_BASE_URL}/batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan batch transaksi');
  return data;
}

export async function updateBatchApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/batches/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui batch transaksi');
  return data;
}

export async function updateBatchStatusApi(id, status, payload = {}) {
  const res = await fetch(`${API_BASE_URL}/batches/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...payload })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui status batch transaksi');
  return data;
}

export async function deleteBatchApi(id, options = {}) {
  const user = typeof options === 'string' ? options : (options.user || 'Admin ERP');
  const noBatch = typeof options === 'object' ? (options.noBatch || '') : '';
  
  const res = await fetch(`${API_BASE_URL}/batches/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, noBatch })
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Gagal menghapus batch transaksi');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export async function getPegawaiApi() {
  const res = await fetch(`${API_BASE_URL}/masters/pegawai`);
  if (!res.ok) throw new Error('Gagal memuat data pegawai dari server');
  const json = await res.json();
  return json.data;
}

export async function createPegawaiApi(payload) {
  const res = await fetch(`${API_BASE_URL}/masters/pegawai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data pegawai');
  return data;
}

export async function updatePegawaiApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/masters/pegawai/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data pegawai');
  return data;
}

export async function deletePegawaiApi(id) {
  const res = await fetch(`${API_BASE_URL}/masters/pegawai/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus data pegawai');
  return data;
}

export async function getBanksApi() {
  const res = await fetch(`${API_BASE_URL}/masters/banks`);
  if (!res.ok) throw new Error('Gagal memuat data bank dari server');
  const json = await res.json();
  return json.data;
}

export async function createBankApi(payload) {
  const res = await fetch(`${API_BASE_URL}/masters/banks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data bank');
  return data;
}

export async function updateBankApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/masters/banks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data bank');
  return data;
}

export async function deleteBankApi(id) {
  const res = await fetch(`${API_BASE_URL}/masters/banks/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus data bank');
  return data;
}

export async function getUnitKerjaApi() {
  const res = await fetch(`${API_BASE_URL}/masters/unit-kerja`);
  if (!res.ok) throw new Error('Gagal memuat data unit kerja dari server');
  const json = await res.json();
  return json.data;
}

export async function createUnitKerjaApi(payload) {
  const res = await fetch(`${API_BASE_URL}/masters/unit-kerja`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data unit kerja');
  return data;
}

export async function updateUnitKerjaApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/masters/unit-kerja/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data unit kerja');
  return data;
}

export async function deleteUnitKerjaApi(id) {
  const res = await fetch(`${API_BASE_URL}/masters/unit-kerja/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus data unit kerja');
  return data;
}

// Master Rekanan / Vendor
export async function getRekananApi() {
  const res = await fetch(`${API_BASE_URL}/masters/rekanan`);
  if (!res.ok) throw new Error('Gagal memuat data rekanan dari server');
  const json = await res.json();
  return json.data;
}

export async function createRekananApi(payload) {
  const res = await fetch(`${API_BASE_URL}/masters/rekanan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data rekanan ke database');
  return data;
}

export async function updateRekananApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/masters/rekanan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data rekanan');
  return data;
}

export async function deleteRekananApi(id) {
  const res = await fetch(`${API_BASE_URL}/masters/rekanan/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus data rekanan');
  return data;
}

// Master DHA & Anggaran
export async function getDhaApi() {
  const res = await fetch(`${API_BASE_URL}/masters/dha`);
  if (!res.ok) throw new Error('Gagal memuat data DHA dari server');
  const json = await res.json();
  return json.data;
}

export async function createDhaApi(payload) {
  const res = await fetch(`${API_BASE_URL}/masters/dha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data DHA ke database');
  return data;
}

export async function updateDhaApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/masters/dha/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data DHA di database');
  return data;
}

export async function deleteDhaApi(id) {
  const res = await fetch(`${API_BASE_URL}/masters/dha/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus data DHA dari database');
  return data;
}

export async function importDhaApi(items, mode = 'append') {
  const res = await fetch(`${API_BASE_URL}/masters/dha/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, mode })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengimpor data DHA ke database');
  return data;
}

// User Authentication (Login)
export async function loginApi(credentials) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Gagal masuk ke sistem');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// RBAC Matrix APIs
export async function getRbacMatrixApi() {
  const res = await fetch(`${API_BASE_URL}/users/rbac-matrix`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengambil matriks wewenang RBAC');
  return data;
}

export async function updateRbacMatrixApi(matrix) {
  const res = await fetch(`${API_BASE_URL}/users/rbac-matrix`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matrix })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal memperbarui matriks wewenang RBAC');
  return data;
}

export async function resetRbacMatrixApi() {
  const res = await fetch(`${API_BASE_URL}/users/rbac-matrix/reset`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mereset matriks RBAC');
  return data;
}

export async function getUsersApi() {
  const res = await fetch(`${API_BASE_URL}/users`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengambil daftar pengguna');
  return data;
}

export async function createUserApi(payload) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menambah pengguna');
  return data;
}

export async function updateUserApi(id, payload) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengubah pengguna');
  return data;
}

export async function deleteUserApi(id) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal menghapus pengguna');
  return data;
}



