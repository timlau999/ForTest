// backend/models/customerPointsModel.js
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const CustomerPoints = sequelize.define('customer_points', {
    pointsId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    customerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    points: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    redemptionDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

export default CustomerPoints;