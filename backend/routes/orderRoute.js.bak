// ForTest/backend/routes/orderRoutes.js
import express from 'express';
import { placeOrder, getOrdersByCustomerId, getAllOrders, updateOrderStatus, addReview, getReviewsByCustomerId} from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/list', getAllOrders);
router.get('/status', updateOrderStatus);
router.get('/:customerId', getOrdersByCustomerId);
router.post('/review', addReview);
router.get('/reviews/:customerId', getReviewsByCustomerId);

export default router;