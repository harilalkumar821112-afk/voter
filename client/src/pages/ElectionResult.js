import React, { useEffect, useState } from "react";
import apiClient from "../services/api";

function ElectionResult() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get("/stats")
            .then(res => setStats(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const getWinner = () => {
        if (!stats?.candidates?.length) return null;
        return stats.candidates.reduce((a, b) => a.votes > b.votes ? a : b);
    };

    const winner = getWinner();
    const totalVotes = stats?.totalVotes || 0;

    return (
        <div className="container mt-4 pt-5 mb-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold">📊 Election Results</h2>
                <p className="text-muted">Live vote counts and standings</p>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                </div>
            ) : !stats ? (
                <div className="alert alert-warning text-center">Unable to load results.</div>
            ) : (
                <>
                    {/* Stats Summary */}
                    <div className="row g-3 mb-5">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm text-center p-3">
                                <h3 className="fw-bold text-primary">{stats.totalVoters}</h3>
                                <p className="text-muted mb-0">Total Voters</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm text-center p-3">
                                <h3 className="fw-bold text-success">{stats.totalVotes}</h3>
                                <p className="text-muted mb-0">Votes Cast</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm text-center p-3">
                                <h3 className="fw-bold text-warning">{stats.totalCandidates}</h3>
                                <p className="text-muted mb-0">Candidates</p>
                            </div>
                        </div>
                    </div>

                    {/* Winner Banner */}
                    {winner && winner.votes > 0 && (
                        <div style={{
                            background: "linear-gradient(135deg, #f6d365, #fda085)",
                            borderRadius: "16px",
                            padding: "30px",
                            textAlign: "center",
                            marginBottom: "30px",
                            color: "white"
                        }}>
                            <div style={{ fontSize: "50px" }}>🏆</div>
                            <h3 className="fw-bold mt-2">Leading Candidate</h3>
                            <h2 className="fw-bold">{winner.name}</h2>
                            <p className="mb-0">{winner.party} — {winner.votes} votes</p>
                        </div>
                    )}

                    {/* Candidates Results */}
                    <div className="row g-4">
                        {stats.candidates
                            .sort((a, b) => b.votes - a.votes)
                            .map((c, i) => {
                                const percent = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0;
                                return (
                                    <div className="col-12" key={c._id}>
                                        <div className="card border-0 shadow-sm p-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    <span style={{
                                                        width: "36px", height: "36px",
                                                        borderRadius: "50%",
                                                        background: i === 0 ? "#fda085" : "#667eea",
                                                        color: "white",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontWeight: "bold"
                                                    }}>
                                                        {i + 1}
                                                    </span>
                                                    <div>
                                                        <h6 className="mb-0 fw-bold">{c.name}</h6>
                                                        <small className="text-muted">{c.party}</small>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <strong>{c.votes} votes</strong>
                                                    <br />
                                                    <small className="text-muted">{percent}%</small>
                                                </div>
                                            </div>
                                            <div className="progress" style={{ height: "8px", borderRadius: "10px" }}>
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${percent}%`,
                                                        background: i === 0 ? "linear-gradient(90deg, #f6d365, #fda085)" : "linear-gradient(90deg, #667eea, #764ba2)",
                                                        borderRadius: "10px"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </>
            )}
        </div>
    );
}

export default ElectionResult;
