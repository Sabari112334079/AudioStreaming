const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const routes = require("./Routes");
const path = require("path");

const app = express();

// CORS with credentials
app.use(cors({
  origin: "http://localhost:5173", // Your React dev server
  credentials: true
}));

// Session middleware - MUST come before routes
app.use(session({
  secret: "your-secret-key-change-this-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/", routes);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/sabariDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});