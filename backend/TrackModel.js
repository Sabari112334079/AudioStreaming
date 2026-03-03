const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  
  // File info
  filename: { type: String, required: true },
  originalName: { type: String },
  fileSize: { type: Number }, // in bytes
  duration: { type: Number }, // in seconds
  
  // Artist info
  artist: { type: String, default: "Unknown Artist" },
  artistEmail: { type: String }, // reference to user
  
  // Metadata
  genre: { type: String, default: "Unknown" },
  album: { type: String, default: "" },
  releaseYear: { type: Number },
  coverArt: { type: String, default: "https://picsum.photos/400/400" },
  
  // Stats
  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  
  // Tags
  tags: [{ type: String }],
  
  // Visibility
  isPublic: { type: Boolean, default: true },
  
  // Timestamps
  uploadedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for search
trackSchema.index({ title: 'text', artist: 'text', genre: 'text' });

module.exports = mongoose.model("Track", trackSchema);