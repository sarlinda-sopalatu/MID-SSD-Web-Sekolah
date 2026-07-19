const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StudentAchievement = sequelize.define('StudentAchievement', {
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
  awarded_by: {
    type: DataTypes.INTEGER,
    references: { model: 'teachers', key: 'id' }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('school', 'district', 'regional', 'national', 'international'),
    defaultValue: 'school'
  },
  certificate_number: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'student_achievements',
  timestamps: true
});

module.exports = StudentAchievement;
