// backend/models/OrderModel.js
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('order', {
    orderId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    customerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    orderDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    orderStatus: {
        type: Sequelize.STRING,
        allowNull: false
    },
    totalAmount: {
        type: Sequelize.DECIMAL(10, 0),
        allowNull: false
    },
    paymentStatus: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'order', 
    timestamps: false 
});

export default Order;