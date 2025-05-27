import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CustomerPoints = sequelize.define('customer_points', {
    pointsId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customer',
            key: 'customerId'
        }
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false 
});

export default CustomerPoints;