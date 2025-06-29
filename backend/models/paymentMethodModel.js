// restaurant_b02/backend/models/paymentMethodModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PaymentMethod = sequelize.define('paymentmethod', {
    paymentMethodId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    paymentMethodName: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'paymentmethod',
    timestamps: false
});

export default PaymentMethod;