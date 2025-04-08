// /MyFYP_HD/backend/models/permissionModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Permission = sequelize.define('permission', {
  permissionId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  permissionName: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  timestamps: false 
});

export default Permission;
