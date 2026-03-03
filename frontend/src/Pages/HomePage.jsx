import { useEffect, useState } from "react";

const HomePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState(null);
  const [filter, setFilter] = useState({ genre: "all", search: "" });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, [filter]);

  const fetchSongs = async () => {
  try {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (filter.genre !== "all") queryParams.append("genre", filter.genre);
    if (filter.search) queryParams.append("search", filter.search);
    
    const res = await fetch(`http://localhost:5000/songs?${queryParams}`);
    const data = await res.json();
    
    // ✅ Fixed: Check if data.songs exists and is an array
    const songsArray = Array.isArray(data.songs) ? data.songs : [];
    setSongs(songsArray);
    
    // Extract unique genres safely
    const uniqueGenres = [...new Set(songsArray.map(s => s.genre))].filter(Boolean);
    setGenres(["all", ...uniqueGenres]);
  } catch (err) {
    console.error("Error fetching songs:", err);
    setSongs([]); // ✅ Set empty array on error
    setGenres(["all"]);
  } finally {
    setLoading(false);
  }
};

  const handlePlay = (songId) => {
    setPlayingSongId(songId);
  };

  const handlePause = () => {
    setPlayingSongId(null);
  };

  const handleLike = async (trackId) => {
    try {
      const res = await fetch("http://localhost:5000/tracks/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ trackId })
      });
      
      if (res.ok) {
        // Update local state
        setSongs(songs.map(song => 
          song._id === trackId 
            ? { ...song, likes: (song.likes || 0) + 1 }
            : song
        ));
      }
    } catch (err) {
      console.error("Error liking track:", err);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your music...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          <span style={styles.heroIcon}>🎧</span>
          Discover Latest Tracks
        </h1>
        <p style={styles.heroSubtitle}>
          Explore {songs.length} amazing {songs.length === 1 ? 'track' : 'tracks'} from our community
        </p>

        {/* Filters */}
        <div style={styles.filterBar}>
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search tracks, artists..."
            style={styles.searchInput}
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />

          {/* Genre Filter */}
          <select
            style={styles.genreSelect}
            value={filter.genre}
            onChange={(e) => setFilter({ ...filter, genre: e.target.value })}
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre === "all" ? "All Genres" : genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State */}
      {!songs.length && !loading && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎵</div>
          <h2 style={styles.emptyTitle}>No Tracks Found</h2>
          <p style={styles.emptyText}>
            {filter.search || filter.genre !== "all" 
              ? "Try adjusting your filters" 
              : "Be the first to share some music!"}
          </p>
        </div>
      )}

      {/* Songs Grid */}
      {songs.length > 0 && (
        <div style={styles.grid}>
          {songs.map((song, index) => (
            <div 
              key={song._id} 
              style={{
                ...styles.card,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Album Art */}
              <div 
                style={{
                  ...styles.albumArt,
                  backgroundImage: song.coverArt ? `url(${song.coverArt})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!song.coverArt && (
                  <div style={styles.albumIcon}>
                    {playingSongId === song._id ? "🎵" : "🎼"}
                  </div>
                )}
                {playingSongId === song._id && (
                  <div style={styles.playingIndicator}>
                    <span style={styles.bar}></span>
                    <span style={styles.bar}></span>
                    <span style={styles.bar}></span>
                  </div>
                )}
              </div>

              {/* Song Info */}
              <div style={styles.songInfo}>
                <div style={styles.songHeader}>
                  <h3 style={styles.songTitle}>{song.title}</h3>
                  {song.genre && (
                    <span style={styles.genreBadge}>{song.genre}</span>
                  )}
                </div>

                <p style={styles.artistName}>
                  <span style={styles.artistIcon}>🎤</span>
                  {song.artist || "Unknown Artist"}
                </p>

                {song.description && (
                  <p style={styles.songDescription}>{song.description}</p>
                )}

                {/* Stats Row */}
                <div style={styles.statsRow}>
                  <span style={styles.stat}>
                    <span style={styles.statIcon}>▶️</span>
                    {song.plays || 0} plays
                  </span>
                  <span style={styles.stat}>
                    <span style={styles.statIcon}>❤️</span>
                    {song.likes || 0} likes
                  </span>
                </div>

                {/* Tags */}
                {song.tags && song.tags.length > 0 && (
                  <div style={styles.tagsContainer}>
                    {song.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} style={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                )}

                <p style={styles.uploadDate}>
                  <span style={styles.dateIcon}>📅</span>
                  {new Date(song.uploadedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Actions */}
              <div style={styles.actionsBar}>
                <button 
                  style={styles.likeButton}
                  onClick={() => handleLike(song._id)}
                >
                  ❤️ Like
                </button>
                <span style={styles.fileSize}>
                  {song.fileSize ? `${(song.fileSize / (1024 * 1024)).toFixed(1)} MB` : ''}
                </span>
              </div>

              {/* Audio Player */}
              <div style={styles.playerWrapper}>
                <audio 
                  controls 
                  style={styles.audioPlayer}
                  onPlay={() => handlePlay(song._id)}
                  onPause={handlePause}
                >
                  <source 
                    src={`http://localhost:5000/uploads/${song.filename}`} 
                    type="audio/mpeg" 
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "0",
  },
  
  // Hero Section
  hero: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "60px 20px 40px 20px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "white",
    margin: "0 0 15px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  heroIcon: {
    fontSize: "52px",
    animation: "bounce 2s infinite",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.9)",
    margin: "0 0 30px 0",
    fontWeight: "400",
  },

  // Filter Bar
  filterBar: {
    display: "flex",
    gap: "15px",
    maxWidth: "600px",
    margin: "0 auto",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  searchInput: {
    flex: "1",
    minWidth: "250px",
    padding: "12px 20px",
    borderRadius: "25px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.9)",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s",
  },
  genreSelect: {
    padding: "12px 20px",
    borderRadius: "25px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    background: "rgba(255, 255, 255, 0.9)",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    minWidth: "150px",
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px",
    padding: "40px 20px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // Card
  card: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "0",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease",
    overflow: "hidden",
    animation: "fadeInUp 0.6s ease forwards",
    opacity: 0,
  },

  // Album Art
  albumArt: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    height: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  albumIcon: {
    fontSize: "80px",
    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
  },

  // Playing Indicator
  playingIndicator: {
    position: "absolute",
    bottom: "15px",
    right: "15px",
    display: "flex",
    gap: "4px",
    alignItems: "flex-end",
    height: "30px",
  },
  bar: {
    width: "4px",
    background: "white",
    borderRadius: "2px",
    animation: "wave 1s ease-in-out infinite",
  },

  // Song Info
  songInfo: {
    padding: "20px",
  },
  songHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "8px",
  },
  songTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0",
    flex: "1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  genreBadge: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    flexShrink: 0,
  },
  artistName: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 8px 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "500",
  },
  artistIcon: {
    fontSize: "14px",
  },
  songDescription: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 12px 0",
    lineHeight: "1.5",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  // Stats Row
  statsRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "10px",
  },
  stat: {
    fontSize: "12px",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  statIcon: {
    fontSize: "12px",
  },

  // Tags
  tagsContainer: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  tag: {
    background: "#f3f4f6",
    color: "#6b7280",
    padding: "3px 10px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: "500",
  },

  uploadDate: {
    fontSize: "12px",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    margin: 0,
  },
  dateIcon: {
    fontSize: "12px",
  },

  // Actions Bar
  actionsBar: {
    padding: "0 20px 15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likeButton: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    border: "none",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  fileSize: {
    fontSize: "11px",
    color: "#9ca3af",
  },

  // Player
  playerWrapper: {
    padding: "0 20px 20px 20px",
  },
  audioPlayer: {
    width: "100%",
    height: "40px",
    borderRadius: "10px",
    outline: "none",
  },

  // Loading State
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid rgba(255, 255, 255, 0.3)",
    borderTop: "6px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "white",
    fontSize: "18px",
    marginTop: "20px",
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "40px 20px",
  },
  emptyIcon: {
    fontSize: "120px",
    marginBottom: "20px",
    animation: "float 3s ease-in-out infinite",
  },
  emptyTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "white",
    margin: "0 0 15px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  },
  emptyText: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes wave {
    0%, 100% { height: 10px; }
    50% { height: 30px; }
  }

  .bar:nth-child(1) { animation-delay: 0s; }
  .bar:nth-child(2) { animation-delay: 0.2s; }
  .bar:nth-child(3) { animation-delay: 0.4s; }

  div[style*="card"]:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3) !important;
  }

  button[style*="likeButton"]:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
  }

  input[style*="searchInput"]:focus,
  select[style*="genreSelect"]:focus {
    border-color: rgba(255, 255, 255, 0.8);
    background: white;
  }
`;
document.head.appendChild(styleSheet);

export default HomePage;