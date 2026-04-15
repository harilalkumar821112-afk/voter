import React, { useState, useEffect } from "react";
import apiClient from "../services/api";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [addingCandidate, setAddingCandidate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { window.location.href = "/"; return; }
    const currentUser = JSON.parse(stored);
    if (!currentUser.isAdmin) { window.location.href = "/"; return; }
    setUser(currentUser);
    fetchUsers(currentUser);
    fetchCandidates();
  }, []);

  const fetchUsers = async (currentUser) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/users?adminId=${currentUser._id}`);
      setUsers(res.data.users);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await apiClient.get("/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addCandidate = async () => {
    if (!newCandidate.name.trim() || !newCandidate.party.trim()) {
      alert("Please enter candidate name and party");
      return;
    }
    setAddingCandidate(true);
    try {
      await apiClient.post("/addCandidate", newCandidate);
      setNewCandidate({ name: "", party: "" });
      fetchCandidates();
      alert("Candidate added successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding candidate");
    } finally {
      setAddingCandidate(false);
    }
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      await apiClient.delete(`/candidate/${id}`);
      fetchCandidates();
    } catch (err) {
      alert("Error deleting candidate");
    }
  };

  const updateVoterId = async (targetId, value) => {
    if (!value.trim()) { alert("Please enter a voter ID"); return; }
    try {
      await apiClient.put(`/admin/user/${targetId}`, { adminId: user._id, voterId: value });
      fetchUsers(user);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to update voter ID");
    }
  };

  if (!user) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-4">
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Manage users and candidates</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "candidates" ? "active" : ""}`}
            onClick={() => setActiveTab("candidates")}
          >
            🗳️ Candidates ({candidates.length})
          </button>
        </li>
      </ul>

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h5 className="mb-0">Registered Users</h5>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="p-4 text-center">Loading users...</div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Voter ID</th>
                      <th>Voted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.voterId || "Not assigned"}</td>
                        <td>{u.hasVoted ? "✅ Yes" : "❌ No"}</td>
                        <td>
                          <div className="input-group" style={{ maxWidth: "280px" }}>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Voter ID"
                              defaultValue={u.voterId}
                              id={`voter-${u._id}`}
                            />
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                const val = document.getElementById(`voter-${u._id}`).value;
                                updateVoterId(u._id, val);
                              }}
                            >
                              Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CANDIDATES TAB */}
      {activeTab === "candidates" && (
        <div>
          {/* Add Candidate Form */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">➕ Add New Candidate</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Candidate Name"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Party Name"
                    value={newCandidate.party}
                    onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-success w-100"
                    onClick={addCandidate}
                    disabled={addingCandidate}
                  >
                    {addingCandidate ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">All Candidates</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Party</th>
                      <th>Votes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c, i) => (
                      <tr key={c._id}>
                        <td>{i + 1}</td>
                        <td>{c.name}</td>
                        <td>{c.party}</td>
                        <td><span className="badge bg-primary">{c.votes}</span></td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteCandidate(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {candidates.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4">No candidates yet. Add one above.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
