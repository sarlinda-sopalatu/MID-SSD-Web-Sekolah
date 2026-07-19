const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BkCase = sequelize.define('BkCase', {
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
  counselor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teachers', key: 'id' }
  },
  case_type: {
    type: DataTypes.ENUM('counseling', 'violation', 'achievement', 'other'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
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
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  follow_up_date: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'bk_cases',
  timestamps: true
});

module.exports = BkCase;
