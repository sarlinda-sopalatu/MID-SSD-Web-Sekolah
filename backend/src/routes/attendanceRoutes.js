const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, attendanceController.getAllAttendance);
router.post('/', auth, authorize('Admin', 'Guru', 'Wali Kelas'), attendanceController.createAttendance);
router.post('/bulk', auth, authorize('Admin', 'Guru', 'Wali Kelas'), attendanceController.bulkCreateAttendance);
router.get('/report/student/:student_id', auth, attendanceController.getStudentAttendanceReport);

module.exports = router;
