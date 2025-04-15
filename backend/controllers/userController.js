// ForTest/backend/controllers/userController.js
import User from '../models/userModel.js';
import Permission from '../models/permissionModel.js';
import Admin from '../models/adminModel.js';
import Staff from '../models/staffModel.js';
import Customer from '../models/customerModel.js';
import CustomerProfile from '../models/customerProfileModel.js';
import jwt from 'jsonwebtoken';

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { username, password, email, address, phoneNumber, permissionId, height, weight, allergy, medicalConditions, dietaryPreference } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ success: false, message: 'Username already exists' });
        }

        // Create a new user
        const newUser = await User.create({
            username,
            password,
            email,
            address,
            phoneNumber,
            permissionId
        });

        // Create a new customer record
        const newCustomer = await Customer.create({
            customerId: newUser.userId, // 假设 customerId 和 userId 相同
            userId: newUser.userId
        });

        // Create a new customer profile record
        await CustomerProfile.create({
            customerId: newCustomer.customerId,
            height,
            weight,
            allergy,
            medicalConditions,
            dietaryPreference
        });

        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error registering user' });
    }
};

// Login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Compare the passwords
        if (password!== user.password) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        // Get the user's role
        let role = '';
        const admin = await Admin.findOne({ where: { userId: user.userId } });
        if (admin) {
            role = 'admin';
        } else {
            const staff = await Staff.findOne({ where: { userId: user.userId } });
            if (staff) {
                role = 'staff';
            } else {
                const customer = await Customer.findOne({ where: { userId: user.userId } });
                if (customer) {
                    role = 'customer';
                }
            }
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, message: 'Login successful', token, role, username: user.username, id: user.userId });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error logging in' });
    }
};

// 获取用户的 profile 资料
const getProfileData = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        console.log('Received customerId:', customerId); 
        // 查找用戶的 profile 資料
        const profileData = await CustomerProfile.findOne({ where: { customerId } });
        if (!profileData) {
            return res.json({ success: false, message: 'Profile data not found' });
        }

        res.json({ success: true, data: profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error fetching profile data' });
    }
};

// 新增：获取 customerId
const getCustomerId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const customer = await Customer.findOne({ where: { userId } });
        if (!customer) {
            return res.json({ success: false, message: 'Customer not found' });
        }
        res.json({ success: true, customerId: customer.customerId });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error fetching customerId' });
    }
};

// 修改用户的 profile 资料
const updateProfileData = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const { height, weight, allergy, medicalConditions, dietaryPreference } = req.body;

        const profileData = await CustomerProfile.findOne({ where: { customerId } });
        if (!profileData) {
            return res.json({ success: false, message: 'Profile data not found' });
        }

        await profileData.update({
            height,
            weight,
            allergy,
            medicalConditions,
            dietaryPreference
        });

        res.json({ success: true, message: 'Profile data updated successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating profile data' });
    }
};

// 获取用户的详细资料
const getUserInfoData = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const customer = await Customer.findOne({ where: { customerId } });
        if (!customer) {
            return res.json({ success: false, message: 'Customer not found' });
        }
        const user = await User.findOne({ where: { userId: customer.userId } });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const userInfoData = {
            customerId,
            username: user.username,
            password: user.password,
            email: user.email,
            address: user.address,
            phoneNumber: user.phoneNumber
        };
        res.json({ success: true, data: userInfoData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error fetching user info data' });
    }
};

// 修改用户的详细资料
const updateUserInfoData = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const { username, password, email, address, phoneNumber } = req.body;
        const customer = await Customer.findOne({ where: { customerId } });
        if (!customer) {
            return res.json({ success: false, message: 'Customer not found' });
        }
        const user = await User.findOne({ where: { userId: customer.userId } });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        await user.update({
            username,
            password,
            email,
            address,
            phoneNumber
        });
        res.json({ success: true, message: 'User info data updated successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user info data' });
    }
};

export { registerUser, loginUser, getProfileData, getCustomerId, updateProfileData, getUserInfoData, updateUserInfoData };