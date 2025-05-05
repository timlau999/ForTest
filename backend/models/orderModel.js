// ForTest/backend/models/orderModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Customer from './customerModel.js';

const Order = sequelize.define('order', {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'customerId'
    }
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  orderStatus: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'order',
  timestamps: false 
});

Order.belongsTo(Customer, { foreignKey: 'customerId' });

export default Order;