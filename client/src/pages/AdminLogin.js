import React, { useState, useEffect } from "react";
import apiClient from "../services/api";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const admin = localStorage.getItem("admin");
        if (admin) window.location.href = "/admin";
    }, []);

    const loginAdmin = async () => {
        if (!email || !password) { setError("Please fill all fields"); return; }
        setLoading(true); setError("");
        try {
            const res = await apiClient.post("/login", { email, password });
            if (!res.data.user.isAdmin) {
                setError("Access denied. Admin only.");
                return;
            }
            localStorage.setItem("admin", JSON.stringify(res.data.user));
            window.location.href = "/admin";
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Segoe UI', sans-serif"
        }}>
            <div style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "50px 40px",
                width: "100%",
                maxWidth: "420px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "35px" }}>
                    <div style={{
                        width: "70px", height: "70px",
                        background: "linear-gradient(135deg, #e94560, #0f3460)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 15px",
                        fontSize: "30px"
                    }}>⚙️</div>
                    <h2 style={{ color: "white", fontWeight: "700", margin: 0 }}>Admin Portal</h2>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "6px" }}>
                        Online Voting System
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: "rgba(233,69,96,0.2)",
                        border: "1px solid rgba(233,69,96,0.5)",
                        color: "#ff6b8a",
                        padding: "12px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        fontSize: "14px",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "6px", display: "block" }}>
                        Admin Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                        onKeyPress={e => e.key === "Enter" && loginAdmin()}
                        placeholder="admin@voting.com"
                        style={{
                            width: "100%", padding: "12px 16px",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "10px", color: "white",
                            fontSize: "15px", outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <label style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "6px", display: "block" }}>
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(""); }}
                        onKeyPress={e => e.key === "Enter" && loginAdmin()}
                        placeholder="••••••••"
                        style={{
                            width: "100%", padding: "12px 16px",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "10px", color: "white",
                            fontSize: "15px", outline: "none",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                <button
                    onClick={loginAdmin}
                    disabled={loading}
                    style={{
                        width: "100%", padding: "14px",
                        background: loading ? "rgba(233,69,96,0.5)" : "linear-gradient(135deg, #e94560, #c62a47)",
                        border: "none", borderRadius: "10px",
                        color: "white", fontSize: "16px",
                        fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s"
                    }}
                >
                    {loading ? "Signing in..." : "Sign In as Admin"}
                </button>

                <p style={{ textAlign: "center", marginTop: "20px", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                    <a href="/login" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                        ← Back to User Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;
