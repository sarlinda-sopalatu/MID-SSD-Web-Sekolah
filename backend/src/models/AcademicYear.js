const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AcademicYear = sequelize.define('AcademicYear', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  year: {
    type: DataTypes.STRING(9),
    allowNull: false,
    unique: true
  },
  start_date: {
    type: DataTypes.DATEONLY
  },
  end_date: {
    type: DataTypes.DATEONLY
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'academic_years',
  timestamps: true
});

module.exports = AcademicYear;
