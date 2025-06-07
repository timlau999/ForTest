// ForTest/backend/routes/userRoute.js
import express from 'express';
import { registerUser, loginUser, getProfileData, getCustomerId, updateProfileData, getUserInfoData, updateUserInfoData, getAllCustomer, getAllAdmin, getAllStaff } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile/:customerId', getProfileData);

router.get('/customer/:userId', getCustomerId);

router.put('/profile/:customerId', updateProfileData);

router.get('/userinfo/:customerId', getUserInfoData);

router.put('/userinfo/:customerId', updateUserInfoData);

router.post('/getCustomer', getAllCustomer);

router.post('/getAdmin', getAllAdmin);

router.post('/getStaff', getAllStaff);

export default router;
