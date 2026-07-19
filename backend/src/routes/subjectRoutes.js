const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, subjectController.getAllSubjects);
router.get('/:id', auth, subjectController.getSubjectById);
router.post('/', auth, authorize('Admin'), subjectController.createSubject);
router.put('/:id', auth, authorize('Admin'), subjectController.updateSubject);
router.delete('/:id', auth, authorize('Admin'), subjectController.deleteSubject);

module.exports = router;
