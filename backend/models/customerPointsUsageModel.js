// backend/models/customerPointsUsageModel.js
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const CustomerPointsUsage = sequelize.define('customer_points_usage', {
    usageId: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    orderId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    pointsId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    usageDate: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

export default CustomerPointsUsage;