import { useState } from "react";

const Navbar = ({ setPage, isLoggedIn, setIsLoggedIn, setCurrentUser, currentUser, mode }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include"
      });
      
      setIsLoggedIn(false);
      setCurrentUser(null);
      setPage("home");
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => setPage("home")}>
        🎵 <span style={styles.logoText}>TwinTones</span>
      </div>

      {/* Main Navigation */}
      <div style={styles.links}>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setPage("home"); }} 
          style={styles.link}
        >
          🏠 Home
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setPage("playlists"); }} 
          style={styles.link}
        >
          📚 Playlists
        </a>
        {isLoggedIn && (
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setPage("twintones"); }} 
            style={styles.link}
          >
            💬 Messages
          </a>
        )}
        
        {/* Upload Track (only for Artist) */}
        {isLoggedIn && mode === "Artist" && (
          <button 
            style={styles.uploadBtn} 
            onClick={() => setPage("upload")}
          >
            ⬆️ Upload
          </button>
        )}
      </div>

      {/* Profile / Auth Buttons */}
      {isLoggedIn ? (
        <div style={styles.profileContainer}>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{currentUser?.name || "User"}</span>
            <span style={styles.userMode}>{mode}</span>
          </div>
          <div
            style={styles.profileCircle}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt="avatar" 
                style={styles.avatarImg}
              />
            ) : (
              "👤"
            )}
          </div>

          {showDropdown && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownAvatar}>
                  {currentUser?.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="avatar" 
                      style={styles.avatarImg}
                    />
                  ) : (
                    "👤"
                  )}
                </div>
                <div>
                  <div style={styles.dropdownName}>{currentUser?.name}</div>
                  <div style={styles.dropdownEmail}>{currentUser?.email}</div>
                </div>
              </div>
              
              <div style={styles.dropdownDivider}></div>
              
              <p
                style={styles.dropdownItem}
                onClick={() => {
                  setPage("profile");
                  setShowDropdown(false);
                }}
              >
                ⚙️ Profile Settings
              </p>
              
              <p
                style={styles.dropdownItem}
                onClick={handleLogout}
              >
                🚪 Logout
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.authButtons}>
          <button 
            style={styles.loginBtn} 
            onClick={() => setPage("login")}
          >
            Login
          </button>
          <button 
            style={styles.registerBtn} 
            onClick={() => setPage("register")}
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif"
  },
  logo: {
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.2s",
  },
  logoText: {
    background: "linear-gradient(to right, #fff, #f0f0f0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  links: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
    padding: "8px 16px",
    borderRadius: "20px",
    transition: "all 0.2s",
    fontWeight: "500",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  uploadBtn: {
    padding: "8px 20px",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
  },
  authButtons: {
    display: "flex",
    gap: "12px"
  },
  loginBtn: {
    padding: "10px 24px",
    backgroundColor: "transparent",
    border: "2px solid white",
    color: "white",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  registerBtn: {
    padding: "10px 24px",
    background: "white",
    border: "none",
    color: "#667eea",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    transition: "all 0.2s",
    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.3)",
  },
  profileContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
  },
  userMode: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.8)",
    background: "rgba(255, 255, 255, 0.2)",
    padding: "2px 8px",
    borderRadius: "10px",
    marginTop: "2px",
  },
  profileCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "20px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    transition: "transform 0.2s",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dropdown: {
    position: "absolute",
    top: "60px",
    right: "0",
    background: "white",
    color: "#1f2937",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "260px",
    zIndex: 100,
    overflow: "hidden",
    animation: "fadeIn 0.2s ease",
  },
  dropdownHeader: {
    padding: "16px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    background: "#f9fafb",
  },
  dropdownAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    overflow: "hidden",
  },
  dropdownName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1f2937",
  },
  dropdownEmail: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "2px",
  },
  dropdownDivider: {
    height: "1px",
    background: "#e5e7eb",
  },
  dropdownItem: {
    padding: "14px 16px",
    cursor: "pointer",
    transition: "background 0.2s",
    margin: 0,
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }
};

// Add hover effects via CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  a[style*="link"]:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: translateY(-2px);
  }
  
  button[style*="uploadBtn"]:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4) !important;
  }
  
  button[style*="loginBtn"]:hover {
    background: white !important;
    color: #667eea !important;
  }
  
  button[style*="registerBtn"]:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4) !important;
  }
  
  div[style*="profileCircle"]:hover {
    transform: scale(1.1);
  }
  
  p[style*="dropdownItem"]:hover {
    background: #f3f4f6 !important;
  }
  
  div[style*="logo"]:hover {
    transform: scale(1.05);
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;