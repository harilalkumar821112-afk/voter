import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCandidates();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/candidates");
      setCandidates(res.data);
    } catch (err) {
      setError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const vote = async (id, candidateName) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.hasVoted) {
      alert("You have already voted!");
      return;
    }

    if (!window.confirm(`Are you sure you want to vote for ${candidateName}?`)) return;

    setVoting(id);
    try {
      const res = await apiClient.post("/vote", {
        userId: user._id,
        candidateId: id
      });

      // Update localStorage to reflect hasVoted
      const updatedUser = { ...user, hasVoted: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("✅ " + res.data.message);
      navigate("/notifications");
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed. Please try again.");
    } finally {
      setVoting(null);
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-4 pt-5 mb-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">🗳️ Vote For Candidate</h2>
        <p className="text-muted">
          {user.hasVoted
            ? "✅ You have already cast your vote."
            : "Select a candidate to cast your vote. You can only vote once."}
        </p>
      </div>

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "60px" }}>🗳️</div>
          <h4 className="mt-3">No Candidates Available</h4>
          <p className="text-muted">Election candidates have not been added yet. Please check back later.</p>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          {candidates.map((c) => (
            <div className="col-lg-4 col-md-6 col-12" key={c._id}>
              <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", overflow: "hidden" }}>
                {/* Card Header */}
                <div style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  padding: "30px 20px",
                  textAlign: "center",
                  color: "white"
                }}>
                  <div style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    fontSize: "30px"
                  }}>
                    👤
                  </div>
                  <h4 className="mb-1 fw-bold">{c.name}</h4>
                  <span style={{
                    background: "rgba(255,255,255,0.25)",
                    padding: "4px 14px",
                    borderRadius: "20px",
                    fontSize: "13px"
                  }}>
                    {c.party}
                  </span>
                </div>

                {/* Card Body */}
                <div className="card-body text-center p-4">
                  <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                    Total Votes: <strong>{c.votes}</strong>
                  </p>

                  {user.hasVoted ? (
                    <button className="btn btn-secondary w-100" disabled>
                      Already Voted
                    </button>
                  ) : (
                    <button
                      className="btn btn-success w-100 fw-bold"
                      onClick={() => vote(c._id, c.name)}
                      disabled={voting === c._id}
                      style={{ borderRadius: "25px", padding: "10px" }}
                    >
                      {voting === c._id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Voting...
                        </>
                      ) : (
                        "✅ Vote Now"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidateList;
