const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db'); // Adjust path as needed
const authenticateToken = require('../Middleware/Authenticatetowken');
const Community = require('../Model/community');

const communityData = express.Router();

// Get all communities
communityData.get('/all', async (req, res) => {
  try {
    const communities = await Community.find()
      .select('name description tags isPrivate members createdAt')
      .lean();
    
    // Transform data to include member count
    const formattedCommunities = communities.map(community => ({
      _id: community._id,
      name: community.name,
      description: community.description,
      tags: community.tags,
      isPrivate: community.isPrivate,
      membersCount: community.members.length,
      createdAt: community.createdAt
    }));
    
    res.status(200).json(formattedCommunities);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new community
communityData.post('/create/:token',authenticateToken, async (req, res) => {
  try {
    // Extract token and verify
    // const token = req.params.token;
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;
    const userId = req.user.userId; 
    
    // Extract data from request body
    const { name, description, tags} = req.body;
    
    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    
    // If community is private, access code is required
    
    
    // Create new community
    const community = new Community({
      name,
      description,
      tags: tags || [],
      isPrivate:false,
    //   accessCode: isPrivate ? accessCode : null,
      members: [{
        userId,
        role: 'leader',
        joinedAt: Date.now()
      }]
    });
    console.log(community)
    // Save to database
    const newCommunity = await community.save();
    
   
    
    res.status(201).json(newCommunity);
  } catch (error) {
    console.log(error);
    
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Community with this name already exists' });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Join a community
communityData.post('/join/:token', async (req, res) => {
  try {
    // Extract token and verify
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Get community ID and access code
    const { communityId, accessCode } = req.body;
    
    if (!communityId) {
      return res.status(400).json({ message: 'Community ID is required' });
    }
    
    // Find the community
    const community = await Community.findById(communityId);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if community is private and validate access code
    if (community.isPrivate) {
      if (!accessCode) {
        return res.status(400).json({ message: 'Access code is required for this community' });
      }
      
      if (community.accessCode !== accessCode) {
        return res.status(403).json({ message: 'Invalid access code' });
      }
    }
    
    // Check if user is already a member
    const isMember = community.members.some(member => 
      member.userId.toString() === userId.toString()
    );
    
    if (isMember) {
      return res.status(409).json({ message: 'You are already a member of this community' });
    }
    
    // Add user to community
    community.members.push({
      userId,
      role: 'member',
      joinedAt: Date.now()
    });
    
    await community.save();
    
    // Update user's communities list
    await User.findByIdAndUpdate(userId, {
      $push: { communities: communityId }
    });
    
    res.status(200).json({ 
      message: 'Joined community successfully',
      communityName: community.name 
    });
  } catch (error) {
    console.log(error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Get user's communities
communityData.get('/user/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    const communities = await Community.find({
      'members.userId': userId
    }).select('name description tags isPrivate members createdAt');
    
    // Format data for frontend
    const userCommunities = communities.map(community => {
      const userMember = community.members.find(
        member => member.userId.toString() === userId.toString()
      );
      
      return {
        _id: community._id,
        name: community.name,
        description: community.description,
        tags: community.tags,
        isPrivate: community.isPrivate,
        role: userMember.role,
        joinedAt: userMember.joinedAt,
        points: userMember.points || 0,
        membersCount: community.members.length,
        createdAt: community.createdAt
      };
    });
    
    res.status(200).json(userCommunities);
  } catch (error) {
    console.log(error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Get community by ID
communityData.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });
    res.json(community);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update community
communityData.patch('/:id/:token', async (req, res) => {
  try {
    // Verify token and user permissions
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Find community
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is a leader
    const userMember = community.members.find(
      member => member.userId.toString() === userId.toString()
    );
    
    if (!userMember || userMember.role !== 'leader') {
      return res.status(403).json({ message: 'Only community leaders can update community details' });
    }
    
    // Update community
    const updatedCommunity = await Community.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedCommunity);
  } catch (error) {
    console.log(error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Delete community
communityData.delete('/:id/:token', async (req, res) => {
  try {
    // Verify token and user permissions
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    
    // Find community
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    
    // Check if user is a leader
    const userMember = community.members.find(
      member => member.userId.toString() === userId.toString()
    );
    
    if (!userMember || userMember.role !== 'leader') {
      return res.status(403).json({ message: 'Only community leaders can delete the community' });
    }
    
    // Delete the community
    await Community.findByIdAndDelete(req.params.id);
    
    // Remove community reference from all users
    await User.updateMany(
      { communities: req.params.id },
      { $pull: { communities: req.params.id } }
    );
    
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.log(error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: error.message });
  }
});

module.exports = communityData;

