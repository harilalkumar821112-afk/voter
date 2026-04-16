import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

function Dashboard() {
  const [candidateCount, setCandidateCount] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    // Only fetch candidate count
    apiClient.get("/candidates")
      .then(res => setCandidateCount(res.data.length))
      .catch(() => { });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
              Voter ID: <strong>{user.voterId || "Not assigned"}</strong>
              &nbsp;|&nbsp;
              {user.hasVoted
                ? <span>✅ You have voted</span>
                : <span>⏳ You haven't voted yet</span>}
            </p>
          </div>
          <button className="btn btn-light fw-bold" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stat — only candidates count */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderLeft: "4px solid #667eea" }}>
            <div style={{ fontSize: "36px" }}>🏛️</div>
            <h3 className="fw-bold text-primary mt-2">{candidateCount}</h3>
            <p className="text-muted mb-0">Candidates in Election</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderLeft: "4px solid #2ecc71" }}>
            <div style={{ fontSize: "36px" }}>🗳️</div>
            <h3 className="fw-bold text-success mt-2">
              {user.hasVoted ? "Done ✅" : "Pending"}
            </h3>
            <p className="text-muted mb-0">Your Vote Status</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderLeft: "4px solid #f39c12" }}>
            <div style={{ fontSize: "36px" }}>🪪</div>
            <h3 className="fw-bold text-warning mt-2" style={{ fontSize: "18px" }}>
              {user.voterId || "Not Assigned"}
            </h3>
            <p className="text-muted mb-0">Your Voter ID</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="row g-4">

        {/* Vote Now */}
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

        {/* Download EPIC */}
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

        {/* Notifications */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>🔔</div>
              <h5 className="fw-bold mt-2">Notifications</h5>
              <p className="text-muted">View your vote receipt and updates.</p>
              <button
                className="btn btn-warning w-100 text-white"
                style={{ borderRadius: "25px" }}
                onClick={() => navigate("/notifications")}
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>👤</div>
              <h5 className="fw-bold mt-2">My Profile</h5>
              <p className="text-muted">View and update your profile.</p>
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

        {/* Election Results */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center p-4">
              <div style={{ fontSize: "48px" }}>📊</div>
              <h5 className="fw-bold mt-2">Election Results</h5>
              <p className="text-muted">View live election results.</p>
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

      </div>
    </div>
  );
}

export default Dashboard;
