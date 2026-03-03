const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  filename: { type: String, required: true },
  originalName: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Track", trackSchema);