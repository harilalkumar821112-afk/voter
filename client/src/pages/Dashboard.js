import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    apiClient.get("/stats").then(res => setStats(res.data)).catch(() => { });
  }, []);

  if (!user) return null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container mt-5 pt-3 mb-5">
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        borderRadius: "16px",
        padding: "30px",
        color: "white",
        marginBottom: "30px"
      }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Welcome, {user.name} 👋</h2>
            <p className="mb-0" style={{ opacity: 0.85 }}>
              Voter ID: <strong>{user.voterId || "Not assigned"}</strong> &nbsp;|&nbsp;
              Status: {user.hasVoted
                ? <span>✅ Voted</span>
                : <span>⏳ Not Voted Yet</span>}
            </p>
          </div>
          <button className="btn btn-light fw-bold" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-3">
              <div style={{ fontSize: "36px" }}>👥</div>
              <h3 className="fw-bold text-primary">{stats.totalVoters}</h3>
              <p className="text-muted mb-0">Total Voters</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-3">
              <div style={{ fontSize: "36px" }}>🗳️</div>
              <h3 className="fw-bold text-success">{stats.totalVotes}</h3>
              <p className="text-muted mb-0">Votes Cast</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-3">
              <div style={{ fontSize: "36px" }}>🏛️</div>
              <h3 className="fw-bold text-warning">{stats.totalCandidates}</h3>
              <p className="text-muted mb-0">Candidates</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>🗳️</div>
              <h5 className="fw-bold mt-2">Vote Now</h5>
              <p className="text-muted">Cast your vote in the current election.</p>
              <button
                className="btn btn-primary w-100"
                style={{ borderRadius: "25px" }}
                onClick={() => navigate("/vote")}
                disabled={user.hasVoted}
              >
                {user.hasVoted ? "Already Voted ✅" : "Vote Now"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>📊</div>
              <h5 className="fw-bold mt-2">Election Results</h5>
              <p className="text-muted">View live election results and statistics.</p>
              <button
                className="btn btn-success w-100"
                style={{ borderRadius: "25px" }}
                onClick={() => navigate("/result")}
              >
                View Results
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>🔔</div>
              <h5 className="fw-bold mt-2">Notifications</h5>
              <p className="text-muted">View your vote receipt and notifications.</p>
              <button
                className="btn btn-warning w-100"
                style={{ borderRadius: "25px" }}
                onClick={() => navigate("/notifications")}
              >
                View Notifications
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>👤</div>
              <h5 className="fw-bold mt-2">My Profile</h5>
              <p className="text-muted">View and update your profile information.</p>
              <button
                className="btn btn-info w-100 text-white"
                style={{ borderRadius: "25px" }}
                onClick={() => navigate("/profile")}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>📥</div>
              <h5 className="fw-bold mt-2">Download EPIC</h5>
              <p className="text-muted">Download your Electoral Photo Identity Card.</p>
              <button
                className="btn btn-secondary w-100"
                style={{ borderRadius: "25px" }}
                onClick={() => navigate("/download")}
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {user.isAdmin && (
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", border: "2px solid #dc3545" }}>
              <div className="card-body text-center p-4">
                <div style={{ fontSize: "48px" }}>⚙️</div>
                <h5 className="fw-bold mt-2">Admin Panel</h5>
                <p className="text-muted">Manage users, candidates and elections.</p>
                <button
                  className="btn btn-danger w-100"
                  style={{ borderRadius: "25px" }}
                  onClick={() => navigate("/admin")}
                >
                  Admin Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
