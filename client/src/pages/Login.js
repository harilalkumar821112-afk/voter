import React, { useState, useEffect } from "react";
import apiClient from "../services/api";
import { Link } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) window.location.href = "/dashboard";
  }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await apiClient.post("/login", { email, password });
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: "400px" }}>

        {/* Title */}
        <h2 style={{ marginBottom: "4px", color: "#333", fontSize: "22px" }}>
          Welcome Back 👋
        </h2>
        <p style={{ color: "#888", fontSize: "13px", marginBottom: "20px" }}>
          Login to cast your vote
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
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(""); }}
          onKeyPress={e => e.key === "Enter" && handleLogin()}
        />

        {/* Login Button */}
        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading}
          style={{
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register link */}
        <p style={{ marginTop: "16px", fontSize: "13px", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#4a00e0", fontWeight: "600" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
