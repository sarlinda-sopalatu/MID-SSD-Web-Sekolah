const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attendance = sequelize.define('Attendance', {
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
  schedule_id: {
    type: DataTypes.INTEGER,
    references: { model: 'schedules', key: 'id' }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late', 'sick', 'excused'),
    allowNull: false
  },
  notes: {
    type: DataTypes.STRING(255)
  },
  recorded_by: {
    type: DataTypes.INTEGER,
    references: { model: 'teachers', key: 'id' }
  }
}, {
  tableName: 'attendance',
  timestamps: true
});

module.exports = Attendance;
