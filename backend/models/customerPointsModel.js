// restaurant_b02/backend/models/customerPointsModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CustomerPoints = sequelize.define('customer_points', {
    pointsId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'customer',
            key: 'customerId'
        },
        set(value) {
            this.setDataValue('customerId', value);
            this.setDataValue('pointsId', value);
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