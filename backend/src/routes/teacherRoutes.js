const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, teacherController.getAllTeachers);
router.get('/:id', auth, teacherController.getTeacherById);
router.post('/', auth, authorize('Admin'), teacherController.createTeacher);
router.put('/:id', auth, authorize('Admin'), teacherController.updateTeacher);
router.delete('/:id', auth, authorize('Admin'), teacherController.deleteTeacher);

module.exports = router;
