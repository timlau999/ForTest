// ForTest/backend/controllers/paymentController.js
import PaymentMethod from '../models/paymentMethodModel.js';

export const getPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.findAll();
        res.status(200).json({ success: true, paymentMethods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};