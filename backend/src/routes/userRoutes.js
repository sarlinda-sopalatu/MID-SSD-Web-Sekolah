const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, authorize('Admin'), userController.getAllUsers);
router.get('/roles', auth, authorize('Admin'), userController.getAllRoles);
router.get('/:id', auth, authorize('Admin'), userController.getUserById);
router.post('/', auth, authorize('Admin'), userController.createUser);
router.put('/:id', auth, authorize('Admin'), userController.updateUser);
router.delete('/:id', auth, authorize('Admin'), userController.deleteUser);
router.put('/:id/reset-password', auth, authorize('Admin'), userController.resetPassword);

module.exports = router;
