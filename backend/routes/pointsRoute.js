import express from 'express';
import { getCustomerPoints, usePoints, getPointsA } from '../controllers/pointsController.js';

const router = express.Router();

router.get('/:customerId', getCustomerPoints);
router.post('/:customerId/use', usePoints);
router.post('/getPointsA/', getPointsA);

export default router;    