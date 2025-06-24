// /MyFYP_HD/backend/models/staffModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Staff = sequelize.define('Staff', {
  staffId: {
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
  tableName: 'staff', 
  timestamps: false 
});

Staff.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Staff, { foreignKey: 'userId', sourceKey: 'userId' });

export default Staff;
