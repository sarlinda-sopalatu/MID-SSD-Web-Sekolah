const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'id' }
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'subjects', key: 'id' }
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    references: { model: 'teachers', key: 'id' }
  },
  semester_id: {
    type: DataTypes.INTEGER,
    references: { model: 'semesters', key: 'id' }
  },
  quiz_score: {
    type: DataTypes.DECIMAL(5, 2)
  },
  assignment_score: {
    type: DataTypes.DECIMAL(5, 2)
  },
  mid_exam_score: {
    type: DataTypes.DECIMAL(5, 2)
  },
  final_exam_score: {
    type: DataTypes.DECIMAL(5, 2)
  },
  final_score: {
    type: DataTypes.DECIMAL(5, 2)
  },
  grade_letter: {
    type: DataTypes.STRING(2)
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'approved'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'grades',
  timestamps: true
});

module.exports = Grade;
