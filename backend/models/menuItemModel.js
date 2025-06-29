// restaurant_b02/backend/models/menuItemModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MenuItem = sequelize.define('MenuItem', {
    menuItemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    menuID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'menu',
            key: 'menuId'
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
    category: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'menuitem',
    timestamps: false
});

// MenuItem.hasMany(MenuItemIngredient, { foreignKey: 'menuItemId' });

export default MenuItem;
