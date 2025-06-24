// /MyFYP_HD/backend/models/adminModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Admin = sequelize.define('Admin', {
  adminId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    autoIncrement: true
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
  tableName: 'admin', 
  timestamps: false 
});

Admin.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Admin, { foreignKey: 'userId', sourceKey: 'userId' });

export default Admin;
