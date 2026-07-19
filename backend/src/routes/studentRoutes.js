const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, studentController.getAllStudents);
router.get('/export', auth, studentController.exportStudents);
router.get('/:id', auth, studentController.getStudentById);
router.post('/', auth, authorize('Admin'), studentController.createStudent);
router.put('/:id', auth, authorize('Admin'), studentController.updateStudent);
router.delete('/:id', auth, authorize('Admin'), studentController.deleteStudent);
router.post('/import', auth, authorize('Admin'), studentController.importStudents);

module.exports = router;
