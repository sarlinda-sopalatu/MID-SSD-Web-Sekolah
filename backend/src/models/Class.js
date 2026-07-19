const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  grade_level: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    references: { model: 'academic_years', key: 'id' }
  },
  homeroom_teacher_id: {
    type: DataTypes.INTEGER,
    references: { model: 'teachers', key: 'id' }
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 36
  }
}, {
  tableName: 'classes',
  timestamps: true
});

module.exports = Class;
