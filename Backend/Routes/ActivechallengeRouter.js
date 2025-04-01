const express = require("express");

const ActiveChallenge  = require("../Model/ActiveChallege");
const { Challenge } = require("../config/db"); // Ensure Challenge model is imported
const { User } = require("../config/db"); // Ensure User model is imported
const authenticateToken = require("../Middleware/Authenticatetowken"); // Middleware to verify JWT

const ActiveChallengeRouter = express.Router();

ActiveChallengeRouter.post("/create/:token", authenticateToken, async (req, res) => {
  try {
    // Extract decoded userId from req.user (set by authenticateToken middleware)
    console.log(req.user.userId);
    const userId = req.user.userId;
    
    const { challengeId, ethStaked, rewardsEarned, timeLeft, isCompleted } = req.body;

    // Validate if challengeId exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    
     // ✅ Prepare exercises from Challenge schema
     const exercises = challenge.exercises.map((exercise) => ({
      name: exercise.name,
      reps: exercise.reps,
      completedReps: 0,
      isCompleted: false,
      isVideoRequired: exercise.name.toLowerCase() !== "step", // ✅ Step doesn't need a video
      videoUrl: "" // ✅ Default empty video URL
    }));

    // Create Active Challenge document
    const newChallenge = new ActiveChallenge({
      userId,
      challengeId,
      exercises, // Use exercises from Challenge schema
      ethStaked,
      rewardsEarned,
      timeLeft,
      isCompleted,
    });

    await newChallenge.save();
    res.status(201).json({ message: "Active Challenge created successfully!", challenge: newChallenge });
  } catch (error) {
    console.error("Error creating Active Challenge:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = ActiveChallengeRouter;
