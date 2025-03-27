// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const URL = process.env.MONGO_URI;

mongoose
  .connect(URL)
  .then(() => {
    console.log("User database connected");
  })
  .catch((e) => {
    console.log("User database connection error", e);
  });

// User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  refreshToken: String
});

const User = mongoose.model('User', userSchema);

module.exports = { User};