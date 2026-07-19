const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, gradeController.getAllGrades);
router.post('/', auth, authorize('Admin', 'Guru'), gradeController.createGrade);
router.put('/:id', auth, authorize('Admin', 'Guru'), gradeController.updateGrade);
router.get('/student/:student_id', auth, gradeController.getStudentGrades);

module.exports = router;
