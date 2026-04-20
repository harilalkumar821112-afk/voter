import React, { useState, useEffect } from "react";
import apiClient from "../services/api";
import { Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    voterId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) window.location.href = "/";
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const registerUser = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.voterId) {
      setError("Please fill all fields");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/auth/register", form);
      alert("Registration Successful! Your Voter ID: " + response.data.voterId);
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 style={{ marginBottom: "8px", color: "#333" }}>Create Account</h2>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>
          Register to vote online
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
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="auth-input"
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="auth-input"
          name="voterId"
          placeholder="Voter ID"
          value={form.voterId}
          onChange={handleChange}
        />
        <input
          className="auth-input"
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
        />
        <input
          className="auth-input"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          className="auth-btn"
          onClick={registerUser}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4a00e0", fontWeight: "600" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
