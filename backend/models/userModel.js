// ForTest/backend/models/userModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Permission from './permissionModel.js';

const User = sequelize.define('user', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING(255)
  },
  phoneNumber: {
    type: DataTypes.STRING(20)
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Permission,
      key: 'permissionId'
    }
  }
});

User.belongsTo(Permission, { foreignKey: 'permissionId' });

export default User;
