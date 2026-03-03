const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  fileUrl: { type: String, required: true }, // path or URL to uploaded file
  uploadedBy: { type: String, required: true }, // email of uploader
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Song", songSchema);