const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TeachingJournal = sequelize.define('TeachingJournal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teachers', key: 'id' }
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'classes', key: 'id' }
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'subjects', key: 'id' }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  material: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING(100)
  },
  notes: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'approved'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'teaching_journals',
  timestamps: true
});

module.exports = TeachingJournal;
