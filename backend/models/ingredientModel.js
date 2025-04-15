// ForTest/backend/models/ingredientModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Ingredient = sequelize.define('Ingredient', {
    ingredientId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50)
    },
    sensitiveSource: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'ingredient',
    timestamps: false
});

export default Ingredient;