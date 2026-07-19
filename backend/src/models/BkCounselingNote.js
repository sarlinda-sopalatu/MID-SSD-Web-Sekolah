const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BkCounselingNote = sequelize.define('BkCounselingNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  case_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'bk_cases', key: 'id' }
  },
  counselor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teachers', key: 'id' }
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  action_taken: {
    type: DataTypes.TEXT
  },
  next_steps: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName: 'bk_counseling_notes',
  timestamps: true
});

module.exports = BkCounselingNote;
