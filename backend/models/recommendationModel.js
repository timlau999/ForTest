import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Recommendation = sequelize.define('Recommendation', {
    recommendationId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customer',
            key: 'customerId'
        }
    },
    menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'menuitem',
            key: 'menuItemId'
        }
    }
}, {
    tableName: 'recommendation',
    timestamps: false
});

export default Recommendation;
