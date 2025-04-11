import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Permission from './permissionModel.js';

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(45),
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING(255)
  },
  phoneNumber: {
    type: DataTypes.STRING(20)
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Permission,
      key: 'permissionId'
    }
  }
}, {
  tableName: 'user',
  timestamps: false // 移除 createdAt 和 updatedAt 字段
});

User.belongsTo(Permission, { foreignKey: 'permissionId' });

export default User;
