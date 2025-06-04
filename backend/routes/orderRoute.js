// ForTest/backend/routes/orderRoutes.js
import express from 'express';
import { placeOrder, getOrdersByCustomerId, getAllOrders, updateOrderStatus} from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/list', getAllOrders);
router.get('/status', updateOrderStatus);
router.get('/:customerId', getOrdersByCustomerId);

export default router;