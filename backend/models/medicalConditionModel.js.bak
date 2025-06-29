// ForTest/backend/models/medicalConditionModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MedicalCondition = sequelize.define('medical_condition', {
  medicalConditionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
},{
    tableName: 'medical_condition',
    timestamps: false
});

export default MedicalCondition;