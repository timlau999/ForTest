import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const OrderItem = sequelize.define('orderitem', {
    orderItemId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    orderId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    menuItemId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    unitPrice: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false
    },
    totalPrice: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false
    }
}, {
    tableName: 'orderitem', 
    timestamps: false 
});

export default OrderItem;
