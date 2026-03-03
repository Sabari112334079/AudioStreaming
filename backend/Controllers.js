const User = require("./UserModel");
const Playlist = require("./PlaylistModel");
const Track = require("./TrackModel");
const Message = require("./MessageModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------------- Authentication Middleware ----------------
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// ---------------- User Controllers ----------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== password) return res.status(400).json({ message: "Invalid password" });
    
    // Store user in session
    req.session.user = {
      email: user.email,
      name: user.name,
      _id: user._id,
      mode: user.mode
    };
    
    console.log("✅ User logged in:", req.session.user);
    
    res.json({ 
      message: "Login successful", 
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
        mode: user.mode
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
};

const getCurrentUser = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.session.user });
};

const getProfile = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMode = async (req, res) => {
  try {
    const { email, mode } = req.body;
    if (!email || !mode) return res.status(400).json({ message: "Email and mode required" });
    const normalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase();
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { mode: normalizedMode },
      { new: true, returnDocument: "after" }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    
    // Update session
    if (req.session.user && req.session.user.email === email) {
      req.session.user.mode = normalizedMode;
    }
    
    res.json({ message: "Mode updated", user: updatedUser });
  } catch (err) {
    console.error("Update mode error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- Track Controllers ----------------
const uploadTrack = [
  upload.single("track"),
  async (req, res) => {
    try {
      const { title, playlistId } = req.body;
      const file = req.file;

      if (!title || !file || !playlistId)
        return res.status(400).json({ message: "Title, audio file, and playlistId are required" });

      // Save track
      const newTrack = new Track({
        title,
        filename: file.filename,
        originalName: file.originalname,
        uploadedAt: new Date(),
      });
      await newTrack.save();

      // Add track to playlist
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) return res.status(404).json({ message: "Playlist not found" });

      playlist.tracks.push(newTrack._id);
      await playlist.save();

      // Populate tracks if needed and return
      const updatedPlaylist = await Playlist.findById(playlistId).populate("tracks");
      res.json({ message: "Track uploaded and added to playlist", track: newTrack, playlist: updatedPlaylist });
    } catch (err) {
      console.error("Upload track error:", err);
      res.status(500).json({ message: "Server error while uploading track" });
    }
  },
];

const getAllSongs = async (req, res) => {
  try {
    const songs = await Track.find().sort({ uploadedAt: -1 });
    res.json({ songs });
  } catch (err) {
    console.error("Get all songs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Playlist Controllers ----------------
const addPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate("tracks")
      .sort({ createdAt: -1 });

    res.json({ playlists });
  } catch (err) {
    console.error("Error fetching playlists:", err);
    res.status(500).json({ message: "Server error fetching playlists" });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { title, description, coverUrl, trackIds } = req.body;

    const newPlaylist = new Playlist({
      title,
      description,
      coverUrl,
      tracks: trackIds || [],
    });

    await newPlaylist.save();
    res.status(201).json({ message: "Playlist created", playlist: newPlaylist });
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).json({ message: "Server error creating playlist" });
  }
};

const addTrackToPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.body;
    if (!playlistId || !trackId)
      return res.status(400).json({ message: "playlistId and trackId are required" });

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (playlist.tracks.includes(trackId))
      return res.status(400).json({ message: "Track already in playlist" });

    playlist.tracks.push(trackId);
    await playlist.save();

    const updated = await Playlist.findById(playlistId).populate("tracks");
    res.json({ message: "Track added to playlist", playlist: updated });
  } catch (err) {
    console.error("addTrackToPlaylist error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Message Controllers ----------------
const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    if (!sender || !receiver)
      return res.status(400).json({ message: "sender and receiver required" });

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    })
      .populate("track")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getConversations = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "email required" });

    const msgs = await Message.find({
      $or: [{ sender: email }, { receiver: email }],
    }).sort({ createdAt: -1 });

    // Unique conversation partners
    const seen = new Set();
    const conversations = [];
    for (const m of msgs) {
      const partner = m.sender === email ? m.receiver : m.sender;
      if (!seen.has(partner)) {
        seen.add(partner);
        conversations.push({ partner, lastMessage: m });
      }
    }

    res.json({ conversations });
  } catch (err) {
    console.error("getConversations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, text } = req.body;
    if (!sender || !receiver || !text)
      return res.status(400).json({ message: "sender, receiver, text required" });

    const msg = new Message({ sender, receiver, text, type: "text" });
    await msg.save();
    res.status(201).json({ message: "Message sent", data: msg });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendTuneRequest = async (req, res) => {
  try {
    const { sender, receiver, trackId, text } = req.body;
    if (!sender || !receiver || !trackId)
      return res.status(400).json({ message: "sender, receiver, trackId required" });

    const track = await Track.findById(trackId);
    if (!track) return res.status(404).json({ message: "Track not found" });

    const listenSessionId = uuidv4();

    const msg = new Message({
      sender,
      receiver,
      text: text || `🎵 ${track.title} — listen together?`,
      track: trackId,
      type: "tune_request",
      listenSessionId,
    });
    await msg.save();

    const populated = await Message.findById(msg._id).populate("track");
    res.status(201).json({ message: "Tune request sent", data: populated });
  } catch (err) {
    console.error("sendTuneRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptTune = async (req, res) => {
  try {
    const { messageId } = req.body;
    if (!messageId) return res.status(400).json({ message: "messageId required" });

    const msg = await Message.findByIdAndUpdate(
      messageId,
      { isAccepted: true },
      { new: true }
    ).populate("track");

    if (!msg) return res.status(404).json({ message: "Message not found" });

    res.json({ message: "Tune accepted", data: msg });
  } catch (err) {
    console.error("acceptTune error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { email } = req.query;
    
    // Build query - if email provided, exclude that user
    const query = email ? { email: { $ne: email } } : {};
    
    const users = await User.find(query).select("name email");
    
    console.log("getAllUsers called, email param:", email);
    console.log("Users found:", users);
    
    res.json({ users });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------- Exports ----------------
module.exports = { 
  login, 
  register,
  logout,
  getCurrentUser,
  requireAuth,
  getProfile,
  updateMode,
  uploadTrack,
  getAllSongs,
  addPlaylists,
  createPlaylist,
  addTrackToPlaylist,
  getMessages,
  getConversations,
  sendMessage,
  sendTuneRequest,
  acceptTune,
  getAllUsers
};