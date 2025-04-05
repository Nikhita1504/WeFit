const express = require('express');
const { User } = require('../config/db');
const userData = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../Middleware/Authenticatetowken');

// Get user by email
userData.get('/get/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(findUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Register or login user
userData.post('/', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        message: 'Missing required fields: email, googleId'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ googleId }, { email }]
    });

    if (existingUser) {
      const generateToken = jwt.sign(
        { userId: existingUser._id, email: existingUser.email, isNewUser: false }, // Include isNewUser flag
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        user: existingUser,
        token: generateToken,
        isNewUser: false // Ensure the flag is included in the response
      });
    }

    const newUser = new User({
      googleId,
      email,
      name: name || '',
      totalEthEarned: 0
    });

    await newUser.validate();
    const savedUser = await newUser.save();

    const userResponse = {
      _id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
      googleId: savedUser.googleId,
      walletAddress: savedUser.walletAddress,
      currentStreak: savedUser.currentStreak,
      createdAt: savedUser.createdAt
    };

    const generateToken = jwt.sign(
      { userId: newUser._id, email: newUser.email, isNewUser: true }, // Include isNewUser flag for new user
      process.env.JWT_SECRET
    );

    res.status(201).json({
      user: userResponse,
      token: generateToken,
      isNewUser: true // Ensure the flag is included in the response
    });

  } catch (err) {
    console.error('User creation error:', err);

    if (err.code === 11000) {
      return res.status(409).json({
        message: 'User with this email or Google ID already exists'
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }

    return res.status(500).json({
      message: 'Internal server error during user creation'
    });
  }
});



// Update wallet address
userData.put('/updateWallet/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const { walletAddress } = req.body;

    const updateWalletAddress = await User.findOneAndUpdate(
      { email },
      { walletAddress },
      { new: true }
    );

    if (!updateWalletAddress) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Wallet address updated successfully",
      user: updateWalletAddress
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 🔄 Update physical data
userData.put('/updatePhysicalData/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const {
      height,
      weight,
      bmi,
      age,
      gender,
      goals
    } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      {
        physicalData: {
          height,
          weight,
          bmi,
          age,
          gender,
          goals
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Physical data updated successfully",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating physical data" });
  }
});
// Update challengeWon count
userData.put('/updateChallengeWon/:token', authenticateToken, async (req, res) => {
  try {
    // console.log("updatechallengewon")
    const email = req.user.email;
    // console.log(email); // Assuming authenticateToken adds the email to req.user

    // Find the user by email and increment the challengeWon count by 1
    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { challengesWon: 1 } }, // Increment the challengeWon field
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Challenge won count updated successfully",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating challengeWon" });
  }
});
userData.put('/updateRewardsEarned/:token', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const { rewardAmount } = req.body;

    if (!rewardAmount || isNaN(rewardAmount)) {
      return res.status(400).json({ message: "Invalid or missing rewardAmount" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { totalEthEarned: rewardAmount } }, // Add ETH amount
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Rewards earned updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error in /updateRewardsEarned:", error);
    res.status(500).json({ message: "Error updating rewardsEarned" });
  }
});



module.exports = userData;
