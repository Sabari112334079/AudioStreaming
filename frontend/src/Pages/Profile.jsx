import { useEffect, useState } from "react";

const Profile = ({ setMode, currentUser }) => {
  const [user, setUser] = useState(currentUser);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    genre: "",
    mode: "Listener"
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        genre: currentUser.genre || "",
        mode: currentUser.mode || "Listener"
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: user.email,
          ...formData
        })
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setMode(data.user.mode);
        setEditing(false);
        setMessage("✅ Profile updated successfully!");
        
        // Update parent component's currentUser
        if (window.location.reload) {
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = async () => {
    const newMode = formData.mode === "Listener" ? "Artist" : "Listener";
    
    setFormData({ ...formData, mode: newMode });
    
    try {
      const res = await fetch("http://localhost:5000/update-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          email: user.email, 
          mode: newMode 
        })
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setMode(newMode);
        setMessage(`✅ Switched to ${newMode} mode!`);
      }
    } catch (err) {
      console.error("Mode update error:", err);
      setMessage("❌ Failed to update mode");
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔒</div>
          <h2 style={styles.emptyTitle}>Please Login</h2>
          <p style={styles.emptyText}>You need to be logged in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatarLarge}>
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" style={styles.avatarImg} />
            ) : (
              <span style={styles.avatarText}>
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <h2 style={styles.userName}>{user.name}</h2>
          <p style={styles.userEmail}>{user.email}</p>
          <div style={styles.modeBadge}>
            {user.mode === "Artist" ? "🎤" : "🎧"} {user.mode}
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{user.totalTracks || 0}</div>
            <div style={styles.statLabel}>Tracks</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{user.followers || 0}</div>
            <div style={styles.statLabel}>Followers</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{user.following || 0}</div>
            <div style={styles.statLabel}>Following</div>
          </div>
        </div>

        {/* Profile Info */}
        <div style={styles.infoSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Profile Information</h3>
            <button 
              style={styles.editBtn}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "✏️ Edit"}
            </button>
          </div>

          {editing ? (
            // Edit Mode
            <div style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="City, Country"
                />
              </div>

              {formData.mode === "Artist" && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="e.g., Pop, Rock, Jazz"
                  />
                </div>
              )}

              <button 
                style={styles.saveBtn}
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          ) : (
            // View Mode
            <div style={styles.infoContent}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>📝 Bio:</span>
                <span style={styles.infoValue}>
                  {user.bio || "No bio yet"}
                </span>
              </div>
              
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>📍 Location:</span>
                <span style={styles.infoValue}>
                  {user.location || "Not specified"}
                </span>
              </div>
              
              {user.mode === "Artist" && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>🎵 Genre:</span>
                  <span style={styles.infoValue}>
                    {user.genre || "Not specified"}
                  </span>
                </div>
              )}
              
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>📅 Member Since:</span>
                <span style={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mode Toggle */}
        <div style={styles.modeSection}>
          <h3 style={styles.sectionTitle}>Account Type</h3>
          <p style={styles.modeDescription}>
            {user.mode === "Listener" 
              ? "Switch to Artist mode to upload and share your music"
              : "Switch to Listener mode to focus on discovering music"}
          </p>
          <button 
            style={styles.toggleBtn}
            onClick={toggleMode}
          >
            Switch to {user.mode === "Listener" ? "Artist" : "Listener"} Mode
          </button>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            ...styles.message,
            background: message.includes("✅") 
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    width: "100%",
    maxWidth: "700px",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 30px",
    textAlign: "center",
    color: "white",
  },
  avatarLarge: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "white",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarText: {
    fontSize: "48px",
    fontWeight: "700",
    color: "#667eea",
  },
  userName: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "800",
  },
  userEmail: {
    margin: "0 0 15px 0",
    fontSize: "14px",
    opacity: 0.9,
  },
  modeBadge: {
    display: "inline-block",
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    padding: "30px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  statBox: {
    textAlign: "center",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#667eea",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoSection: {
    padding: "30px",
    borderBottom: "1px solid #e5e7eb",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
  },
  editBtn: {
    background: "transparent",
    border: "2px solid #667eea",
    color: "#667eea",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
    resize: "vertical",
  },
  saveBtn: {
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "10px",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  infoContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  infoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  infoLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    minWidth: "140px",
  },
  infoValue: {
    fontSize: "14px",
    color: "#1f2937",
    flex: 1,
    lineHeight: "1.6",
  },
  modeSection: {
    padding: "30px",
  },
  modeDescription: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "15px",
    lineHeight: "1.6",
  },
  toggleBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(245, 87, 108, 0.4)",
  },
  message: {
    margin: "20px 30px 30px",
    padding: "14px 20px",
    color: "white",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
    margin: "0 0 15px 0",
  },
  emptyText: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
  },
};

// Hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:focus,
  textarea:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  button[style*="saveBtn"]:hover:not(:disabled),
  button[style*="toggleBtn"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
  }
  
  button[style*="editBtn"]:hover {
    background: #667eea !important;
    color: white !important;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);

export default Profile;