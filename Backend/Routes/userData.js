const express=require('express');
const { User } = require('../config/db');
const userData=express.Router();

userData.post('/api/users', async (req, res) => {
    try {
        const { email, name, googleId, accessToken } = req.body;
    
        // Basic validation
        if (!email || !name || !googleId) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Check for existing user
        const existingUser = await User.findOne({
          $or: [{ email }, { googleId }]
        });
    
        if (existingUser) {
          // Update last login
          existingUser.lastLogin = Date.now();
          await existingUser.save();
          return res.json(existingUser);
        }
    
        // Create new user
        const newUser = new User({
          email,
          name,
          googleId,
          refreshToken: accessToken // Only if needed, consider security implications
        });
    
        await newUser.save();
        res.status(201).json(newUser);
      } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Server error' });
      }
  });

  module.exports=userData;

  