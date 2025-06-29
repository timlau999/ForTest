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
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'customer', 
  timestamps: false 
});

Customer.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Customer, { foreignKey: 'userId', sourceKey: 'userId' });

export default Customer;
