import React, { useEffect, useState, useRef } from "react";

export default function HomePage() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/songs");
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        setSongs(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Update time
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [currentSong]);

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const playNext = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1]);
    }
  };

  const playPrevious = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1]);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>⚠️ Connection Error</h2>
          <p>{error}</p>
          <p style={styles.errorHint}>
            Make sure your backend server is running on port 3001
          </p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Main Content */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.title}>Your Library</h1>
          <div style={styles.headerStats}>
            <span style={styles.trackCount}>{songs.length} songs</span>
          </div>
        </header>

        {songs.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🎵</div>
            <h2 style={styles.emptyTitle}>Your library is empty</h2>
            <p style={styles.emptyText}>Upload your first track to get started</p>
          </div>
        ) : (
          <>
            {/* Featured/Now Playing Section */}
            {currentSong && (
              <div style={styles.featuredSection}>
                <div style={styles.featuredCard}>
                  <div style={styles.featuredCover}>
                    {currentSong.cover ? (
                      <img src={currentSong.cover} alt={currentSong.title} style={styles.featuredImage} />
                    ) : (
                      <div style={styles.featuredPlaceholder}>🎵</div>
                    )}
                  </div>
                  <div style={styles.featuredInfo}>
                    <span style={styles.featuredLabel}>NOW PLAYING</span>
                    <h2 style={styles.featuredTitle}>{currentSong.title}</h2>
                    <p style={styles.featuredArtist}>{currentSong.artist}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Songs Grid */}
            <div style={styles.songsSection}>
              <h2 style={styles.sectionTitle}>All Songs</h2>
              <div style={styles.songList}>
                {songs.map((song, index) => (
                  <div 
                    key={song.id} 
                    style={{
                      ...styles.songCard,
                      ...(currentSong?.id === song.id ? styles.activeCard : {})
                    }}
                    onClick={() => playSong(song)}
                  >
                    <div style={styles.songCardInner}>
                      <div style={styles.coverContainer}>
                        {song.cover ? (
                          <img 
                            src={song.cover} 
                            alt={song.title}
                            style={styles.songCover}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div style={{
                          ...styles.coverPlaceholder,
                          display: song.cover ? 'none' : 'flex'
                        }}>
                          🎵
                        </div>
                        
                        {/* Play Button Overlay */}
                        <div style={styles.playOverlay}>
                          <div style={styles.playButton}>
                            {currentSong?.id === song.id && isPlaying ? (
                              <span style={styles.playIcon}>⏸</span>
                            ) : (
                              <span style={styles.playIcon}>▶</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div style={styles.songDetails}>
                        <p style={styles.songTitle}>{song.title}</p>
                        <p style={styles.songArtist}>{song.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Spotify-style Player */}
      {currentSong && (
        <div style={styles.player}>
          <audio 
            ref={audioRef}
            src={currentSong.url}
            autoPlay
            onEnded={playNext}
            onError={(e) => {
              console.error('Audio error:', e);
              alert('Error playing audio file');
            }}
          />
          
          <div style={styles.playerContainer}>
            {/* Left - Track Info */}
            <div style={styles.playerLeft}>
              <div style={styles.playerCoverContainer}>
                {currentSong.cover ? (
                  <img 
                    src={currentSong.cover} 
                    alt={currentSong.title}
                    style={styles.playerCover}
                  />
                ) : (
                  <div style={styles.playerCoverPlaceholder}>🎵</div>
                )}
              </div>
              <div style={styles.playerTrackInfo}>
                <p style={styles.playerTrackTitle}>{currentSong.title}</p>
                <p style={styles.playerTrackArtist}>{currentSong.artist}</p>
              </div>
            </div>

            {/* Center - Controls */}
            <div style={styles.playerCenter}>
              <div style={styles.playerControls}>
                <button 
                  style={styles.controlButton}
                  onClick={playPrevious}
                  disabled={songs.findIndex(s => s.id === currentSong.id) === 0}
                >
                  <span style={styles.controlIcon}>⏮</span>
                </button>
                
                <button 
                  style={styles.playPauseButton}
                  onClick={togglePlayPause}
                >
                  <span style={styles.playPauseIcon}>
                    {isPlaying ? '⏸' : '▶'}
                  </span>
                </button>
                
                <button 
                  style={styles.controlButton}
                  onClick={playNext}
                  disabled={songs.findIndex(s => s.id === currentSong.id) === songs.length - 1}
                >
                  <span style={styles.controlIcon}>⏭</span>
                </button>
              </div>
              
              {/* Progress Bar */}
              <div style={styles.progressContainer}>
                <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  style={styles.progressBar}
                />
                <span style={styles.timeLabel}>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right - Volume (placeholder) */}
            <div style={styles.playerRight}>
              <span style={styles.volumeIcon}>🔊</span>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        
        input[type="range"]::-webkit-slider-track {
          background: #4d4d4d;
          height: 4px;
          border-radius: 2px;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background: #1DB954;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          margin-top: -4px;
        }
        
        input[type="range"]::-moz-range-track {
          background: #4d4d4d;
          height: 4px;
          border-radius: 2px;
        }
        
        input[type="range"]::-moz-range-thumb {
          background: #1DB954;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          border: none;
        }
        
        input[type="range"]:hover::-webkit-slider-thumb {
          background: #1ed760;
        }
        
        input[type="range"]:hover::-moz-range-thumb {
          background: #1ed760;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: "#121212",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    paddingBottom: "100px"
  },
  mainContent: {
    padding: "20px 32px",
    maxWidth: "1955px",
    margin: "0 auto"
  },
  header: {
    marginBottom: "32px"
  },
  title: {
    fontSize: "48px",
    fontWeight: "900",
    marginBottom: "8px",
    background: "linear-gradient(90deg, #1DB954 0%, #1ed760 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-1px"
  },
  headerStats: {
    color: "#b3b3b3",
    fontSize: "14px"
  },
  trackCount: {
    fontWeight: "600"
  },
  featuredSection: {
    marginBottom: "40px"
  },
  featuredCard: {
    background: "linear-gradient(135deg, #1DB954 0%, #1aa34a 100%)",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    gap: "24px",
    alignItems: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
  },
  featuredCover: {
    width: "140px",
    height: "140px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    flexShrink: 0
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  featuredPlaceholder: {
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem"
  },
  featuredInfo: {
    flex: 1
  },
  featuredLabel: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "8px",
    display: "block"
  },
  featuredTitle: {
    fontSize: "48px",
    fontWeight: "900",
    marginBottom: "8px",
    lineHeight: "1.2"
  },
  featuredArtist: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500"
  },
  songsSection: {
    marginTop: "40px"
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#fff"
  },
  songList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "24px"
  },
  songCard: {
    background: "#181818",
    padding: "16px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative"
  },
  songCardInner: {
    display: "flex",
    flexDirection: "column"
  },
  activeCard: {
    background: "#282828"
  },
  coverContainer: {
    position: "relative",
    width: "100%",
    paddingBottom: "100%",
    marginBottom: "16px",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
  },
  songCover: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  coverPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#282828",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    color: "#535353"
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease"
  },
  playButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#1DB954",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 8px rgba(0,0,0,0.3)",
    transform: "translateY(8px)",
    transition: "transform 0.3s ease"
  },
  playIcon: {
    fontSize: "20px",
    color: "#000",
    marginLeft: "2px"
  },
  songDetails: {
    flex: 1
  },
  songTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#fff"
  },
  songArtist: {
    fontSize: "14px",
    color: "#b3b3b3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  player: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#181818",
    borderTop: "1px solid #282828",
    padding: "0",
    zIndex: 1000,
    height: "90px"
  },
  playerContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    alignItems: "center",
    height: "100%",
    padding: "0 16px",
    gap: "16px"
  },
  playerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    minWidth: 0
  },
  playerCoverContainer: {
    width: "56px",
    height: "56px",
    borderRadius: "4px",
    overflow: "hidden",
    flexShrink: 0,
    boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
  },
  playerCover: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  playerCoverPlaceholder: {
    width: "100%",
    height: "100%",
    background: "#282828",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    color: "#535353"
  },
  playerTrackInfo: {
    minWidth: 0,
    flex: 1
  },
  playerTrackTitle: {
    fontSize: "14px",
    fontWeight: "400",
    color: "#fff",
    marginBottom: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  playerTrackArtist: {
    fontSize: "11px",
    color: "#b3b3b3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  playerCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px"
  },
  playerControls: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  controlButton: {
    background: "transparent",
    border: "none",
    color: "#b3b3b3",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s ease"
  },
  controlIcon: {
    fontSize: "16px"
  },
  playPauseButton: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#fff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease"
  },
  playPauseIcon: {
    fontSize: "16px",
    color: "#000",
    marginLeft: "2px"
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    maxWidth: "500px"
  },
  progressBar: {
    flex: 1,
    height: "4px"
  },
  timeLabel: {
    fontSize: "11px",
    color: "#b3b3b3",
    minWidth: "40px",
    textAlign: "center"
  },
  playerRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px"
  },
  volumeIcon: {
    fontSize: "20px",
    opacity: 0.7
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    gap: "24px"
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #282828",
    borderTop: "4px solid #1DB954",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    color: "#b3b3b3",
    fontSize: "16px"
  },
  error: {
    textAlign: "center",
    padding: "40px",
    background: "#282828",
    borderRadius: "12px",
    maxWidth: "500px",
    margin: "100px auto",
    border: "1px solid #ff4444"
  },
  errorHint: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#b3b3b3"
  },
  retryButton: {
    marginTop: "24px",
    padding: "12px 32px",
    background: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: "500px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    transition: "background 0.2s ease"
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    maxWidth: "500px",
    margin: "100px auto"
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "24px",
    opacity: 0.3
  },
  emptyTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px"
  },
  emptyText: {
    fontSize: "16px",
    color: "#b3b3b3"
  }
};

