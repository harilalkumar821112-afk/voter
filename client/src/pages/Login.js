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
    const user = localStorage.getItem("user");
    if (user) window.location.href = "/";
  }, []);

  const loginUser = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiClient.post("/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") loginUser();
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 style={{ marginBottom: "8px", color: "#333" }}>Welcome Back</h2>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>
          Login to your account
        </p>

        {error && (
          <div style={{
            background: "#ffe0e0",
            color: "#c0392b",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "12px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onKeyPress={handleKeyPress}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyPress={handleKeyPress}
        />

        <button
          className="auth-btn"
          onClick={loginUser}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#4a00e0", fontWeight: "600" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
