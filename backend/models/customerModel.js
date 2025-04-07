// /MyFYP_HD/backend/models/customerModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Customer = sequelize.define('Customer', {
  customerId: {
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

Customer.belongsTo(User, { foreignKey: 'userId' });

export default Customer;
