const express = require('express');
const router = express.Router();
const bkController = require('../controllers/bkController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/cases', auth, bkController.getAllCases);
router.get('/cases/:id', auth, bkController.getCaseById);
router.post('/cases', auth, authorize('Admin', 'Guru BK', 'Kepala Sekolah'), bkController.createCase);
router.put('/cases/:id', auth, authorize('Admin', 'Guru BK'), bkController.updateCase);
router.post('/notes', auth, authorize('Admin', 'Guru BK'), bkController.addCounselingNote);
router.get('/student-recap/:student_id', auth, bkController.getStudentRecap);
router.get('/violations', auth, bkController.getAllViolations);
router.post('/violations', auth, authorize('Admin', 'Guru BK', 'Wali Kelas'), bkController.createViolation);
router.get('/achievements', auth, bkController.getAllAchievements);
router.post('/achievements', auth, authorize('Admin', 'Guru BK', 'Wali Kelas'), bkController.createAchievement);

module.exports = router;
