import { useEffect, useRef, useState } from "react";

const API = "http://localhost:5000";

const Playlists = ({ mode, currentUserEmail }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [error, setError] = useState("");

  // Playlist modal state
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCover, setNewCover] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedTrackIds, setSelectedTrackIds] = useState([]); // ✅ NEW: tracks to add on create
  const [trackSearch, setTrackSearch] = useState("");            // ✅ NEW: search within modal

  // Song modal state
  const [showSongModal, setShowSongModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState("");
  const [addingSong, setAddingSong] = useState(false);

  // Player state
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  const isArtist = mode?.toLowerCase() === "artist";

  useEffect(() => {
    fetchPlaylists();
    fetchAvailableSongs();
  }, []);

  useEffect(() => {
    if (!activePlaylist) return;
    const track = activePlaylist.tracks[currentTrackIndex];
    if (!track || !audioRef.current) return;
    audioRef.current.src = `${API}/uploads/${track.filename}`;
    audioRef.current.load();
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => { console.error("Playback error:", err); setIsPlaying(false); });
  }, [currentTrackIndex, activePlaylist]);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/add-playlists`, { credentials: "include" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      console.error("Fetch playlists error:", err);
      setError("Failed to load playlists. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSongs = async () => {
    try {
      const res = await fetch(`${API}/songs`, { credentials: "include" });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setAvailableSongs(data.songs || []);
    } catch (err) {
      console.error("Fetch songs error:", err);
    }
  };

  // ── Player handlers ──────────────────────────────────────────────
  const handlePlayPlaylist = (pl) => {
    if (!pl.tracks || pl.tracks.length === 0) return alert("No songs in this playlist yet!");
    if (activePlaylist?._id === pl._id) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error); }
      return;
    }
    setActivePlaylist(pl);
    setCurrentTrackIndex(0);
    setProgress(0);
    setDuration(0);
  };

  const handlePrev = () => { if (currentTrackIndex > 0) setCurrentTrackIndex((i) => i - 1); };
  const handleNext = () => {
    if (activePlaylist && currentTrackIndex < activePlaylist.tracks.length - 1)
      setCurrentTrackIndex((i) => i + 1);
  };
  const handleTrackEnd = () => {
    if (activePlaylist && currentTrackIndex < activePlaylist.tracks.length - 1)
      setCurrentTrackIndex((i) => i + 1);
    else { setIsPlaying(false); setProgress(0); }
  };
  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setProgress(val);
  };
  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.volume = val;
    setVolume(val);
  };
  const closePlayer = () => {
    if (audioRef.current) audioRef.current.pause();
    setActivePlaylist(null); setIsPlaying(false); setProgress(0); setDuration(0);
  };
  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  // ── Toggle a track in the create-modal checkbox list ────────────
  const toggleTrackSelection = (id) => {
    setSelectedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // ── Create playlist, then add selected tracks one by one ─────────
  const handleCreatePlaylist = async () => {
    if (!newTitle.trim()) return alert("Title is required");
    setCreating(true);
    try {
      // 1. Create the playlist
      const res = await fetch(`${API}/create-playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          coverUrl: newCover.trim() || `https://picsum.photos/seed/${Date.now()}/400/400`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) alert("You must be logged in to create playlists.");
        else alert(data.message || "Failed to create playlist");
        return;
      }

      let createdPlaylist = data.playlist;

      // 2. Add each selected track sequentially
      for (const trackId of selectedTrackIds) {
        const addRes = await fetch(`${API}/add-track-to-playlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ playlistId: createdPlaylist._id, trackId }),
        });
        if (addRes.ok) {
          const addData = await addRes.json();
          createdPlaylist = addData.playlist; // keep latest populated version
        }
      }

      setPlaylists((prev) => [createdPlaylist, ...prev]);
      setShowPlaylistModal(false);
      setNewTitle(""); setNewDescription(""); setNewCover("");
      setSelectedTrackIds([]); setTrackSearch("");
    } catch (err) {
      console.error("Create playlist error:", err);
      alert("Server error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleAddSong = async () => {
    if (!selectedSongId) return alert("Please select a song");
    setAddingSong(true);
    try {
      const res = await fetch(`${API}/add-track-to-playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ playlistId: selectedPlaylist._id, trackId: selectedSongId }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlaylists((prev) =>
          prev.map((pl) => (pl._id === selectedPlaylist._id ? data.playlist : pl))
        );
        if (activePlaylist?._id === selectedPlaylist._id) setActivePlaylist(data.playlist);
        setShowSongModal(false);
        setSelectedSongId("");
      } else if (res.status === 401) {
        alert("You must be logged in to add songs.");
      } else {
        alert(data.message || "Failed to add song");
      }
    } catch (err) {
      console.error("Add song error:", err);
      alert("Server error. Please try again.");
    } finally {
      setAddingSong(false);
    }
  };

  const closeCreateModal = () => {
    setShowPlaylistModal(false);
    setNewTitle(""); setNewDescription(""); setNewCover("");
    setSelectedTrackIds([]); setTrackSearch("");
  };

  const songsNotInPlaylist = availableSongs.filter(
    (song) => !selectedPlaylist?.tracks?.some((t) => (t._id ?? t) === song._id)
  );
  const currentTrack = activePlaylist?.tracks[currentTrackIndex];

  // Filtered tracks for the create modal search box
  const filteredSongsForModal = availableSongs.filter((s) =>
    s.title.toLowerCase().includes(trackSearch.toLowerCase()) ||
    (s.artist || "").toLowerCase().includes(trackSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinnerWrap}>
          <div style={styles.spinner} />
          <p style={{ color: "#6b7280", marginTop: "12px" }}>Loading playlists…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleTrackEnd}
      />

      {/* Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.heading}>🎧 Playlists</h2>
        {isArtist && (
          // In the header - always show button
<button style={styles.addBtn} onClick={() => {
  if (!isArtist) return alert("Only artists can create playlists. Switch to Artist mode.");
  setShowPlaylistModal(true);
}}>
  ➕ New Playlist
</button>
        )}
      </div>

      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
          <button style={styles.retryBtn} onClick={fetchPlaylists}>Retry</button>
        </div>
      )}

      {playlists.length === 0 && !error ? (
        <div style={styles.emptyState}>
          <span style={{ fontSize: "48px" }}>🎵</span>
          <p style={{ color: "#6b7280", marginTop: "12px" }}>
            {isArtist ? "No playlists yet. Create your first one!" : "No playlists available yet."}
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {playlists.map((pl) => {
            const isActive = activePlaylist?._id === pl._id;
            return (
              <div key={pl._id} style={{ ...styles.card, ...(isActive ? styles.cardActive : {}) }}>
                <div style={{ position: "relative" }}>
                  <img
                    src={pl.coverUrl || "https://picsum.photos/400/400"}
                    alt={pl.title}
                    style={styles.cover}
                    onError={(e) => { e.target.src = "https://picsum.photos/400/400"; }}
                  />
                  {isActive && <div style={styles.nowPlayingBadge}>▶ Now Playing</div>}
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.cardTitle}>{pl.title}</h3>
                  {pl.description && <p style={styles.cardDesc}>{pl.description}</p>}
                  <p style={styles.songCount}>{pl.tracks?.length || 0} songs</p>
                  {pl.tracks?.length > 0 && (
                    <ul style={styles.trackList}>
                      {pl.tracks.map((track, idx) => {
                        const isCurrent = isActive && currentTrackIndex === idx;
                        return (
                          <li
                            key={track._id}
                            style={{ ...styles.trackItem, color: isCurrent ? "#3b82f6" : "#4b5563", fontWeight: isCurrent ? 700 : 400 }}
                            onClick={() => { setActivePlaylist(pl); setCurrentTrackIndex(idx); }}
                            title={track.title}
                          >
                            {isCurrent && isPlaying ? "🎵 " : ""}{track.title}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <div style={styles.cardActions}>
                    <button style={styles.playBtn} onClick={() => handlePlayPlaylist(pl)}>
                      {isActive && isPlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                    {isArtist  && (
                      <button
                        style={styles.addSongBtn}
                        onClick={() => { setSelectedPlaylist(pl); setSelectedSongId(""); setShowSongModal(true); }}
                      >
                        ➕ Song
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Sticky Player Bar ─────────────────────────────────── */}
      {activePlaylist && (
        <div style={styles.playerBar}>
          <div style={styles.playerLeft}>
            <img
              src={activePlaylist.coverUrl || "https://picsum.photos/48/48"}
              alt="cover"
              style={styles.playerCover}
              onError={(e) => { e.target.src = "https://picsum.photos/48/48"; }}
            />
            <div style={{ overflow: "hidden" }}>
              <p style={styles.playerTitle}>{currentTrack?.title || "Unknown Track"}</p>
              <p style={styles.playerPlaylist}>{activePlaylist.title}</p>
            </div>
          </div>
          <div style={styles.playerCenter}>
            <div style={styles.playerControls}>
              <button style={styles.ctrlBtn} onClick={handlePrev} disabled={currentTrackIndex === 0}>⏮</button>
              <button
                style={styles.playPauseBtn}
                onClick={() => {
                  if (!audioRef.current) return;
                  if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
                  else { audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error); }
                }}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button style={styles.ctrlBtn} onClick={handleNext} disabled={currentTrackIndex === activePlaylist.tracks.length - 1}>⏭</button>
            </div>
            <div style={styles.progressRow}>
              <span style={styles.timeText}>{formatTime(progress)}</span>
              <input type="range" min={0} max={duration || 0} value={progress} onChange={handleSeek} style={styles.progressBar} />
              <span style={styles.timeText}>{formatTime(duration)}</span>
            </div>
          </div>
          <div style={styles.playerRight}>
            <span style={{ fontSize: "14px" }}>🔊</span>
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolume} style={styles.volumeBar} />
            <button style={styles.closeBtn} onClick={closePlayer}>✕</button>
          </div>
        </div>
      )}

      {/* ── Create Playlist Modal ─────────────────────────────── */}
      {showPlaylistModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* Modal header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🎶 Create New Playlist</h3>
              <button style={styles.modalCloseX} onClick={closeCreateModal}>✕</button>
            </div>

            {/* Details section */}
            <div style={styles.modalSection}>
              <p style={styles.sectionLabel}>DETAILS</p>
              <input
                style={styles.input}
                placeholder="Playlist Title *"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={80}
                autoFocus
              />
              <input
                style={styles.input}
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                maxLength={200}
              />
              <div style={styles.coverRow}>
                <input
                  style={{ ...styles.input, flex: 1, margin: 0 }}
                  placeholder="Cover image URL (optional)"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                />
                {newCover ? (
                  <img
                    src={newCover}
                    alt="preview"
                    style={styles.coverThumb}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={styles.coverPlaceholder}>🖼️</div>
                )}
              </div>
            </div>

            {/* Track picker section */}
            <div style={styles.modalSection}>
              <div style={styles.sectionHeaderRow}>
                <p style={styles.sectionLabel}>ADD TRACKS</p>
                {selectedTrackIds.length > 0 && (
                  <span style={styles.selectedBadge}>{selectedTrackIds.length} selected</span>
                )}
              </div>

              {availableSongs.length === 0 ? (
                <p style={styles.emptyMsg}>No uploaded tracks found. Upload some tracks first.</p>
              ) : (
                <>
                  {/* Search box */}
                  <div style={styles.searchWrap}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                      style={styles.searchInput}
                      placeholder="Search tracks…"
                      value={trackSearch}
                      onChange={(e) => setTrackSearch(e.target.value)}
                    />
                    {trackSearch && (
                      <button style={styles.clearSearch} onClick={() => setTrackSearch("")}>✕</button>
                    )}
                  </div>

                  {/* Select / deselect all */}
                  <div style={styles.selectAllRow}>
                    <button
                      style={styles.selectAllBtn}
                      onClick={() => setSelectedTrackIds(filteredSongsForModal.map((s) => s._id))}
                    >
                      Select all
                    </button>
                    {selectedTrackIds.length > 0 && (
                      <button style={styles.clearAllBtn} onClick={() => setSelectedTrackIds([])}>
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Scrollable track list */}
                  <div style={styles.trackPickerList}>
                    {filteredSongsForModal.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "#9ca3af", padding: "12px", textAlign: "center" }}>
                        No tracks match your search.
                      </p>
                    ) : (
                      filteredSongsForModal.map((song) => {
                        const checked = selectedTrackIds.includes(song._id);
                        return (
                          <div
                            key={song._id}
                            style={{ ...styles.trackPickerRow, ...(checked ? styles.trackPickerRowActive : {}) }}
                            onClick={() => toggleTrackSelection(song._id)}
                          >
                            {/* Custom checkbox */}
                            <div style={{ ...styles.checkbox, ...(checked ? styles.checkboxChecked : {}) }}>
                              {checked && <span style={styles.checkmark}>✓</span>}
                            </div>
                            <div style={styles.trackInfo}>
                              <span style={styles.trackPickerTitle}>{song.title}</span>
                              <span style={styles.trackPickerMeta}>
                                {song.artist || "Unknown"}{song.genre ? ` · ${song.genre}` : ""}
                              </span>
                            </div>
                            <span style={styles.trackPickerExt}>
                              {song.originalName?.split(".").pop()?.toUpperCase() || "MP3"}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer actions */}
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={closeCreateModal} disabled={creating}>
                Cancel
              </button>
              <button
                style={{ ...styles.submitBtn, opacity: creating ? 0.7 : 1 }}
                onClick={handleCreatePlaylist}
                disabled={creating}
              >
                {creating
                  ? "Creating…"
                  : selectedTrackIds.length > 0
                  ? `Create with ${selectedTrackIds.length} track${selectedTrackIds.length > 1 ? "s" : ""}`
                  : "Create Playlist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Song to existing playlist Modal ──────────────── */}
      {showSongModal && selectedPlaylist && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>🎵 Add to "{selectedPlaylist.title}"</h3>
            {songsNotInPlaylist.length === 0 ? (
              <p style={styles.emptyMsg}>All available songs are already in this playlist.</p>
            ) : (
              <select style={styles.select} value={selectedSongId} onChange={(e) => setSelectedSongId(e.target.value)}>
                <option value="">— Select a track —</option>
                {songsNotInPlaylist.map((song) => (
                  <option key={song._id} value={song._id}>{song.title} · {song.artist || "Unknown"}</option>
                ))}
              </select>
            )}
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowSongModal(false)} disabled={addingSong}>Cancel</button>
              <button
                style={{ ...styles.submitBtn, opacity: (addingSong || !selectedSongId) ? 0.6 : 1 }}
                onClick={handleAddSong}
                disabled={addingSong || !selectedSongId || songsNotInPlaylist.length === 0}
              >
                {addingSong ? "Adding…" : "Add Song"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────
const styles = {
  container: { padding: "32px 20px", backgroundColor: "#f3f4f6", minHeight: "100vh", paddingBottom: "100px" },
  centered: { display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" },
  spinnerWrap: { display: "flex", flexDirection: "column", alignItems: "center" },
  spinner: { width: "36px", height: "36px", border: "4px solid #e5e7eb", borderTopColor: "#3b82f6", borderRadius: "50%" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  heading: { margin: 0, fontSize: "22px", fontWeight: 700, color: "#111827" },
  addBtn: { padding: "8px 16px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px" },
  errorBanner: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", fontSize: "14px" },
  retryBtn: { marginLeft: "auto", padding: "4px 12px", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "60px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
  card: { backgroundColor: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "2px solid transparent", transition: "border 0.2s" },
  cardActive: { border: "2px solid #3b82f6", boxShadow: "0 4px 20px rgba(59,130,246,0.2)" },
  cover: { width: "100%", height: "160px", objectFit: "cover", display: "block" },
  nowPlayingBadge: { position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(59,130,246,0.92)", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap", fontWeight: 600 },
  cardBody: { padding: "14px" },
  cardTitle: { margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardDesc: { margin: "0 0 6px", fontSize: "12px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  songCount: { margin: "0 0 8px", fontSize: "12px", color: "#9ca3af" },
  trackList: { listStyle: "none", padding: 0, margin: "0 0 10px", maxHeight: "90px", overflowY: "auto" },
  trackItem: { padding: "3px 0", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardActions: { display: "flex", gap: "8px" },
  playBtn: { flex: 1, padding: "7px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "7px", cursor: "pointer", fontWeight: 600, fontSize: "13px" },
  addSongBtn: { padding: "7px 10px", backgroundColor: "#f59e0b", color: "white", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "13px", fontWeight: 600 },
  // Player
  playerBar: { position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#111827", color: "white", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 -4px 24px rgba(0,0,0,0.4)", zIndex: 1000 },
  playerLeft: { display: "flex", alignItems: "center", gap: "12px", minWidth: "200px", overflow: "hidden" },
  playerCover: { width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 },
  playerTitle: { margin: 0, fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" },
  playerPlaylist: { margin: "2px 0 0", fontSize: "11px", color: "#9ca3af" },
  playerCenter: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: 1, maxWidth: "480px" },
  playerControls: { display: "flex", alignItems: "center", gap: "20px" },
  ctrlBtn: { background: "none", border: "none", color: "white", fontSize: "18px", cursor: "pointer", opacity: 0.8, padding: 0 },
  playPauseBtn: { background: "white", border: "none", color: "#111827", fontSize: "18px", width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  progressRow: { display: "flex", alignItems: "center", gap: "8px", width: "100%" },
  progressBar: { flex: 1, accentColor: "#3b82f6" },
  timeText: { fontSize: "10px", color: "#9ca3af", minWidth: "30px" },
  playerRight: { display: "flex", alignItems: "center", gap: "8px", minWidth: "150px", justifyContent: "flex-end" },
  volumeBar: { width: "72px", accentColor: "#3b82f6" },
  closeBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: "16px", cursor: "pointer", marginLeft: "4px" },
  // Modal shared
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1010 },
  modal: { backgroundColor: "white", borderRadius: "14px", width: "420px", maxWidth: "95vw", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 0" },
  modalTitle: { margin: 0, fontSize: "17px", fontWeight: 700, color: "#111827" },
  modalCloseX: { background: "none", border: "none", fontSize: "18px", color: "#9ca3af", cursor: "pointer", lineHeight: 1 },
  modalSection: { padding: "16px 24px", borderBottom: "1px solid #f3f4f6" },
  sectionHeaderRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" },
  sectionLabel: { margin: "0 0 8px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" },
  selectedBadge: { fontSize: "11px", fontWeight: 700, backgroundColor: "#eff6ff", color: "#3b82f6", padding: "2px 8px", borderRadius: "99px" },
  coverRow: { display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" },
  coverThumb: { width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", flexShrink: 0, border: "1px solid #e5e7eb" },
  coverPlaceholder: { width: "44px", height: "44px", borderRadius: "8px", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  searchWrap: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "7px 10px", marginBottom: "8px" },
  searchIcon: { fontSize: "13px", flexShrink: 0 },
  searchInput: { flex: 1, border: "none", background: "none", fontSize: "13px", outline: "none", color: "#111827" },
  clearSearch: { background: "none", border: "none", color: "#9ca3af", fontSize: "13px", cursor: "pointer", padding: 0 },
  selectAllRow: { display: "flex", gap: "8px", marginBottom: "8px" },
  selectAllBtn: { fontSize: "12px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 },
  clearAllBtn: { fontSize: "12px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 },
  trackPickerList: { maxHeight: "220px", overflowY: "auto", borderRadius: "8px", border: "1px solid #e5e7eb" },
  trackPickerRow: { display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", cursor: "pointer", transition: "background 0.15s", borderBottom: "1px solid #f3f4f6" },
  trackPickerRowActive: { backgroundColor: "#eff6ff" },
  checkbox: { width: "18px", height: "18px", borderRadius: "5px", border: "2px solid #d1d5db", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" },
  checkboxChecked: { backgroundColor: "#3b82f6", borderColor: "#3b82f6" },
  checkmark: { color: "white", fontSize: "11px", fontWeight: 700, lineHeight: 1 },
  trackInfo: { flex: 1, overflow: "hidden" },
  trackPickerTitle: { display: "block", fontSize: "13px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  trackPickerMeta: { display: "block", fontSize: "11px", color: "#9ca3af", marginTop: "1px" },
  trackPickerExt: { fontSize: "10px", color: "#d1d5db", fontWeight: 700, flexShrink: 0 },
  // Form inputs
  input: { width: "100%", padding: "9px 12px", margin: "5px 0", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", color: "#111827" },
  select: { width: "100%", padding: "9px 12px", margin: "5px 0", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", color: "#111827" },
  emptyMsg: { fontSize: "13px", color: "#6b7280", margin: "8px 0 4px" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px" },
  cancelBtn: { padding: "8px 16px", backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", cursor: "pointer", fontWeight: 500 },
  submitBtn: { padding: "8px 18px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 },
};

export default Playlists;