const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  nis: {
    type: DataTypes.STRING(20),
    unique: true
  },
  nisn: {
    type: DataTypes.STRING(20),
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
  birth_date: {
    type: DataTypes.DATEONLY
  },
  birth_place: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.TEXT
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  class_id: {
    type: DataTypes.INTEGER,
    references: { model: 'classes', key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('active', 'transferred', 'graduated', 'dropped'),
    defaultValue: 'active'
  },
  parent_name: {
    type: DataTypes.STRING(100)
  },
  parent_phone: {
    type: DataTypes.STRING(20)
  },
  parent_email: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'students',
  timestamps: true
});

module.exports = Student;
