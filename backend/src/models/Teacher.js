const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' }
  },
  nip: {
    type: DataTypes.STRING(30),
    unique: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('L', 'P'),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  address: {
    type: DataTypes.TEXT
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: { model: 'subjects', key: 'id' }
  }
}, {
  tableName: 'teachers',
  timestamps: true
});

module.exports = Teacher;