// Add hover effects via CSS-in-JS workaround
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .song-card:hover {
      background: #282828 !important;
    }
    .song-card:hover .play-overlay {
      opacity: 1 !important;
    }
    .song-card:hover .play-button {
      transform: translateY(0) !important;
    }
    .control-button:hover {
      color: #fff !important;
    }
    .control-button:disabled {
      opacity: 0.3 !important;
      cursor: not-allowed !important;
    }
    .play-pause-button:hover {
      transform: scale(1.06) !important;
    }
    .retry-button:hover {
      background: #1ed760 !important;
    }
  `;
  
  // Apply classes
  setTimeout(() => {
    document.querySelectorAll('[style*="songCard"]').forEach(el => {
      el.classList.add('song-card');
    });
    document.querySelectorAll('[style*="playOverlay"]').forEach(el => {
      el.classList.add('play-overlay');
    });
    document.querySelectorAll('[style*="playButton"]').forEach(el => {
      el.classList.add('play-button');
    });
    document.querySelectorAll('[style*="controlButton"]').forEach(el => {
      el.classList.add('control-button');
    });
    document.querySelectorAll('[style*="playPauseButton"]').forEach(el => {
      el.classList.add('play-pause-button');
    });
    document.querySelectorAll('[style*="retryButton"]').forEach(el => {
      el.classList.add('retry-button');
    });
  }, 100);
  
  if (!document.head.querySelector('#spotify-styles')) {
    style.id = 'spotify-styles';
    document.head.appendChild(style);
  }
}