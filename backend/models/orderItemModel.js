import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './orderModel.js';
import MenuItem from './menuItemModel.js'; // 假设存在 menuItemModel.js

const OrderItem = sequelize.define('orderitem', {
  orderItemId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'orderId'
    }
  },
  menuItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MenuItem,
      key: 'menuItemId'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: false
  }
}, {
  tableName: 'orderitem',
  timestamps: false 
});

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

export default OrderItem;