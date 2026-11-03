const express = require('express');
const router = express.Router();
const {
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
  resetRbacMatrix
} = require('../controllers/userController');

// Roles Definition
router.get('/roles', getRoles);

// RBAC Matrix Management
router.get('/rbac-matrix', getRbacMatrix);
router.put('/rbac-matrix', updateRbacMatrix);
router.post('/rbac-matrix/reset', resetRbacMatrix);

// Auth Login
router.post('/login', loginUser);

// CRUD Users
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/status', toggleUserStatus);
router.patch('/:id/reset-password', resetPassword);
router.delete('/:id', deleteUser);

module.exports = router;
