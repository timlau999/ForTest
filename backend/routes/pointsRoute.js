// backend/models/pointsRoute.js
import express from 'express';
import { getUserPoints, usePoints } from '../controllers/pointsController';
import authMiddleware from '../middleware/auth';

const pointsRouter = express.Router();

pointsRouter.post('/get', authMiddleware, getUserPoints);
pointsRouter.post('/use', authMiddleware, usePoints);

export default pointsRouter;