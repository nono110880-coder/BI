const express = require('express');
const router = express.Router();
const {
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
  importDha
} = require('../controllers/masterController');

router.get('/', getAllMasters);

// Master Pegawai
router.get('/pegawai', getPegawai);
router.post('/pegawai', createPegawai);
router.put('/pegawai/:id', updatePegawai);
router.delete('/pegawai/:id', deletePegawai);

// Master Bank
router.get('/banks', getBanks);
router.post('/banks', createBank);
router.put('/banks/:id', updateBank);
router.delete('/banks/:id', deleteBank);

// Alias /bank
router.get('/bank', getBanks);
router.post('/bank', createBank);
router.put('/bank/:id', updateBank);
router.delete('/bank/:id', deleteBank);

// Master Unit Kerja
router.get('/unit-kerja', getUnitKerja);
router.post('/unit-kerja', createUnitKerja);
router.put('/unit-kerja/:id', updateUnitKerja);
router.delete('/unit-kerja/:id', deleteUnitKerja);

// Alias /uker
router.get('/uker', getUnitKerja);
router.post('/uker', createUnitKerja);
router.put('/uker/:id', updateUnitKerja);
router.delete('/uker/:id', deleteUnitKerja);

// Master Rekanan / Vendor
router.get('/rekanan', getRekanan);
router.post('/rekanan', createRekanan);
router.put('/rekanan/:id', updateRekanan);
router.delete('/rekanan/:id', deleteRekanan);

// Master DHA & Anggaran
router.get('/dha', getDha);
router.post('/dha', createDha);
router.put('/dha/:id', updateDha);
router.delete('/dha/:id', deleteDha);
router.post('/dha/import', importDha);

module.exports = router;
