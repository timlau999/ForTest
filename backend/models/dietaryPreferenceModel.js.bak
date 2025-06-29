// ForTest/backend/models/dietaryPreferenceModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DietaryPreference = sequelize.define('dietary_preference', {
  dietaryPreferenceId: {
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
    tableName: 'dietary_preference',
    timestamps: false
});

export default DietaryPreference;