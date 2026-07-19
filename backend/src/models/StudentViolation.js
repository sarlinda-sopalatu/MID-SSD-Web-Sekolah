const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StudentViolation = sequelize.define('StudentViolation', {
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
  reported_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teachers', key: 'id' }
  },
  violation_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  punishment: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'processed', 'resolved'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'student_violations',
  timestamps: true
});

module.exports = StudentViolation;
