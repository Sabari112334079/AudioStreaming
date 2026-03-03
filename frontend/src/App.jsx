import Navbar from "./Components/Navbar";
import Home from "./Pages/HomePage";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UploadTrack from "./Pages/UploadTrack";
import Playlists from "./Pages/Playlists";
import Messages from "./Pages/Messages";

import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState("Listener");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/current-user", {
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
          setMode(data.user.mode || "Listener");
          console.log("✅ User authenticated:", data.user);
        } else {
          // No user in response
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        // 401 or other error - user not authenticated
        setIsLoggedIn(false);
        setCurrentUser(null);
        console.log("ℹ️ User not authenticated");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Update mode when user changes it
  const updateMode = (newMode) => {
    setMode(newMode);
    if (currentUser) {
      setCurrentUser({ ...currentUser, mode: newMode });
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading TwinTones...</p>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <Navbar 
        setPage={setPage} 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
        currentUser={currentUser}
        mode={mode} 
      />

      <div style={styles.pageContainer}>
        {page === "home" && <Home currentUser={currentUser} />}
        {page === "profile" && <Profile setMode={updateMode} currentUser={currentUser} />}
        {page === "login" && (
          <Login 
            setIsLoggedIn={setIsLoggedIn} 
            setCurrentUser={setCurrentUser} 
            setMode={setMode} 
            setPage={setPage} 
          />
        )}
        {page === "register" && <Register setPage={setPage} />}
        {page === "upload" && <UploadTrack currentUser={currentUser} />}
{page === "playlists" && (
  <Playlists 
    mode={mode} 
    currentUserEmail={currentUser?.email} 
  />
)}
        {page === "twintones" && (
          <Messages 
            currentUserEmail={currentUser?.email} 
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  pageContainer: {
    flex: 1,
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
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
    fontWeight: "600",
  },
};

// Add spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default App;