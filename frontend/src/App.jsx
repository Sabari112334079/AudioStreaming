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
  const [mode, setMode] = useState("listener");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/current-user", {
        credentials: "include" // Important: send cookies
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setMode(data.user.mode || "listener");
        console.log("✅ User authenticated:", data.user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar 
        setPage={setPage} 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn}
        setCurrentUser={setCurrentUser}
        currentUser={currentUser}
        mode={mode} 
      />

      {page === "home" && <Home />}
      {page === "profile" && <Profile setMode={setMode} currentUser={currentUser} />}
      {page === "login" && <Login setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} setMode={setMode} setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "upload" && <UploadTrack />}
      {page === "playlists" && <Playlists mode={mode} />}
      {page === "twintones" && <Messages currentUserEmail={currentUser?.email} />}
    </>
  );
}

export default App;