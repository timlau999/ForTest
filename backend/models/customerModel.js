// /MyFYP_HD/backend/models/customerModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

const Customer = sequelize.define('customer', {
  customerId: {
    type: DataTypes.INTEGER,
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
  tableName: 'customer', 
  timestamps: false 
});

Customer.belongsTo(User, { foreignKey: 'userId' });

export default Customer;
