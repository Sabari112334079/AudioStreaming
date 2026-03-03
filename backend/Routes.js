const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  getCurrentUser,
   
  register,
  createPlaylist,
  getProfile,
  updateMode,
  uploadTrack,
  getAllSongs,
  addPlaylists,
  addTrackToPlaylist,
  getMessages,
  getConversations,
  sendMessage,
  sendTuneRequest,
  acceptTune,
  getAllUsers
} = require("./Controllers");

// Auth routes (public)
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/current-user", getCurrentUser);

// Protected routes - require authentication
router.post("/profile",   getProfile);
router.post("/update-mode",   updateMode);

// Track routes
router.post("/upload-track",   uploadTrack);
router.get("/songs", getAllSongs);

// Playlist routes
router.get("/add-playlists", addPlaylists);
router.post("/create-playlist",   createPlaylist);
router.post("/add-track-to-playlist",   addTrackToPlaylist);

// Message routes
router.get("/messages",   getMessages);
router.get("/conversations",   getConversations);
router.get("/users",   getAllUsers);
router.post("/messages/send",   sendMessage);
router.post("/messages/tune-request",   sendTuneRequest);
router.post("/messages/accept-tune",   acceptTune);

module.exports = router;