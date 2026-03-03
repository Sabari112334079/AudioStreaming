const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mode: { type: String, enum: ["Listener", "Artist"], default: "Listener" } // 🔹 new field
});

module.exports = mongoose.model("User", userSchema);