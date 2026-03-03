const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String, default: "" },
  
  // Track sharing
  track: { type: mongoose.Schema.Types.ObjectId, ref: "Track", default: null },
  type: { type: String, enum: ["text", "tune_request"], default: "text" },
  
  // Listen together session
  listenSessionId: { type: String, default: null },
  isAccepted: { type: Boolean, default: false },
  
  // Read status
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);