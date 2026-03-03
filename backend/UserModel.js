const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mode: { type: String, enum: ["Listener", "Artist"], default: "Listener" },
  
  // Profile details
  avatar: { type: String, default: "https://ui-avatars.com/api/?name=User" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  
  // Artist-specific details
  genre: { type: String, default: "" },
  verified: { type: Boolean, default: false },
  
  // Stats
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  totalTracks: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);