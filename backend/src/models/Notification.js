const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM('info', 'warning', 'success', 'error'), defaultValue: 'info' },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  link: { type: DataTypes.STRING(300), allowNull: true },
}, { tableName: 'notifications', timestamps: true });

module.exports = Notification;
