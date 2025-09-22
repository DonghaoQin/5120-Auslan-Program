import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Restore remembered username
  useEffect(() => {
    const savedUser = localStorage.getItem("login_username");
    if (savedUser) {
      setUsername(savedUser);
      setRemember(true);
    }
  }, []);

  // ✅ Your async submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Sanitize input
    const cleanUsername = DOMPurify.sanitize(username);
    const cleanPassword = DOMPurify.sanitize(password);

    if (!cleanUsername || !cleanPassword) {
      setError("Please enter both username and password.");
      return;
    }

    if (submitting) return; // Prevent rapid submits
    setSubmitting(true);
    try {
      // TODO: replace with real auth API
      await new Promise((r) => setTimeout(r, 600));

      if (cleanUsername === "test" && cleanPassword === "TA47") {
        if (remember) localStorage.setItem("login_username", cleanUsername);
        else localStorage.removeItem("login_username");

        navigate("/home"); // redirect
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Start Learning Auslan</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          aria-label="Username"
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          aria-label="Password"
          autoComplete="off"
        />

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>

        <button type="submit" style={styles.button} disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0e7ff 0%, #f0f2f5 100%)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "2.5rem 2rem 2rem 2rem",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 8px 32px rgba(60,60,120,0.15)",
    width: "340px",
    position: "relative",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#4f46e5",
    fontWeight: 700,
    fontSize: "2rem",
    letterSpacing: "1px",
  },
  input: {
    padding: "12px 14px",
    marginBottom: "1.2rem",
    border: "1px solid #c7d2fe",
    borderRadius: "8px",
    fontSize: "15px",
    background: "#f8fafc",
    transition: "border 0.2s",
    outline: "none",
    boxSizing: "border-box",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1.2rem",
    fontSize: "15px",
    color: "#6366f1",
    gap: "8px",
  },
  button: {
    padding: "12px",
    background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: 600,
    boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
    transition: "background 0.2s",
  },
  error: {
    color: "#ef4444",
    marginBottom: "1rem",
    fontSize: "15px",
    textAlign: "center",
    fontWeight: 500,
  },
};

export default Login;
