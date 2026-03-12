const User = require("./UserModel");
const Playlist = require("./PlaylistModel");
const Track = require("./TrackModel");
const Message = require("./MessageModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// ---------------- Directory Setup ----------------
const UPLOAD_BASE = path.join(__dirname, "uploads");
const AUDIO_DIR   = path.join(UPLOAD_BASE, "audio");
const COVERS_DIR  = path.join(UPLOAD_BASE, "covers");

[UPLOAD_BASE, AUDIO_DIR, COVERS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cover") {
      cb(null, COVERS_DIR);
    } else {
      cb(null, AUDIO_DIR);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "track") {
    const allowedMimetypes = [
      "audio/mpeg", "audio/mp3", "audio/wav", "audio/wave",
      "audio/x-wav", "audio/ogg", "audio/mp4", "audio/x-m4a",
      "audio/aac", "audio/flac",
    ];
    const allowedExts = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;
    const ok = allowedExts.test(path.extname(file.originalname)) || allowedMimetypes.includes(file.mimetype);
    return ok ? cb(null, true) : cb(new Error(`Unsupported audio type: ${file.mimetype}`));
  }

  if (file.fieldname === "cover") {
    const allowedMimetypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const ok = allowedMimetypes.includes(file.mimetype);
    return ok ? cb(null, true) : cb(new Error(`Unsupported image type: ${file.mimetype}`));
  }

  cb(new Error("Unexpected field: " + file.fieldname));
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});

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

    user.lastActive = new Date();
    await user.save();

    req.session.user = {
      email: user.email,
      name: user.name,
      _id: user._id,
      mode: user.mode,
      avatar: user.avatar,
      verified: user.verified,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session error" });
      }
      console.log("✅ Session saved:", req.session.id, req.session.user);
      res.json({
        message: "Login successful",
        user: {
          email: user.email,
          name: user.name,
          _id: user._id,
          mode: user.mode,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          genre: user.genre,
          verified: user.verified,
          followers: user.followers,
          following: user.following,
          totalTracks: user.totalTracks,
          createdAt: user.createdAt,
        },
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, mode = "Listener", bio = "", location = "", genre = "" } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;

    const newUser = new User({ name, email, password, mode, bio, location, genre, avatar });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email, avatar: newUser.avatar },
    });
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
  try {
    const user = await User.findOne({ email: req.session.user.email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
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

const updateProfile = async (req, res) => {
  try {
    const { email, name, bio, location, genre, mode } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (genre !== undefined) updateData.genre = genre;
    if (mode) updateData.mode = mode;

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    if (req.session.user && req.session.user.email === email) {
      req.session.user.name = updatedUser.name;
      req.session.user.mode = updatedUser.mode;
    }

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
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
      { new: true }
    ).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

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
  upload.fields([
    { name: "track", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description = "",
        genre = "Unknown",
        album = "",
        releaseYear,
        tags = "",
      } = req.body;

      const file      = req.files?.["track"]?.[0];
      const coverFile = req.files?.["cover"]?.[0];

      if (!title || !file) {
        if (file)      fs.unlinkSync(file.path);
        if (coverFile) fs.unlinkSync(coverFile.path);
        return res.status(400).json({ message: "Title and audio file are required" });
      }

      const artistEmail = req.session?.user?.email || "unknown@email.com";
      const artistName  = req.session?.user?.name  || "Unknown Artist";

      const tagArray = tags
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      // URLs use subpath: /uploads/audio/... or /uploads/covers/...
      const coverArt = coverFile
        ? `http://localhost:5000/uploads/covers/${coverFile.filename}`
        : `https://picsum.photos/seed/${Date.now()}/400/400`;

      const newTrack = new Track({
        title,
        description,
        filename:     file.filename,
        originalName: file.originalname,
        fileSize:     file.size,
        artist:       artistName,
        artistEmail,
        genre,
        album,
        coverArt,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        tags:        tagArray,
        uploadedAt:  new Date(),
      });

      await newTrack.save();

      await User.findOneAndUpdate(
        { email: artistEmail },
        { $inc: { totalTracks: 1 } }
      );

      res.json({ message: "Track uploaded successfully", track: newTrack });
    } catch (err) {
      console.error("Upload track error:", err);
      res.status(500).json({ message: "Server error while uploading track" });
    }
  },
];

const getAllSongs = async (req, res) => {
  try {
    const { genre, artist, search, limit = 50, skip = 0 } = req.query;

    let query = { isPublic: true };
    if (genre && genre !== "all") query.genre = genre;
    if (artist) query.artistEmail = artist;
    if (search) {
      query.$or = [
        { title:  { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
        { genre:  { $regex: search, $options: "i" } },
      ];
    }

    const songs = await Track.find(query)
      .sort({ uploadedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Track.countDocuments(query);
    res.json({ songs, total, page: Math.floor(skip / limit) + 1 });
  } catch (err) {
    console.error("Get all songs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findById(id);
    if (!track) return res.status(404).json({ message: "Track not found" });
    track.plays += 1;
    await track.save();
    res.json({ track });
  } catch (err) {
    console.error("Get track error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const likeTrack = async (req, res) => {
  try {
    const { trackId } = req.body;
    const track = await Track.findByIdAndUpdate(
      trackId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!track) return res.status(404).json({ message: "Track not found" });
    res.json({ message: "Track liked", likes: track.likes });
  } catch (err) {
    console.error("Like track error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Playlist Controllers ----------------
const addPlaylists = async (req, res) => {
  try {
    const { userEmail } = req.query;
    let query = { isPublic: true };
    if (userEmail) query.createdBy = userEmail;

    const playlists = await Playlist.find(query).populate("tracks").sort({ createdAt: -1 });
    res.json({ playlists });
  } catch (err) {
    console.error("Error fetching playlists:", err);
    res.status(500).json({ message: "Server error fetching playlists" });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { title, description = "", coverUrl, genre = "Mixed", isPublic = true } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const createdBy     = req.session?.user?.email;
    const createdByName = req.session?.user?.name || "Unknown";

    const newPlaylist = new Playlist({
      title, description,
      coverUrl: coverUrl || "https://picsum.photos/400/400",
      createdBy, createdByName, genre, isPublic, tracks: [],
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
    playlist.updatedAt = new Date();
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
    }).populate("track").sort({ createdAt: 1 });

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
      sender, receiver,
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
    const query = email ? { email: { $ne: email } } : {};

    const users = await User.find(query)
      .select("name email avatar bio mode verified followers totalTracks")
      .sort({ totalTracks: -1 });

    console.log("getAllUsers called, email param:", email);
    console.log("Users found:", users.length);

    res.json({ users });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const tracks    = await Track.find({ artistEmail: email });
    const totalPlays = tracks.reduce((sum, t) => sum + t.plays, 0);
    const totalLikes = tracks.reduce((sum, t) => sum + t.likes, 0);

    res.json({
      stats: {
        totalTracks: user.totalTracks,
        totalPlays,
        totalLikes,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ message: "Server error" });
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
  updateProfile,
  updateMode,
  uploadTrack,
  getAllSongs,
  getTrackById,
  likeTrack,
  addPlaylists,
  createPlaylist,
  addTrackToPlaylist,
  getMessages,
  getConversations,
  sendMessage,
  sendTuneRequest,
  acceptTune,
  getAllUsers,
  getUserStats,
};