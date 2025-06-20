// ForTest/backend/routes/orderRoutes.js
import express from 'express';
import { placeOrder, getOrdersByCustomerId, getAllOrders, updateOrderStatus, addReview} from '../controllers/orderController.js';

const router = express.Router();

router.post('/place', placeOrder);
router.get('/list', getAllOrders);
router.get('/status', updateOrderStatus);
router.get('/:customerId', getOrdersByCustomerId);
router.post('/review', addReview);
//router.get('/getreview', getReview);

export default router;