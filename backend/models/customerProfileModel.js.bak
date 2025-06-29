// ForTest/backend/models/customerProfileModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CustomerProfile = sequelize.define('customerprofile', {
    profileId: {
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
    height: {
        type: DataTypes.DOUBLE
    },
    weight: {
        type: DataTypes.DOUBLE
    },
    allergy: {
        type: DataTypes.STRING(255)
    },
    medicalConditions: {
        type: DataTypes.STRING(255)
    },
    dietaryPreference: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'customerprofile',
    timestamps: false
});

export default CustomerProfile;
