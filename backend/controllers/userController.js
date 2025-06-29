// restaurant_b02/backend/controllers/userController.js
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
        const { username, password, email, address, phoneNumber, permissionId, 
        height, weight, allergy, medicalConditions, dietaryPreference, accountType } = req.body;
   
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { username: username } });
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

        if (accountType){
            if (accountType === "admin"){
                const newAdmin =await Admin.create({
                userId: newUser.userId
            });
            console.log(newAdmin);
            return res.json({ success: true, message: 'New admin created'});
            }
                if (accountType === "staff"){
                const newStaff =await Staff.create({
                userId: newUser.userId
                });
                console.log(newStaff);
                return res.json({ success: true, message: 'New staff created'});
                }
        }else{

                // Create a new customer record
        const newCustomer = await Customer.create({
            customerId: newUser.userId, 
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

        }
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

const getProfileData = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        console.log('Received customerId:', customerId); 
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

const getAllCustomer = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1; 
        const limit = 10;
        const offset = (page - 1) * limit;

        const allCustomers = await User.findAll({
            limit,
            offset,
            include: [
                {
                    model: Customer,
                    required: true // 只返回有對應 customer 記錄的 user
                }
            ]
        });

        if (!allCustomers || allCustomers.length === 0) {
            return res.json({ success: false, message: 'No customers found' });
        }

        res.json({ success: true, data: allCustomers });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error fetching customers' });
    }
}

const getAllAdmin = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const allAdmins = await User.findAll({
            limit,
            offset,
            include: [
                {
                    model: Admin,
                    required: true
                }
            ]
        });

        if (!allAdmins || allAdmins.length === 0) {
            return res.json({ success: false, message: 'No admins found' });
        }

        res.json({ success: true, data: allAdmins });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error fetching admins' });
    }
};

const getAllStaff = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const allStaff = await User.findAll({
            limit,
            offset,
            include: [
                {
                    model: Staff,
                    required: true
                }
            ]
        });

        if (!allStaff || allStaff.length === 0) {
            return res.json({ success: false, message: 'No staff found' });
        }

        res.json({ success: true, data: allStaff });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error fetching staff' });
    }
};

const getuserinfoA = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const userInfo = {
            username: user.username,
            email: user.email,
            password: user.password,
            phoneNumber: user.phoneNumber,
            address: user.address
        };
        res.json({ success: true, data: userInfo });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error fetching user info' });
    }
};

const updateuserinfoA = async (req, res) => {
    try {
        const { userId, username, email, password, phoneNumber, address } = req.body;

        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        user.username = username;
        user.email = email;
        user.password = password;
        user.phoneNumber = phoneNumber;
        user.address = address;

        await user.save();
        res.json({ success: true, message: 'User info updated successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user info' });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        console.log(userId, status);
        const customer = await Customer.findOne({ where: { userId } });
        const staff = await Staff.findOne({ where: { userId } });
        console.log();
        console.log();
        if (customer) {
            customer.status = status;
            await customer.save();
            res.json({ success: true, message: 'User status updated successfully' });
            }else{
                if (staff) {
                staff.status = status;
                await staff.save();
                res.json({ success: true, message: 'User status updated successfully' });
                }else{
                    return res.json({ success: false, message: 'User are not staff or customer' });
                }}
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user status' });
    }
};

export { registerUser, loginUser, getProfileData, getCustomerId, updateProfileData, getUserInfoData, updateUserInfoData, getAllCustomer, getAllAdmin, getAllStaff, getuserinfoA, updateuserinfoA, updateUserStatus };