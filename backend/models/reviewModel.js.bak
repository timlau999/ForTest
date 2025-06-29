// ForTest/backend/models/reviewModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Customer from './customerModel.js';
import Order from './orderModel.js';
import MenuItem from './menuItemModel.js';

const Review = sequelize.define('review', {
    reviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: 'customerId'
        }
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
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviewDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'review',
    timestamps: false
});

Review.belongsTo(Customer, { foreignKey: 'customerId' });
Review.belongsTo(Order, { foreignKey: 'orderId' });
Review.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

export default Review;