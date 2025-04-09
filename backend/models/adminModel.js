// /MyFYP_HD/backend/models/adminModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Admin = sequelize.define('Admin', {
  adminId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'userId'
    }
  }
}, {
  tableName: 'admin', // 指定表名
  timestamps: false // 移除 createdAt 和 updatedAt 字段
});

Admin.belongsTo(User, { foreignKey: 'userId' });

export default Admin;
