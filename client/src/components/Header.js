import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Header() {

let user = null;
const [unreadCount, setUnreadCount] = useState(0);

// ✅ SAFE PARSE (error fix)
try {
  user = JSON.parse(localStorage.getItem("user"));
} catch {
  user = null;
}

const userId = user?._id || null;

useEffect(() => {
  if (!userId) return;
  axios.get(`http://localhost:5000/api/notifications/${userId}`)
    .then(res => {
      const notifications = res.data.notifications || [];
      setUnreadCount(notifications.filter(n => !n.read).length);
    })
    .catch(() => {
      setUnreadCount(0);
    });
}, [userId]);

return (

<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">

<div className="container">

<Link className="navbar-brand" to="/">
Online Voting
</Link>



<button
className="navbar-toggler"
data-bs-toggle="collapse"
data-bs-target="#menu"
>
<span className="navbar-toggler-icon"></span>
</button>

<div className="collapse navbar-collapse" id="menu">

<ul className="navbar-nav ms-auto">

<li className="nav-item">
<Link className="nav-link" to="/">Home</Link>
</li>

{/* ✅ SHOW ONLY IF LOGIN */}
{user && (
<>

<li className="nav-item dropdown">
<span className="nav-link dropdown-toggle" data-bs-toggle="dropdown" style={{cursor:"pointer"}}>
Voters
</span>

<div className="dropdown-menu p-4" style={{minWidth: "300px", maxWidth: "600px", width: "90vw"}}>

<div className="row">

<div className="col-md-6">
<h6>Voter Services</h6>

<Link className="dropdown-item" to="/register">Register in Electoral Roll</Link>
<Link className="dropdown-item" to="/search">Search Electoral Roll</Link>
<Link className="dropdown-item" to="/download">Download E-EPIC</Link>
<Link className="dropdown-item" to="/complaint">Register Complaint</Link>

</div>

<div className="col-md-6">
<h6>Voting Information</h6>

<Link className="dropdown-item" to="/vote">Vote Now</Link>
<Link className="dropdown-item" to="/result">Election Results</Link>
<Link className="dropdown-item" to="/vote">Candidate List</Link>

</div>

</div>

</div>
</li>

<li className="nav-item dropdown">
<span className="nav-link dropdown-toggle" data-bs-toggle="dropdown" style={{cursor:"pointer"}}>
Election Management
</span>

<div className="dropdown-menu">
<Link className="dropdown-item" to="/current-election">Current Elections</Link>
<Link className="dropdown-item" to="/past-election">Past Elections</Link>
<Link className="dropdown-item" to="/statistics">Election Statistics</Link>
</div>
</li>
</>
)}

{/* ❌ SHOW ONLY IF NOT LOGIN */}
{!user && (
<>
<li className="nav-item">
<Link className="nav-link" to="/login">Login</Link>
</li>

<li className="nav-item">
<Link className="nav-link" to="/register">Signup</Link>
</li>
</>
)}

{/* ✅ USER NAME + LOGOUT */}
{user && (
<>
{user.isAdmin && (
<li className="nav-item">
<Link className="nav-link" to="/admin">Admin</Link>
</li>
)}
<li className="nav-item">
<Link className="nav-link" to="/notifications">
🔔 Notifications{unreadCount > 0 ? ` (${unreadCount})` : ""}
</Link>
</li>
<li className="nav-item">
<Link className="nav-link" to="/profile">
👤 Profile
</Link>
</li>

<li className="nav-item">
<span className="nav-link text-warning">
{user.name}
</span>
</li>

<li className="nav-item">
<button
className="btn btn-danger ms-2"
onClick={()=>{
localStorage.removeItem("user");
window.location.href="/login";
}}
>
Logout
</button>
</li>
</>
)}

</ul>

</div>

</div>

</nav>

);

}

export default Header;