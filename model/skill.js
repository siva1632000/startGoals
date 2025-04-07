import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Skill = sequelize.define('Skill', {
  skill: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'skills',
  timestamps: true,
});

export default Skill;
