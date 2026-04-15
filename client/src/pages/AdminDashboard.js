import React, { useState, useEffect } from "react";
import apiClient from "../services/api";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      window.location.href = "/";
      return;
    }

    const currentUser = JSON.parse(stored);
    if (!currentUser.isAdmin) {
      window.location.href = "/";
      return;
    }

    setUser(currentUser);
    fetchUsers(currentUser);
  }, []);

  const fetchUsers = async (currentUser) => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/users?adminId=${currentUser._id}`);
      setUsers(res.data.users);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateVoterId = async (targetId, value) => {
    if (!value.trim()) {
      alert("Please enter a voter ID");
      return;
    }

    try {
      await apiClient.put(`/admin/user/${targetId}`, {
        adminId: user._id,
        voterId: value
      });
      fetchUsers(user);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to update voter ID");
    }
  };

  if (!user) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5 mb-5">
      <div className="text-center mb-5">
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Manage users and assign voter IDs.</p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <p>
            Signed in as <strong>{user.name}</strong> (<em>{user.email}</em>)
          </p>
          <p className="text-muted">Only admin accounts can access this page.</p>
        </div>
      </div>

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
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.voterId || "Not assigned"}</td>
                      <td>{u.isVerified ? "Yes" : "No"}</td>
                      <td>
                        <div className="input-group" style={{ maxWidth: "300px" }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Voter ID"
                            defaultValue={u.voterId}
                            id={`voter-${u._id}`}
                          />
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              const value = document.getElementById(`voter-${u._id}`).value;
                              updateVoterId(u._id, value);
                            }}
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
