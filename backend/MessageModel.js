const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },       // sender email
  receiver: { type: String, required: true },     // receiver email
  text: { type: String, default: "" },
  track: { type: mongoose.Schema.Types.ObjectId, ref: "Track", default: null },
  type: { type: String, enum: ["text", "tune_request"], default: "text" },
  listenSessionId: { type: String, default: null }, // shared session ID for co-listen
  isAccepted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);