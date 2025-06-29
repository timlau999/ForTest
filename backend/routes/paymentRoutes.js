// restaurant_b02/backend/routes/paymentRoutes.js
import express from 'express';
import { getPaymentMethods } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/paymentmethods', getPaymentMethods);

export default router;