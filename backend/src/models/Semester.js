const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Semester = sequelize.define('Semester', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  academic_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'academic_years', key: 'id' }
  },
  name: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  semester_number: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: 'semesters',
  timestamps: true
});

module.exports = Semester;
