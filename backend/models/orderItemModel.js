// ForTest/backend/models/orderItemModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import MenuItem from './menuItemModel.js';

const OrderItem = sequelize.define('orderitem', {
orderItemId: {
  type: DataTypes.STRING(255), 
  primaryKey: true
},
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'order',
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

OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

export default OrderItem;