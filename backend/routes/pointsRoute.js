import express from 'express';
import { getCustomerPoints, usePoints } from '../controllers/pointsController.js';

const router = express.Router();

router.get('/:customerId', getCustomerPoints);
router.post('/:customerId/use', usePoints);

export default router;    