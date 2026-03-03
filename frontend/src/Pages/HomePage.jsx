import { useEffect, useState } from "react";

const HomePage = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("http://localhost:5000/songs");
        const data = await res.json();
        setSongs(data.songs || []);
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (songId) => {
    setPlayingSongId(songId);
  };

  const handlePause = () => {
    setPlayingSongId(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your music...</p>
      </div>
    );
  }

  if (!songs.length) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>🎵</div>
        <h2 style={styles.emptyTitle}>No Tracks Yet</h2>
        <p style={styles.emptyText}>Be the first to share some music!</p>
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
      </div>

      {/* Songs Grid */}
      <div style={styles.grid}>
        {songs.map((song, index) => (
          <div 
            key={song._id} 
            style={{
              ...styles.card,
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Album Art Placeholder */}
            <div style={styles.albumArt}>
              <div style={styles.albumIcon}>
                {playingSongId === song._id ? "🎵" : "🎼"}
              </div>
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
              <h3 style={styles.songTitle}>{song.title}</h3>
              {song.description && (
                <p style={styles.songDescription}>{song.description}</p>
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
    padding: "60px 20px",
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
    margin: 0,
    fontWeight: "400",
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
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)",
    }
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
  songTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 10px 0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  songDescription: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 12px 0",
    lineHeight: "1.5",
  },
  uploadDate: {
    fontSize: "13px",
    color: "#9ca3af",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    margin: 0,
  },
  dateIcon: {
    fontSize: "14px",
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
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
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
`;
document.head.appendChild(styleSheet);

export default HomePage;