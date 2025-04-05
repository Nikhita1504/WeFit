const express = require('express');
const Communityrouter = express.Router();
const Community = require('../Model/Community');
const authenticateToken = require('../Middleware/Authenticatetowken');


// Create community
Communityrouter.post('/create/:token', authenticateToken, async (req, res) => {
  try {
    const { name, tag } = req.body;
    const userId = req.user.userId;

    const existing = await Community.findOne({ tag });
    if (existing) return res.status(400).json({ message: 'Community with this tag already exists' });

    const community = new Community({ name, tag, users: [userId] });
    await community.save();

    res.status(201).json({ message: 'Community created', community });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Join community
Communityrouter.post('/join/:token', authenticateToken, async (req, res) => {
  try {
    const { communityId } = req.body;
    const userId = req.user.userId;

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (community.users.includes(userId)) {
      return res.status(400).json({ message: 'User already in community' });
    }

    community.users.push(userId);
    await community.save();

    res.status(200).json({ message: 'Joined community', community });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

Communityrouter.get('/all', async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

Communityrouter.get('/user/:token', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const communities = await Community.find({ users: userId }).populate('users');
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

Communityrouter.get('/members/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID' });
    }

    const community = await Community.findById(communityId).populate('users', '-password'); // Exclude password field
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.status(200).json({ users: community.users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = Communityrouter;
