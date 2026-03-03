import { useState } from "react";

const Register = ({ setPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mode: "Listener",
    bio: "",
    location: "",
    genre: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration Successful! Redirecting to login...");
        console.log("✅ User Created:", data);
        setTimeout(() => setPage("login"), 2000);
      } else {
        setMessage("❌ " + data.message);
      }

    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Server Error - Make sure backend is running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <div style={styles.icon}>🎵</div>
          <h2 style={styles.title}>Join TwinTones</h2>
          <p style={styles.subtitle}>Create your account and start sharing music</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              minLength="6"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Account Type</label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Listener">🎧 Listener</option>
              <option value="Artist">🎤 Artist</option>
            </select>
          </div>

          {formData.mode === "Artist" && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Genre</label>
                <input
                  type="text"
                  name="genre"
                  placeholder="e.g., Pop, Rock, Jazz"
                  value={formData.genre}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Bio (Optional)</label>
            <textarea
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              style={styles.textarea}
              rows="3"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Location (Optional)</label>
            <input
              type="text"
              name="location"
              placeholder="City, Country"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {message && (
            <p style={{
              ...styles.message,
              color: message.includes("✅") ? "#10b981" : "#ef4444"
            }}>
              {message}
            </p>
          )}
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <span 
              style={styles.link}
              onClick={() => setPage("login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 64px)",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px"
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    width: "100%",
    maxWidth: "500px",
    overflow: "hidden",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  header: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    padding: "40px 30px",
    textAlign: "center",
    color: "white",
  },
  icon: {
    fontSize: "48px",
    marginBottom: "10px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "800",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    opacity: 0.9,
  },
  form: {
    padding: "30px",
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
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  select: {
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
    cursor: "pointer",
    background: "white",
  },
  textarea: {
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit",
    resize: "vertical",
  },
  button: {
    padding: "14px",
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    marginTop: "10px",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 4px 15px rgba(245, 87, 108, 0.4)",
  },
  message: {
    margin: "0",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "600",
  },
  footer: {
    padding: "20px 30px",
    background: "#f9fafb",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
  },
  footerText: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
  },
  link: {
    color: "#f5576c",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

// Hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input[style*="input"]:focus,
  select[style*="select"]:focus,
  textarea[style*="textarea"]:focus {
    border-color: #f5576c !important;
    box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1) !important;
  }
  
  button[style*="button"]:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4) !important;
  }
  
  button[style*="button"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);

export default Register;