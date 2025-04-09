// /MyFYP_HD/backend/models/staffModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Staff = sequelize.define('Staff', {
  staffId: {
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
  tableName: 'staff', // 指定表名
  timestamps: false // 移除 createdAt 和 updatedAt 字段
});

Staff.belongsTo(User, { foreignKey: 'userId' });

export default Staff;
