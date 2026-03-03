import { useState } from "react";

const Navbar = ({ setPage, isLoggedIn, setIsLoggedIn, mode }) => {
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
  } catch (error) {
    console.error("Logout error:", error);
  }
};
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🎵 StreamingAudio</div>

      {/* 🔹 Main Navigation */}
      <div style={styles.links}>
        <a href="#" onClick={() => setPage("home")} style={styles.link}>Home</a>
        <a href="#" onClick={() => setPage("playlists")} style={styles.link}>Playlists</a>
        <a href="#" onClick={() => setPage("favorites")} style={styles.link}>Favorites</a>
        <a href="#" onClick={() => setPage("twintones")} style={styles.link}>Twin Tones</a>

        {/* 🔹 Upload Track (only for artist) */}
        {isLoggedIn && mode === "artist" && (
          <button style={styles.uploadBtn} onClick={() => setPage("upload")}>
            Upload Track
          </button>
        )}
      </div>

      {/* 🔹 Profile / Auth Buttons */}
      {isLoggedIn ? (
        <div style={styles.profileContainer}>
          <div
            style={styles.profileCircle}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            👤
          </div>

          {showDropdown && (
            <div style={styles.dropdown}>
              <p
                style={styles.dropdownItem}
                onClick={() => {
                  setPage("profile");
                  setShowDropdown(false);
                }}
              >
                Profile
              </p>

              <p
                style={styles.dropdownItem}
                onClick={() => {
                 handleLogout();
                  
                }}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.authButtons}>
          <button style={styles.loginBtn} onClick={() => setPage("login")}>Login</button>
          <button style={styles.registerBtn} onClick={() => setPage("register")}>Register</button>
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
    backgroundColor: "#121212", 
    color: "white", 
    position: "relative",
    fontFamily: "Arial, sans-serif"
  },
  logo: { 
    fontSize: "22px", 
    fontWeight: "bold", 
    letterSpacing: "1px"
  },
  links: { 
    display: "flex", 
    gap: "25px", 
    alignItems: "center" 
  },
  link: { 
    color: "white", 
    textDecoration: "none", 
    fontSize: "16px", 
    padding: "6px 10px",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
  uploadBtn: { 
    padding: "6px 12px", 
    backgroundColor: "#1db954", 
    color: "white", 
    border: "none", 
    borderRadius: "20px", 
    cursor: "pointer", 
    marginLeft: "10px",
    fontWeight: "bold"
  },
  authButtons: { display: "flex", gap: "15px" },
  loginBtn: { 
    padding: "8px 18px", 
    backgroundColor: "transparent", 
    border: "1px solid #1db954", 
    color: "#1db954", 
    borderRadius: "20px", 
    cursor: "pointer",
    fontWeight: "bold"
  },
  registerBtn: { 
    padding: "8px 18px", 
    backgroundColor: "#1db954", 
    border: "none", 
    color: "white", 
    borderRadius: "20px", 
    cursor: "pointer",
    fontWeight: "bold"
  },
  profileContainer: { position: "relative" },
  profileCircle: { 
    width: "40px", 
    height: "40px", 
    borderRadius: "50%", 
    backgroundColor: "#1db954", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    cursor: "pointer", 
    fontSize: "18px" 
  },
  dropdown: { 
    position: "absolute", 
    top: "50px", 
    right: "0", 
    backgroundColor: "#282828", 
    color: "white", 
    borderRadius: "8px", 
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)", 
    width: "150px", 
    zIndex: 100 
  },
  dropdownItem: { 
    padding: "12px", 
    cursor: "pointer", 
    borderBottom: "1px solid #444",
    transition: "background 0.2s"
  }
};

export default Navbar;