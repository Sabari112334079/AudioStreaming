import { useEffect, useRef, useState } from "react";

const Playlists = ({ mode }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSongs, setAvailableSongs] = useState([]);

  // Playlist modal state
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCover, setNewCover] = useState("");

  // Song modal state
  const [showSongModal, setShowSongModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState("");

  // Player state
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchPlaylists();
    fetchAvailableSongs();
  }, []);

  // When track changes, load and play it
  useEffect(() => {
    if (!activePlaylist) return;
    const track = activePlaylist.tracks[currentTrackIndex];
    if (!track) return;

    if (audioRef.current) {
      audioRef.current.src = `http://localhost:5000/uploads/${track.filename}`;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [currentTrackIndex, activePlaylist]);

  const fetchPlaylists = async () => {
    try {
      const res = await fetch("http://localhost:5000/add-playlists");
      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSongs = async () => {
    try {
      const res = await fetch("http://localhost:5000/songs");
      const data = await res.json();
      setAvailableSongs(data.songs || []);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  const handlePlayPlaylist = (pl) => {
    if (!pl.tracks || pl.tracks.length === 0) return alert("No songs in this playlist!");

    if (activePlaylist?._id === pl._id) {
      // Toggle play/pause same playlist
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // New playlist selected
    setActivePlaylist(pl);
    setCurrentTrackIndex(0);
    setProgress(0);
  };

  const handlePrev = () => {
    if (currentTrackIndex > 0) setCurrentTrackIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (activePlaylist && currentTrackIndex < activePlaylist.tracks.length - 1) {
      setCurrentTrackIndex((i) => i + 1);
    }
  };

  const handleTrackEnd = () => {
    if (activePlaylist && currentTrackIndex < activePlaylist.tracks.length - 1) {
      setCurrentTrackIndex((i) => i + 1);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = val;
    setProgress(val);
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    audioRef.current.volume = val;
    setVolume(val);
  };

  const formatTime = (s) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleCreatePlaylist = async () => {
    if (!newTitle.trim()) return alert("Title is required");
    try {
      const res = await fetch("http://localhost:5000/create-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          coverUrl: newCover || "https://picsum.photos/200",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlaylists([data.playlist, ...playlists]);
        setShowPlaylistModal(false);
        setNewTitle(""); setNewDescription(""); setNewCover("");
      } else alert(data.message || "Failed to create playlist");
    } catch (err) { console.error(err); }
  };

  const handleAddSong = async () => {
    if (!selectedSongId) return alert("Please select a song");
    const selectedSong = availableSongs.find((s) => s._id === selectedSongId);
    if (!selectedSong) return alert("Song not found");

    try {
      const res = await fetch("http://localhost:5000/add-track-to-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId: selectedPlaylist._id, trackId: selectedSongId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlaylists(playlists.map((pl) =>
          pl._id === selectedPlaylist._id
            ? { ...pl, tracks: [...(pl.tracks || []), selectedSong] }
            : pl
        ));
        setShowSongModal(false);
        setSelectedSongId("");
      } else alert(data.message || "Failed to add song");
    } catch (err) { console.error(err); }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading playlists...</p>;

  const songsNotInPlaylist = availableSongs.filter(
    (song) => !selectedPlaylist?.tracks?.some((t) => (t._id || t) === song._id)
  );

  const currentTrack = activePlaylist?.tracks[currentTrackIndex];

  return (
    <div style={styles.container}>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnd}
      />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={styles.heading}>🎧 Playlists</h2>
        {mode === "artist" && (
          <button style={styles.addBtn} onClick={() => setShowPlaylistModal(true)}>➕ Add Playlist</button>
        )}
      </div>

      {/* Playlists Grid */}
      {playlists.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No playlists available 🎵</p>
      ) : (
        <div style={styles.grid}>
          {playlists.map((pl) => {
            const isActive = activePlaylist?._id === pl._id;
            return (
              <div key={pl._id} style={{ ...styles.card, border: isActive ? "2px solid #3b82f6" : "2px solid transparent" }}>
                <div style={{ position: "relative" }}>
                  <img src={pl.coverUrl || "https://picsum.photos/200"} alt={pl.title} style={styles.cover} />
                  {isActive && (
                    <div style={styles.nowPlayingBadge}>▶ Playing</div>
                  )}
                </div>
                <h3 style={styles.title}>{pl.title}</h3>
                <p style={styles.songs}>{pl.tracks?.length || 0} songs</p>
                {pl.tracks?.length > 0 && (
                  <ul style={styles.trackList}>
                    {pl.tracks.map((track, idx) => (
                      <li
                        key={track._id}
                        style={{
                          cursor: "pointer",
                          color: isActive && currentTrackIndex === idx ? "#3b82f6" : "#444",
                          fontWeight: isActive && currentTrackIndex === idx ? "bold" : "normal",
                        }}
                        onClick={() => {
                          setActivePlaylist(pl);
                          setCurrentTrackIndex(idx);
                        }}
                      >
                        {isActive && currentTrackIndex === idx ? "🎵 " : ""}{track.title}
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
                  <button style={styles.playBtn} onClick={() => handlePlayPlaylist(pl)}>
                    {isActive && isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>
                  {mode === "artist" && (
                    <button style={styles.addSongBtn} onClick={() => { setSelectedPlaylist(pl); setSelectedSongId(""); setShowSongModal(true); }}>
                      ➕ Add Song
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Player Bar */}
      {activePlaylist && (
        <div style={styles.playerBar}>
          <div style={styles.playerLeft}>
            <img
              src={activePlaylist.coverUrl || "https://picsum.photos/200"}
              alt="cover"
              style={styles.playerCover}
            />
            <div>
              <p style={styles.playerTitle}>{currentTrack?.title || "Unknown"}</p>
              <p style={styles.playerPlaylist}>{activePlaylist.title}</p>
            </div>
          </div>

          <div style={styles.playerCenter}>
            <div style={styles.playerControls}>
              <button
                style={styles.ctrlBtn}
                onClick={handlePrev}
                disabled={currentTrackIndex === 0}
              >⏮</button>
              <button
                style={styles.playPauseBtn}
                onClick={() => {
                  if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
                  else { audioRef.current.play(); setIsPlaying(true); }
                }}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                style={styles.ctrlBtn}
                onClick={handleNext}
                disabled={currentTrackIndex === activePlaylist.tracks.length - 1}
              >⏭</button>
            </div>
            <div style={styles.progressRow}>
              <span style={styles.timeText}>{formatTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                style={styles.progressBar}
              />
              <span style={styles.timeText}>{formatTime(duration)}</span>
            </div>
          </div>

          <div style={styles.playerRight}>
            <span style={{ fontSize: "16px" }}>🔊</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              style={styles.volumeBar}
            />
            <button style={styles.closeBtn} onClick={() => { audioRef.current.pause(); setActivePlaylist(null); setIsPlaying(false); }}>✕</button>
          </div>
        </div>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Create New Playlist</h3>
            <input style={styles.input} placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <input style={styles.input} placeholder="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            <input style={styles.input} placeholder="Cover URL (optional)" value={newCover} onChange={(e) => setNewCover(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button style={styles.cancelBtn} onClick={() => setShowPlaylistModal(false)}>Cancel</button>
              <button style={styles.submitBtn} onClick={handleCreatePlaylist}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Song Modal */}
      {showSongModal && selectedPlaylist && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Add Song to "{selectedPlaylist.title}"</h3>
            {songsNotInPlaylist.length === 0 ? (
              <p style={{ fontSize: "14px", color: "#666", margin: "10px 0" }}>No available songs. Upload tracks first.</p>
            ) : (
              <select style={styles.select} value={selectedSongId} onChange={(e) => setSelectedSongId(e.target.value)}>
                <option value="">-- Select a track --</option>
                {songsNotInPlaylist.map((song) => (
                  <option key={song._id} value={song._id}>{song.title} ({song.originalName})</option>
                ))}
              </select>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
              <button style={styles.cancelBtn} onClick={() => setShowSongModal(false)}>Cancel</button>
              <button style={{ ...styles.submitBtn, opacity: songsNotInPlaylist.length === 0 ? 0.5 : 1 }} onClick={handleAddSong} disabled={songsNotInPlaylist.length === 0}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "40px 20px", backgroundColor: "#f3f4f6", minHeight: "80vh", paddingBottom: "120px" },
  heading: { color: "#111827" },
  addBtn: { padding: "8px 15px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  addSongBtn: { padding: "5px 10px", backgroundColor: "#f59e0b", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
  card: { backgroundColor: "white", borderRadius: "10px", padding: "15px", textAlign: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", transition: "border 0.2s" },
  cover: { width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px" },
  nowPlayingBadge: { position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(59,130,246,0.9)", color: "white", fontSize: "11px", padding: "2px 8px", borderRadius: "20px", whiteSpace: "nowrap" },
  title: { margin: "10px 0 5px", fontSize: "16px", color: "#111827" },
  songs: { margin: "0 0 5px", fontSize: "14px", color: "#666" },
  trackList: { textAlign: "left", paddingLeft: "15px", fontSize: "13px", color: "#444", maxHeight: "100px", overflowY: "auto" },
  playBtn: { padding: "8px 15px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  // Sticky Player
  playerBar: { position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#1e1e2e", color: "white", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -4px 20px rgba(0,0,0,0.3)", zIndex: 1000 },
  playerLeft: { display: "flex", alignItems: "center", gap: "12px", minWidth: "200px" },
  playerCover: { width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" },
  playerTitle: { margin: 0, fontSize: "14px", fontWeight: "bold" },
  playerPlaylist: { margin: 0, fontSize: "12px", color: "#aaa" },
  playerCenter: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1, maxWidth: "500px" },
  playerControls: { display: "flex", alignItems: "center", gap: "16px" },
  ctrlBtn: { background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer", opacity: 0.8 },
  playPauseBtn: { background: "white", border: "none", color: "#1e1e2e", fontSize: "20px", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  progressRow: { display: "flex", alignItems: "center", gap: "8px", width: "100%" },
  progressBar: { flex: 1, accentColor: "#3b82f6" },
  timeText: { fontSize: "11px", color: "#aaa", minWidth: "32px" },
  playerRight: { display: "flex", alignItems: "center", gap: "8px", minWidth: "160px", justifyContent: "flex-end" },
  volumeBar: { width: "80px", accentColor: "#3b82f6" },
  closeBtn: { background: "none", border: "none", color: "#aaa", fontSize: "16px", cursor: "pointer", marginLeft: "8px" },
  // Modals
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1001 },
  modal: { backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "320px" },
  input: { width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box" },
  select: { width: "100%", padding: "8px", margin: "5px 0", borderRadius: "5px", border: "1px solid #ccc", boxSizing: "border-box", fontSize: "14px" },
  cancelBtn: { padding: "8px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  submitBtn: { padding: "8px 12px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default Playlists;