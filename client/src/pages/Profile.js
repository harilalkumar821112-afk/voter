import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setName(storedUser.name);
      setProfilePic(storedUser.profilePic || "");
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/profile/${user._id}`, {
        name,
        profilePic
      });

      alert(res.data.message);
      // Update localStorage
      const updatedUser = { ...user, name, profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.log(err);
      alert("Error updating profile: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Edit Profile</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <img
                  src={profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email}
                  disabled
                />
                <small className="text-muted">Email cannot be changed</small>
              </div>

              <button className="btn btn-primary w-100" onClick={updateProfile}>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;