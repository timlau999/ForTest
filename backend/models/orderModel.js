import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('order', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Food Processing'
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  payment: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export default Order;
