const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  tag: {
    type: String,
    required: true,
    unique: true, // ensures no two communities have the same tag
    lowercase: true,
    trim: true
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
