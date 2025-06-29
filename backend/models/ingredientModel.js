// restaurant_b02/backend/models/ingredientModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ingredient = sequelize.define('Ingredient', {
    ingredientId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'ingredient',
    timestamps: false
});

export default Ingredient;