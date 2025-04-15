// ForTest/backend/models/menuItemModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MenuItem = sequelize.define('MenuItem', {
    menuItemId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'restaurant',
            key: 'restaurantID'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false
    },
    calories: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    carbohydrate: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sensitiveSource: {
        type: DataTypes.STRING(255)
    },
    category: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'menuitem',
    timestamps: false
});

export default MenuItem;