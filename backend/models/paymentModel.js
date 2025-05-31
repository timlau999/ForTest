// ForTest/backend/models/paymentModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './orderModel.js';
import PaymentMethod from './paymentMethodModel.js';

const Payment = sequelize.define('payment', {
    paymentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'orderId'
        }
    },
    paymentMethodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentMethod,
            key: 'paymentMethodId'
        }
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'payment',
    timestamps: false
});

Payment.belongsTo(Order, { foreignKey: 'orderId' });
Payment.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId' });

export default Payment;