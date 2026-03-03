import { useState } from "react";

const Login = ({ setIsLoggedIn, setCurrentUser, setPage }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // Important: send/receive cookies
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setPage("home");
        setMessage("✅ Login Successful");
        console.log("User Data:", data);
      } else {
        setMessage("❌ " + data.message);
      }

    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Server Error");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        {message && <p style={{ margin: 0, textAlign: "center" }}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundColor: "#f3f4f6"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "30px",
    width: "300px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Login;