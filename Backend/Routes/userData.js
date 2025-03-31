const express = require('express');
const { User } = require('../config/db');
const userData = express.Router();
const jwt = require('jsonwebtoken');

userData.post('/', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    console.log("hello")

    // Validate required fields
    if (!email || !googleId) {
      return res.status(400).json({
        message: 'Missing required fields: email, googleId, accessToken'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ googleId }, { email }]
    });

    if (existingUser) {
      // Update refresh token if user exists
      // existingUser.refreshToken = accessToken;
    
      const generateToken = jwt.sign(
        { userId: existingUser._id, email: existingUser.email }, // Payload
        process.env.JWT_SECRET,
  
      );
      return res.status(200).json(
        {user:existingUser,
        token:generateToken}

        );
    }

    // Create new user with only Google auth data
    const newUser = new User({
      googleId,
      email,
      name: name || '', // Handle case where name might be null
      // Other fields will use schema defaults:
      // walletAddress: undefined
      // challengesWon: []
      // currentStreak: 0
      // lastActive: Date.now()
    });

    // Validate before save
    await newUser.validate();

    const savedUser = await newUser.save();

    // Return user data without sensitive info
    const userResponse = {
      _id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
      googleId: savedUser.googleId,
      walletAddress: savedUser.walletAddress,
      currentStreak: savedUser.currentStreak,
      createdAt: savedUser.createdAt
    };

    console.log(userResponse);
    const generateToken = jwt.sign(
      { userId: newUser._id, email: newUser.email }, // Payload
      process.env.JWT_SECRET,

    );

    console.log(generateToken);

    res.status(201).json({
      user: userResponse,
      token: generateToken
    });


  } catch (err) {
    console.error('User creation error:', err);

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'User with this email or Google ID already exists'
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      message: 'Internal server error during user creation'
    });
  }
});

module.exports = userData;

