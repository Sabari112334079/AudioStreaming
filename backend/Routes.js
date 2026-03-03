const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  getCurrentUser,
  requireAuth,
  register,
  createPlaylist,
  getProfile,
  updateProfile,
  updateMode,
  uploadTrack,
  getAllSongs,
  getTrackById,
  likeTrack,
  addPlaylists,
  addTrackToPlaylist,
  getMessages,
  getConversations,
  sendMessage,
  sendTuneRequest,
  acceptTune,
  getAllUsers,
  getUserStats
} = require("./Controllers");

// ========== Auth routes (public) ==========
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/current-user", getCurrentUser);

// ========== User routes ==========
router.post("/profile", getProfile);
router.put("/profile", requireAuth, updateProfile);
router.post("/update-mode", requireAuth, updateMode);
router.get("/user-stats", getUserStats);
router.get("/users", requireAuth, getAllUsers);

// ========== Track routes ==========
router.post("/upload-track", requireAuth, ...uploadTrack);
router.get("/songs", getAllSongs);
router.get("/tracks/:id", getTrackById);
router.post("/tracks/like", requireAuth, likeTrack);

// ========== Playlist routes ==========
router.get("/add-playlists", addPlaylists);
router.post("/create-playlist", requireAuth, createPlaylist);
router.post("/add-track-to-playlist", requireAuth, addTrackToPlaylist);

// ========== Message routes ==========
router.get("/messages", requireAuth, getMessages);
router.get("/conversations", requireAuth, getConversations);
router.post("/messages/send", requireAuth, sendMessage);
router.post("/messages/tune-request", requireAuth, sendTuneRequest);
router.post("/messages/accept-tune", requireAuth, acceptTune);

module.exports = router;