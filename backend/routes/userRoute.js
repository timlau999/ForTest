// ForTest/backend/routes/userRoute.js
import express from 'express';
import { registerUser, loginUser, getProfileData, getCustomerId, updateProfileData } from '../controllers/userController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login a user
router.post('/login', loginUser);

// 获取用户的 profile 资料
router.get('/profile/:customerId', getProfileData);

// 新增：获取 customerId
router.get('/customer/:userId', getCustomerId);

// 修改用户的 profile 资料
router.put('/profile/:customerId', updateProfileData);

export default router;
