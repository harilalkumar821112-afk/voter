import React from "react";
import { Link } from "react-router-dom";
import votephone from "./image/votephone.png";
import votephone1 from "./image/votephone1.png";
import modijii from "./image/modijii.jpg";
import voteforfuture from "./image/voteforfuture.webp"; // ✅ FIX

function Home() {

  // ✅ SAFE USER
  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      user = JSON.parse(stored);
    }
  } catch {
    user = null;
  }

  return (
    <div>

      {/* HERO */}
      <div className="bg-primary text-white py-5 px-3" style={{
        background: "linear-gradient(90deg,#8e2de2,#4a00e0)"
      }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold">Online Voting Portal</h1>
              <p className="lead">Secure Digital Platform For Elections</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MODI LEFT - TEXT CENTER - IMAGE RIGHT */}
      <div className="container mt-5">
        <div className="row align-items-center justify-content-center g-4">

          {/* LEFT IMAGE */}
          <div className="col-lg-4 col-md-6 col-12 text-center">
            <img
             src={modijii}
              className="img-fluid rounded shadow"
              alt="Vote For Future"
              style={{
                maxWidth: "100%",
                height: "auto",
                boxShadow: "0 5px 15px rgba(27, 234, 31, 0.3)"
              }}
            />
          </div>

          {/* CENTER TEXT */}
          <div className="col-lg-4 col-md-12 col-12 text-center">
            <h2 className="h3 mb-3">Digital Voting Awareness</h2>
            <p className="mb-0">
              This initiative promotes digital voting awareness and encourages
              citizens to participate actively in the election process.
            </p>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-4 col-md-6 col-12 text-center">
            <img
              src={voteforfuture}
              className="img-fluid rounded shadow"
              alt="Vote For Future"
              style={{
                maxWidth: "100%",
                height: "auto",
                boxShadow: "0 5px 15px rgba(27, 234, 31, 0.3)"
              }}
            />
          </div>

        </div>
      </div>

      {/* PHONES */}
      <div className="container mt-5">
        <div className="row justify-content-center g-3">
          <div className="col-lg-6 col-md-8 col-12 text-center">
            <img src={votephone} className="img-fluid mb-3" alt="Voting App" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
          <div className="col-lg-6 col-md-8 col-12 text-center">
            <img src={votephone1} className="img-fluid mb-3" alt="Voting Mobile" style={{ maxWidth: "100%", height: "auto" }} />
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="container mt-5 pb-5">
        <h2 className="text-center mb-4 h3">Voter Services</h2>

        <div className="row g-4">

          <div className="col-lg-4 col-md-6 col-12">
            <Link to={user ? "/register" : "/login"} style={{ textDecoration: "none", color: "black" }}>
              <div className="card shadow p-4 h-100 text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" className="img-fluid mb-3" style={{ maxWidth: "80px", height: "auto" }} alt="Register" />
                <h5 className="card-title">Register Voter</h5>
              </div>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <Link to={user ? "/search" : "/login"} style={{ textDecoration: "none", color: "black" }}>
              <div className="card shadow p-4 h-100 text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/751/751463.png" className="img-fluid mb-3" style={{ maxWidth: "80px", height: "auto" }} alt="Search" />
                <h5 className="card-title">Search Electoral Roll</h5>
              </div>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <Link to={user ? "/result" : "/login"} style={{ textDecoration: "none", color: "black" }}>
              <div className="card shadow p-4 h-100 text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" className="img-fluid mb-3" style={{ maxWidth: "80px", height: "auto" }} alt="Results" />
                <h5 className="card-title">Election Results</h5>
              </div>
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;