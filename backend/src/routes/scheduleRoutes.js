const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, scheduleController.getAllSchedules);
router.post('/', auth, authorize('Admin'), scheduleController.createSchedule);
router.put('/:id', auth, authorize('Admin'), scheduleController.updateSchedule);
router.delete('/:id', auth, authorize('Admin'), scheduleController.deleteSchedule);

module.exports = router;
