// ForTest/backend/models/menuItemIngredientModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import MenuItem from './menuItemModel.js';
import Ingredient from './ingredientModel.js';

const MenuItemIngredient = sequelize.define('MenuItemIngredient', {
    menuItemIngredientId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    }
}, {
    tableName: 'menuitemingredient',
    timestamps: false
});

MenuItemIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId' });

export default MenuItemIngredient;
