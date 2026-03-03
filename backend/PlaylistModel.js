const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  coverUrl: { type: String, default: "https://picsum.photos/400/400" },
  
  // Owner info
  createdBy: { type: String }, // email
  createdByName: { type: String },
  
  // Tracks
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  
  // Metadata
  genre: { type: String, default: "Mixed" },
  isPublic: { type: Boolean, default: true },
  isCollaborative: { type: Boolean, default: false },
  
  // Stats
  followers: { type: Number, default: 0 },
  totalPlays: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Playlist", playlistSchema);