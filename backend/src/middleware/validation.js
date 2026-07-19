const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

const validateUser = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role_id').isInt().withMessage('Role ID is required'),
  handleValidation
];

const validateStudent = [
  body('name').notEmpty().withMessage('Name is required'),
  body('gender').isIn(['L', 'P']).withMessage('Gender must be L or P'),
  body('class_id').isInt().withMessage('Class ID is required'),
  handleValidation
];

const validateTeacher = [
  body('name').notEmpty().withMessage('Name is required'),
  body('gender').isIn(['L', 'P']).withMessage('Gender must be L or P'),
  handleValidation
];

const validateJournal = [
  body('class_id').isInt().withMessage('Class ID is required'),
  body('subject_id').isInt().withMessage('Subject ID is required'),
  body('date').isDate().withMessage('Valid date is required'),
  body('material').notEmpty().withMessage('Material is required'),
  handleValidation
];

const validateBkCase = [
  body('student_id').isInt().withMessage('Student ID is required'),
  body('case_type').isIn(['counseling', 'violation', 'achievement', 'other']).withMessage('Invalid case type'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isDate().withMessage('Valid date is required'),
  handleValidation
];

const validateAttendance = [
  body('student_id').isInt().withMessage('Student ID is required'),
  body('date').isDate().withMessage('Valid date is required'),
  body('status').isIn(['present', 'absent', 'late', 'sick', 'excused']).withMessage('Invalid status'),
  handleValidation
];

const validateGrade = [
  body('student_id').isInt().withMessage('Student ID is required'),
  body('subject_id').isInt().withMessage('Subject ID is required'),
  body('semester_id').isInt().withMessage('Semester ID is required'),
  handleValidation
];

module.exports = {
  validateLogin,
  validateUser,
  validateStudent,
  validateTeacher,
  validateJournal,
  validateBkCase,
  validateAttendance,
  validateGrade
};
