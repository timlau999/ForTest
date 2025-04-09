// /MyFYP_HD/backend/routes/userRoute.js
import express from 'express';
import { registerUser, loginUser, getProfileData } from '../controllers/userController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// 获取用户的 profile 资料
router.get('/profile/:customerId', getProfileData);

export default router;
