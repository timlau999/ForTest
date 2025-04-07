// /MyFYP_HD/backend/models/permissionModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Permission = sequelize.define('Permission', {
  permissionId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  permissionName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
});

export default Permission;
