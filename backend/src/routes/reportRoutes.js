const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/dashboard', auth, reportController.getDashboard);
router.get('/academic', auth, reportController.getAcademicReport);
router.get('/student-profile', auth, reportController.getStudentProfile);
router.get('/child-profile', auth, reportController.getChildProfile);

module.exports = router;
