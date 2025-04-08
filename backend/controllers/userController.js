// /MyFYP_HD/backend/controllers/userController.js
import User from '../models/userModel.js';
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


const loginUser = async (req, res) => {
  try {
    const {email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ 
      where: { 
        email: email, 
        password: password 
      } 
    });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.userid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error logging in' });
  }
};


export { registerUser, loginUser };
