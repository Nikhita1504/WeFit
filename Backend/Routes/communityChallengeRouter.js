const express = require('express');
const router = express.Router();
const CommunityChallenge = require('../Model/communityChallenge');
const communityChallenge = require('../Model/communityChallenge');

// ✅ Create a new community challenge
router.post('/create', async (req, res) => {
  try {
    console.log("backend",req.body)
    const challenge = new communityChallenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📥 Get all challenges for a community
router.get('/community/:communityId', async (req, res) => {
  try {
    const challenges = await CommunityChallenge.find({ communityId: req.params.communityId });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👤 Join a challenge
router.post('/join/:challengeId', async (req, res) => {
  const { userId } = req.body;
  try {
    const challenge = await CommunityChallenge.findById(req.params.challengeId);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

    const alreadyParticipant = challenge.participants.find(p => p.userId.toString() === userId);
    if (alreadyParticipant) return res.status(400).json({ error: 'User already joined' });

    challenge.participants.push({ userId });
    await challenge.save();

    res.json({ message: 'Joined challenge successfully', challenge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Accept challenge
router.post('/accept/:challengeId', async (req, res) => {
  const { userId } = req.body;
  try {
    const challenge = await CommunityChallenge.findById(req.params.challengeId);
    const participant = challenge.participants.find(p => p.userId.toString() === userId);

    if (!participant) return res.status(404).json({ error: 'User not in participant list' });

    participant.accepted = true;
    participant.stakeSubmitted = true; // Assume stake is auto-submitted
    await challenge.save();

    res.json({ message: 'Challenge accepted', challenge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark challenge as completed
router.post('/complete/:challengeId', async (req, res) => {
  const { userId } = req.body;
  try {
    const challenge = await CommunityChallenge.findById(req.params.challengeId);
    const participant = challenge.participants.find(p => p.userId.toString() === userId);

    if (!participant) return res.status(404).json({ error: 'User not in participant list' });

    participant.completed = true;
    participant.completedAt = new Date();
    await challenge.save();

    res.json({ message: 'Challenge marked as completed', challenge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
