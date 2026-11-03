const express = require('express');
const router = express.Router();
const {
  getBatches,
  getBatchById,
  checkDocDuplicate,
  createBatch,
  updateBatch,
  updateBatchStatus,
  deleteBatch
} = require('../controllers/batchController');

router.get('/check-doc', checkDocDuplicate);
router.get('/', getBatches);
router.get('/:id', getBatchById);
router.post('/', createBatch);
router.put('/:id', updateBatch);
router.patch('/:id/status', updateBatchStatus);
router.put('/:id/status', updateBatchStatus);
router.delete('/:id', deleteBatch);

module.exports = router;
