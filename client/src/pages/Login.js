import React, { useState, useEffect } from "react";
import apiClient from "../services/api";
import { Link } from "react-router-dom";
import "../App.css";

function Login() {
  const [mode, setMode] = useState("user"); // "user" or "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (localStorage.getItem("user")) window.location.replace("/dashboard");
      if (localStorage.getItem("admin")) window.location.replace("/admin");
    } catch (e) {
      localStorage.clear();
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await apiClient.post("/login", { email, password });
      const user = res.data.user;

      if (mode === "admin") {
        if (!user.isAdmin) { setError("Access denied. Not an admin account."); return; }
        localStorage.setItem("admin", JSON.stringify(user));
        window.location.href = "/admin";
      } else {
        if (user.isAdmin) { setError("Use Admin tab to login as admin."); return; }
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: "400px" }}>

        {/* Mode Toggle */}
        <div style={{
          display: "flex", background: "#f0f0f0",
          borderRadius: "12px", padding: "4px",
          marginBottom: "24px"
        }}>
          <button
            onClick={() => { setMode("user"); setError(""); setEmail(""); setPassword(""); }}
            style={{
              flex: 1, padding: "10px",
              borderRadius: "10px", border: "none",
              background: mode === "user" ? "white" : "transparent",
              color: mode === "user" ? "#4a00e0" : "#888",
              fontWeight: mode === "user" ? "700" : "500",
              cursor: "pointer", fontSize: "14px",
              boxShadow: mode === "user" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s"
            }}
          >
            👤 User Login
          </button>
          <button
            onClick={() => { setMode("admin"); setError(""); setEmail(""); setPassword(""); }}
            style={{
              flex: 1, padding: "10px",
              borderRadius: "10px", border: "none",
              background: mode === "admin" ? "#1a1a2e" : "transparent",
              color: mode === "admin" ? "white" : "#888",
              fontWeight: mode === "admin" ? "700" : "500",
              cursor: "pointer", fontSize: "14px",
              boxShadow: mode === "admin" ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
              transition: "all 0.2s"
            }}
          >
            ⚙️ Admin Login
          </button>
        </div>

        {/* Title */}
        <h2 style={{ marginBottom: "4px", color: "#333", fontSize: "22px" }}>
          {mode === "user" ? "Welcome Back 👋" : "Admin Portal ⚙️"}
        </h2>
        <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>
          {mode === "user" ? "Login to cast your vote" : "Restricted access — admins only"}
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: "#ffe0e0", color: "#c0392b",
            padding: "10px", borderRadius: "8px",
            marginBottom: "14px", fontSize: "13px"
          }}>
            {error}
          </div>
        )}

        {/* Inputs */}
        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(""); }}
          onKeyPress={e => e.key === "Enter" && handleLogin()}
          style={{ borderColor: mode === "admin" ? "#1a1a2e" : undefined }}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(""); }}
          onKeyPress={e => e.key === "Enter" && handleLogin()}
          style={{ borderColor: mode === "admin" ? "#1a1a2e" : undefined }}
        />

        {/* Login Button */}
        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1,
            background: mode === "admin"
              ? "linear-gradient(135deg, #1a1a2e, #e94560)"
              : undefined
          }}
        >
          {loading ? "Logging in..." : mode === "user" ? "Login" : "Admin Login"}
        </button>

        {/* Register link — only for user mode */}
        {mode === "user" && (
          <p style={{ marginTop: "16px", fontSize: "13px", color: "#666" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#4a00e0", fontWeight: "600" }}>
              Register here
            </Link>
          </p>
        )}

        {mode === "admin" && (
          <p style={{ marginTop: "16px", fontSize: "12px", color: "#aaa", textAlign: "center" }}>
            Admin accounts are managed by the system owner.
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
