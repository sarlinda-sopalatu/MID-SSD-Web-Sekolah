const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', auth, classController.getAllClasses);
router.get('/:id', auth, classController.getClassById);
router.post('/', auth, authorize('Admin'), classController.createClass);
router.put('/:id', auth, authorize('Admin'), classController.updateClass);
router.delete('/:id', auth, authorize('Admin'), classController.deleteClass);

module.exports = router;
