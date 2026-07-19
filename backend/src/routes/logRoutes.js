const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, authorize('Admin', 'Kepala Sekolah'), logController.getAllLogs);
router.get('/user/:userId', auth, authorize('Admin'), logController.getLogsByUser);

module.exports = router;
