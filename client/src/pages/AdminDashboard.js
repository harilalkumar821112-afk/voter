import React, { useState, useEffect } from "react";
import apiClient from "../services/api";

const SIDEBAR_ITEMS = [
  { key: "overview", icon: "📊", label: "Overview" },
  { key: "candidates", icon: "🏛️", label: "Candidates" },
  { key: "users", icon: "👥", label: "Users" },
  { key: "votes", icon: "🗳️", label: "Vote Records" },
];

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [stats, setStats] = useState(null); // eslint-disable-line no-unused-vars
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (!stored) { window.location.href = "/admin-login"; return; }
    const a = JSON.parse(stored);
    if (!a.isAdmin) { window.location.href = "/admin-login"; return; }
    setAdmin(a);
    fetchAll(a);
  }, []);

  const fetchAll = async (a) => {
    setLoading(true);
    try {
      const [usersRes, candidatesRes, statsRes] = await Promise.all([
        apiClient.get(`/admin/users?adminId=${a._id}`),
        apiClient.get("/candidates"),
        apiClient.get("/stats"),
      ]);
      setUsers(usersRes.data.users);
      setCandidates(candidatesRes.data);
      setStats(statsRes.data);
      // Build vote records from users who voted
      const votedUsers = usersRes.data.users.filter(u => u.hasVoted);
      setVotes(votedUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async () => {
    if (!newCandidate.name.trim() || !newCandidate.party.trim()) {
      alert("Enter candidate name and party"); return;
    }
    try {
      await apiClient.post("/addCandidate", newCandidate);
      setNewCandidate({ name: "", party: "" });
      const res = await apiClient.get("/candidates");
      setCandidates(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding candidate");
    }
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      await apiClient.delete(`/candidate/${id}`);
      setCandidates(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert("Error deleting candidate");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin-login";
  };

  if (!admin) return null;

  const styles = {
    wrapper: {
      display: "flex", minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f0f2f5"
    },
    sidebar: {
      width: sidebarOpen ? "250px" : "70px",
      background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
      transition: "width 0.3s ease",
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0,
      height: "100vh", zIndex: 100,
      overflow: "hidden"
    },
    sidebarLogo: {
      padding: "20px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      display: "flex", alignItems: "center", gap: "12px"
    },
    sidebarItem: (active) => ({
      display: "flex", alignItems: "center", gap: "14px",
      padding: "14px 20px", cursor: "pointer",
      background: active ? "rgba(233,69,96,0.2)" : "transparent",
      borderLeft: active ? "3px solid #e94560" : "3px solid transparent",
      color: active ? "#e94560" : "rgba(255,255,255,0.7)",
      transition: "all 0.2s", whiteSpace: "nowrap",
      fontSize: "15px"
    }),
    main: {
      marginLeft: sidebarOpen ? "250px" : "70px",
      flex: 1, transition: "margin-left 0.3s ease"
    },
    topbar: {
      background: "white",
      padding: "16px 28px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      position: "sticky", top: 0, zIndex: 99
    },
    content: { padding: "28px" },
    card: {
      background: "white", borderRadius: "14px",
      padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      marginBottom: "24px"
    },
    statCard: (color) => ({
      background: "white", borderRadius: "14px",
      padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      borderLeft: `4px solid ${color}`
    }),
    badge: (color) => ({
      background: color, color: "white",
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "12px", fontWeight: "600"
    }),
    btn: (color, outline) => ({
      padding: "8px 18px", borderRadius: "8px",
      border: outline ? `1px solid ${color}` : "none",
      background: outline ? "transparent" : color,
      color: outline ? color : "white",
      cursor: "pointer", fontSize: "13px",
      fontWeight: "600", transition: "all 0.2s"
    }),
    input: {
      padding: "10px 14px", borderRadius: "8px",
      border: "1px solid #e0e0e0", fontSize: "14px",
      outline: "none", width: "100%", boxSizing: "border-box"
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      padding: "12px 16px", textAlign: "left",
      background: "#f8f9fa", color: "#666",
      fontSize: "13px", fontWeight: "600",
      borderBottom: "1px solid #eee"
    },
    td: {
      padding: "14px 16px", borderBottom: "1px solid #f0f0f0",
      fontSize: "14px", color: "#333"
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={{ fontSize: "24px" }}>⚙️</span>
          {sidebarOpen && (
            <div>
              <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>Admin Panel</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Voting System</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, paddingTop: "10px" }}>
          {SIDEBAR_ITEMS.map(item => (
            <div
              key={item.key}
              style={styles.sidebarItem(activeTab === item.key)}
              onClick={() => setActiveTab(item.key)}
            >
              <span style={{ fontSize: "18px", minWidth: "20px" }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </div>

        <div
          style={{ ...styles.sidebarItem(false), borderTop: "1px solid rgba(255,255,255,0.1)" }}
          onClick={logout}
        >
          <span style={{ fontSize: "18px", minWidth: "20px" }}>🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        {/* TOPBAR */}
        <div style={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
            >☰</button>
            <h5 style={{ margin: 0, fontWeight: "700", color: "#1a1a2e" }}>
              {SIDEBAR_ITEMS.find(i => i.key === activeTab)?.icon}{" "}
              {SIDEBAR_ITEMS.find(i => i.key === activeTab)?.label}
            </h5>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #e94560, #0f3460)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: "700"
            }}>
              {admin.name[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "14px" }}>{admin.name}</div>
              <div style={{ fontSize: "11px", color: "#999" }}>Administrator</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <div className="spinner-border text-primary" />
              <p style={{ marginTop: "16px", color: "#666" }}>Loading data...</p>
            </div>
          ) : (
            <>
              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <div>
                  <div className="row g-4 mb-4">
                    {[
                      { label: "Total Users", value: users.length, icon: "👥", color: "#4361ee" },
                      { label: "Total Candidates", value: candidates.length, icon: "🏛️", color: "#7209b7" },
                      { label: "Votes Cast", value: votes.length, icon: "🗳️", color: "#f72585" },
                      { label: "Turnout", value: users.length > 0 ? Math.round((votes.length / users.length) * 100) + "%" : "0%", icon: "📈", color: "#4cc9f0" },
                    ].map((s, i) => (
                      <div className="col-md-3 col-6" key={i}>
                        <div style={styles.statCard(s.color)}>
                          <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
                          <div style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</div>
                          <div style={{ color: "#888", fontSize: "13px" }}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Candidate standings */}
                  <div style={styles.card}>
                    <h6 style={{ fontWeight: "700", marginBottom: "20px" }}>🏆 Candidate Standings</h6>
                    {candidates.length === 0 ? (
                      <p style={{ color: "#999", textAlign: "center" }}>No candidates added yet.</p>
                    ) : (
                      candidates.sort((a, b) => b.votes - a.votes).map((c, i) => {
                        const total = candidates.reduce((sum, x) => sum + x.votes, 0);
                        const pct = total > 0 ? Math.round((c.votes / total) * 100) : 0;
                        return (
                          <div key={c._id} style={{ marginBottom: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                              <span style={{ fontWeight: "600" }}>{i + 1}. {c.name} <span style={{ color: "#888", fontWeight: "400" }}>({c.party})</span></span>
                              <span style={{ fontWeight: "700", color: "#4361ee" }}>{c.votes} votes ({pct}%)</span>
                            </div>
                            <div style={{ background: "#f0f0f0", borderRadius: "10px", height: "8px" }}>
                              <div style={{
                                width: `${pct}%`, height: "8px", borderRadius: "10px",
                                background: i === 0 ? "linear-gradient(90deg, #f72585, #7209b7)" : "linear-gradient(90deg, #4361ee, #4cc9f0)"
                              }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* CANDIDATES */}
              {activeTab === "candidates" && (
                <div>
                  <div style={styles.card}>
                    <h6 style={{ fontWeight: "700", marginBottom: "20px" }}>➕ Add New Candidate</h6>
                    <div className="row g-3">
                      <div className="col-md-5">
                        <input
                          style={styles.input}
                          placeholder="Candidate Full Name"
                          value={newCandidate.name}
                          onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
                        />
                      </div>
                      <div className="col-md-5">
                        <input
                          style={styles.input}
                          placeholder="Party Name"
                          value={newCandidate.party}
                          onChange={e => setNewCandidate({ ...newCandidate, party: e.target.value })}
                        />
                      </div>
                      <div className="col-md-2">
                        <button style={{ ...styles.btn("#4361ee"), width: "100%", padding: "10px" }} onClick={addCandidate}>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={styles.card}>
                    <h6 style={{ fontWeight: "700", marginBottom: "20px" }}>All Candidates ({candidates.length})</h6>
                    <div style={{ overflowX: "auto" }}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>#</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Party</th>
                            <th style={styles.th}>Votes</th>
                            <th style={styles.th}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidates.length === 0 ? (
                            <tr><td colSpan="5" style={{ ...styles.td, textAlign: "center", color: "#999" }}>No candidates yet.</td></tr>
                          ) : candidates.map((c, i) => (
                            <tr key={c._id}>
                              <td style={styles.td}>{i + 1}</td>
                              <td style={{ ...styles.td, fontWeight: "600" }}>{c.name}</td>
                              <td style={styles.td}>{c.party}</td>
                              <td style={styles.td}><span style={styles.badge("#4361ee")}>{c.votes}</span></td>
                              <td style={styles.td}>
                                <button style={styles.btn("#e94560")} onClick={() => deleteCandidate(c._id)}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS */}
              {activeTab === "users" && (
                <div style={styles.card}>
                  <h6 style={{ fontWeight: "700", marginBottom: "20px" }}>All Registered Users ({users.length})</h6>
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>#</th>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Voter ID</th>
                          <th style={styles.th}>Voted</th>
                          <th style={styles.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr><td colSpan="6" style={{ ...styles.td, textAlign: "center", color: "#999" }}>No users registered yet.</td></tr>
                        ) : users.map((u, i) => (
                          <tr key={u._id}>
                            <td style={styles.td}>{i + 1}</td>
                            <td style={{ ...styles.td, fontWeight: "600" }}>{u.name}</td>
                            <td style={styles.td}>{u.email}</td>
                            <td style={styles.td}>{u.voterId || <span style={{ color: "#ccc" }}>Not assigned</span>}</td>
                            <td style={styles.td}>
                              <span style={styles.badge(u.hasVoted ? "#2ecc71" : "#e0e0e0")}>
                                {u.hasVoted ? "✅ Voted" : "⏳ Pending"}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span style={styles.badge(u.isVerified ? "#4361ee" : "#f39c12")}>
                                {u.isVerified ? "Verified" : "Unverified"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VOTES */}
              {activeTab === "votes" && (
                <div style={styles.card}>
                  <h6 style={{ fontWeight: "700", marginBottom: "20px" }}>Vote Records — Users Who Voted ({votes.length})</h6>
                  <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>#</th>
                          <th style={styles.th}>Voter Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Voter ID</th>
                          <th style={styles.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {votes.length === 0 ? (
                          <tr><td colSpan="5" style={{ ...styles.td, textAlign: "center", color: "#999" }}>No votes cast yet.</td></tr>
                        ) : votes.map((v, i) => (
                          <tr key={v._id}>
                            <td style={styles.td}>{i + 1}</td>
                            <td style={{ ...styles.td, fontWeight: "600" }}>{v.name}</td>
                            <td style={styles.td}>{v.email}</td>
                            <td style={styles.td}>{v.voterId}</td>
                            <td style={styles.td}><span style={styles.badge("#2ecc71")}>✅ Vote Cast</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
