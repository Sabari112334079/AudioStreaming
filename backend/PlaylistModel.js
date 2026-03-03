const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  coverUrl: { type: String, default: "https://picsum.photos/200" },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Playlist", playlistSchema);