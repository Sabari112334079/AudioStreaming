import { useEffect, useState } from "react";

const Profile = ({ setMode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modeLocal, setModeLocal] = useState("listener"); // lowercase for logic

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);

          // Normalize mode for frontend logic
          const userMode = data.user.mode.toLowerCase(); // "listener" or "artist"
          setModeLocal(userMode);
          if (setMode) setMode(userMode); // sync with Navbar
        } else {
          console.log("Error:", data.message);
        }
      } catch (err) {
        console.log("Server Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setMode]);

 const toggleMode = async () => {
  const newMode = modeLocal === "listener" ? "Artist" : "Listener"; // match enum
  const newModeLower = newMode.toLowerCase();

  setModeLocal(newModeLower);
  setMode(newModeLower); // sync with App/Navbar
  localStorage.setItem("mode", newModeLower); // ✅ persist across refresh

  try {
    await fetch("http://localhost:5000/update-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, mode: newMode }),
    });
  } catch (err) {
    console.log("Error updating mode:", err);
  }
};

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!user) return <p style={{ textAlign: "center" }}>No user found</p>;

  return (
    <div style={styles.container}>
      <h2>👤 Profile Page</h2>
      <div style={styles.card}>
        <p><strong>ID:</strong> {user._id}</p>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Mode:</strong> {modeLocal.charAt(0).toUpperCase() + modeLocal.slice(1)}
        </p>

        <button style={styles.toggleBtn} onClick={toggleMode}>
          Switch to {modeLocal === "artist" ? "Listener" : "Artist"} Mode
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 20px", backgroundColor: "#f3f4f6", minHeight: "80vh" },
  card: { padding: "30px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", width: "300px", textAlign: "left", lineHeight: "1.8" },
  toggleBtn: { marginTop: "15px", padding: "8px 12px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default Profile;