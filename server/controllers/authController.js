const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token generate 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Fields check 
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Please fill all fields' 
            });
        }

        // User already exists ?
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                message: 'User already exists' 
            });
        }

        // Password hash 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // User create 
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Response 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fields check 
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please fill all fields' 
            });
        }

        // User exists ?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Password check 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Response 
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };