// ForTest/backend/models/menuItemIngredientModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import MenuItem from './menuItemModel.js';
import Ingredient from './ingredientModel.js';

const MenuItemIngredient = sequelize.define('MenuItemIngredient', {
    menuItemIngredientId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: MenuItem,
            key: 'menuItemId'
        }
    },
    ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Ingredient,
            key: 'ingredientId'
        }
    },
    quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    tableName: 'menuitemingredient',
    timestamps: false
});

export default MenuItemIngredient;