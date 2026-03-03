import { useState } from "react";

const Login = ({ setIsLoggedIn, setCurrentUser, setMode, setPage }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setMode(data.user.mode || "Listener");
        setPage("home");
        setMessage("✅ Login Successful");
        console.log("✅ User Data:", data);
      } else {
        setMessage("❌ " + data.message);
      }

    } catch (error) {
      console.error("Login error:", error);
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
          <h2 style={styles.title}>Welcome Back!</h2>
          <p style={styles.subtitle}>Login to continue your music journey</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
            Don't have an account?{" "}
            <span 
              style={styles.link}
              onClick={() => setPage("register")}
            >
              Sign up here
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
    maxWidth: "440px",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    gap: "20px",
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
  button: {
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
    color: "#667eea",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

// Hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input[style*="input"]:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }
  
  button[style*="button"]:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
  }
  
  button[style*="button"]:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleSheet);

export default Login;