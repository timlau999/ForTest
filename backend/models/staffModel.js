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
});

Staff.belongsTo(User, { foreignKey: 'userId' });

export default Staff;
