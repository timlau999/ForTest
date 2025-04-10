// /MyFYP_HD/backend/controllers/userController.js
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
        const { username, password, email, address, phoneNumber, name, permissionId } = req.body;

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
            name,
            permissionId
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

        // 查询 customerId 和 customerprofileId
        let customerId = null;
        let customerprofileId = null;
        if (role === 'customer') {
            const customer = await Customer.findOne({ where: { userId: user.userId } });
            if (customer) {
                customerId = customer.customerId;
                const customerProfile = await CustomerProfile.findOne({ where: { customerId } });
                if (customerProfile) {
                    customerprofileId = customerProfile.profileId;
                }
            }
        }

        res.json({ success: true, message: 'Login successful', token, role, name: user.name, customerId, customerprofileId });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error logging in' });
    }
};

// 获取用户的 profile 资料
const getProfileData = async (req, res) => {
    try {
        const customerId = req.params.customerId;

        // 查找用户的 profile 资料
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

export { registerUser, loginUser, getProfileData };