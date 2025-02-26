const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Utility function to generate token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRY),
  });
};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, telephone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ firstName, lastName, email, password, telephone });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    // Set cookie expiry in milliseconds
    const cookieExpiry = parseInt(process.env.JWT_EXPIRY) * 1000;
    const expiresIn = parseInt(process.env.JWT_EXPIRY);

    res
      .cookie('wellsora_token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: cookieExpiry, // Set cookie expiry time in milliseconds
      })
      .json({ message: 'Login successful', token, expiresIn});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  try {
    res.cookie('wellsora_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 0, // Immediately expire the cookie
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during logout' });
  }
};

