const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, notifController.getMyNotifications);
router.put('/:id/read', auth, notifController.markAsRead);
router.put('/read-all/mark', auth, notifController.markAllAsRead);

module.exports = router;
