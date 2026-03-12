const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default; // ✅ ADD THIS
const path = require("path");
const fs = require("fs");
const routes = require("./Routes");

const app = express();

const MONGO_URI = "mongodb://localhost:27017/twintones";

// ✅ 1. Uploads directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads directory");
}

// ✅ 2. CORS
app.use(cors({ origin: "http://localhost:5173",
  credentials: true
}));

// ✅ 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4. MongoDB — connect BEFORE session so MongoStore can use it
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use(session({
  secret: "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: {
    secure: false,
    sameSite: "lax",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// ✅ 6. Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ 7. Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ✅ 8. Routes
app.use("/", routes);

// ✅ 9. Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  if (err.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ message: "File too large. Max size is 50MB." });
  if (err.message?.includes("audio"))
    return res.status(400).json({ message: err.message });
  res.status(500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});