// backend/models/customerPointsUsageModel.js
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const CustomerPointsUsage = sequelize.define('customer_points_usage', {
    usageId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    },
    usedPoints: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
  tableName: 'customer_points_usage',
  timestamps: false 
});

export default CustomerPointsUsage;