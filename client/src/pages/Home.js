import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/api";

function Home() {
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") user = JSON.parse(stored);
  } catch { user = null; }

  useEffect(() => {
    apiClient.get("/stats").then(res => setStats(res.data)).catch(() => { });
    apiClient.get("/candidates").then(res => setCandidates(res.data)).catch(() => { });
  }, []);

  const features = [
    { icon: "🔒", title: "Secure Voting", desc: "End-to-end encrypted voting system ensuring your vote is safe and tamper-proof.", color: "#4361ee" },
    { icon: "⚡", title: "Real-time Results", desc: "Watch live election results as votes are counted instantly across the platform.", color: "#f72585" },
    { icon: "📱", title: "Mobile Friendly", desc: "Vote from anywhere using your smartphone, tablet, or desktop computer.", color: "#7209b7" },
    { icon: "🪪", title: "Voter ID System", desc: "Unique voter ID for every registered citizen to prevent duplicate voting.", color: "#4cc9f0" },
    { icon: "📊", title: "Live Statistics", desc: "Transparent election statistics available to all registered voters.", color: "#f77f00" },
    { icon: "🏛️", title: "Democratic Process", desc: "Supporting India's democratic values with a modern digital platform.", color: "#2ecc71" },
  ];

  const steps = [
    { step: "01", title: "Register", desc: "Create your account with your Voter ID", icon: "📝", color: "#4361ee" },
    { step: "02", title: "Verify", desc: "Get verified by the election commission", icon: "✅", color: "#7209b7" },
    { step: "03", title: "Vote", desc: "Cast your vote for your chosen candidate", icon: "🗳️", color: "#f72585" },
    { step: "04", title: "Results", desc: "View live results after voting closes", icon: "📊", color: "#f77f00" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>

      {/* ===== HERO SECTION ===== */}
      <div style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        minHeight: "92vh",
        display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden"
      }}>
        {/* Animated background circles */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${150 + i * 80}px`, height: `${150 + i * 80}px`,
            borderRadius: "50%",
            background: `rgba(${i % 2 === 0 ? "99,102,241" : "236,72,153"},0.08)`,
            top: `${10 + i * 15}%`, left: `${i * 20}%`,
            animation: `pulse ${3 + i}s ease-in-out infinite alternate`,
            pointerEvents: "none"
          }} />
        ))}

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <div style={{
                display: "inline-block",
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "30px", padding: "6px 18px",
                fontSize: "13px", color: "#a5b4fc",
                marginBottom: "20px", letterSpacing: "1px"
              }}>
                🇮🇳 INDIA'S DIGITAL ELECTION PLATFORM
              </div>
              <h1 style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: "800", lineHeight: "1.15",
                marginBottom: "20px"
              }}>
                Your Vote,<br />
                <span style={{
                  background: "linear-gradient(90deg, #818cf8, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>Your Future</span>
              </h1>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", marginBottom: "36px", lineHeight: "1.7" }}>
                Participate in India's most secure and transparent digital voting platform.
                Every vote counts. Make yours matter.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link to={user ? "/vote" : "/register"} style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white", padding: "14px 32px",
                  borderRadius: "50px", textDecoration: "none",
                  fontWeight: "700", fontSize: "16px",
                  boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
                  transition: "transform 0.2s"
                }}>
                  {user ? "🗳️ Vote Now" : "📝 Register to Vote"}
                </Link>
                <Link to="/result" style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white", padding: "14px 32px",
                  borderRadius: "50px", textDecoration: "none",
                  fontWeight: "600", fontSize: "16px",
                  backdropFilter: "blur(10px)"
                }}>
                  📊 View Results
                </Link>
              </div>

              {/* Live stats */}
              {stats && (
                <div style={{ display: "flex", gap: "32px", marginTop: "48px", flexWrap: "wrap" }}>
                  {[
                    { label: "Candidates", value: stats.totalCandidates },
                    { label: "Votes Cast", value: stats.totalVotes },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ fontSize: "28px", fontWeight: "800", color: "white" }}>{s.value}</div>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hero Right — Floating Cards */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center" style={{ position: "relative" }}>
              <div style={{ position: "relative", width: "400px", height: "400px" }}>
                {/* Center circle */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "180px", height: "180px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "70px", boxShadow: "0 20px 60px rgba(99,102,241,0.5)"
                }}>🗳️</div>

                {/* Orbiting items */}
                {[
                  { icon: "🔒", label: "Secure", top: "5%", left: "50%", color: "#4361ee" },
                  { icon: "⚡", label: "Fast", top: "50%", left: "85%", color: "#f72585" },
                  { icon: "🪪", label: "Verified", top: "85%", left: "50%", color: "#7209b7" },
                  { icon: "📊", label: "Live", top: "50%", left: "5%", color: "#f77f00" },
                ].map((item, i) => (
                  <div key={i} style={{
                    position: "absolute", top: item.top, left: item.left,
                    transform: "translate(-50%,-50%)",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "16px", padding: "14px 18px",
                    textAlign: "center", color: "white",
                    boxShadow: `0 8px 25px rgba(0,0,0,0.3)`
                  }}>
                    <div style={{ fontSize: "24px" }}>{item.icon}</div>
                    <div style={{ fontSize: "12px", marginTop: "4px" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div style={{ background: "#f8f9ff", padding: "80px 0" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontWeight: "700", fontSize: "14px", letterSpacing: "2px"
            }}>HOW IT WORKS</span>
            <h2 style={{ fontWeight: "800", fontSize: "36px", marginTop: "8px" }}>
              Vote in 4 Simple Steps
            </h2>
          </div>
          <div className="row g-4">
            {steps.map((s, i) => (
              <div className="col-md-3 col-6" key={i}>
                <div style={{
                  background: "white", borderRadius: "20px",
                  padding: "30px 20px", textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  position: "relative", overflow: "hidden",
                  transition: "transform 0.3s",
                  cursor: "default"
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{
                    position: "absolute", top: "-10px", right: "-10px",
                    fontSize: "60px", opacity: "0.06", fontWeight: "900"
                  }}>{s.step}</div>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: `${s.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px", fontSize: "28px"
                  }}>{s.icon}</div>
                  <h5 style={{ fontWeight: "700", color: s.color }}>{s.title}</h5>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div style={{ padding: "80px 0", background: "white" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{
              background: "linear-gradient(135deg, #f72585, #7209b7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontWeight: "700", fontSize: "14px", letterSpacing: "2px"
            }}>FEATURES</span>
            <h2 style={{ fontWeight: "800", fontSize: "36px", marginTop: "8px" }}>
              Why Choose Our Platform?
            </h2>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div style={{
                  padding: "28px", borderRadius: "20px",
                  border: "1px solid #f0f0f0",
                  transition: "all 0.3s", cursor: "default",
                  background: "white"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}25`;
                    e.currentTarget.style.borderColor = f.color;
                    e.currentTarget.style.transform = "translateY(-6px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#f0f0f0";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    background: `${f.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "26px", marginBottom: "16px"
                  }}>{f.icon}</div>
                  <h5 style={{ fontWeight: "700", color: "#1a1a2e" }}>{f.title}</h5>
                  <p style={{ color: "#888", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CANDIDATES PREVIEW ===== */}
      {candidates.length > 0 && (
        <div style={{ background: "linear-gradient(135deg, #0f0c29, #302b63)", padding: "80px 0" }}>
          <div className="container">
            <div className="text-center mb-5">
              <span style={{ color: "#a5b4fc", fontWeight: "700", fontSize: "14px", letterSpacing: "2px" }}>
                CURRENT ELECTION
              </span>
              <h2 style={{ fontWeight: "800", fontSize: "36px", color: "white", marginTop: "8px" }}>
                Meet the Candidates
              </h2>
            </div>
            <div className="row g-4 justify-content-center">
              {candidates.slice(0, 4).map((c, i) => (
                <div className="col-lg-3 col-md-6" key={c._id}>
                  <div style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px", padding: "28px",
                    textAlign: "center", color: "white",
                    transition: "transform 0.3s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{
                      width: "70px", height: "70px", borderRadius: "50%",
                      background: `linear-gradient(135deg, ${["#6366f1", "#f72585", "#7209b7", "#f77f00"][i % 4]}, ${["#8b5cf6", "#ec4899", "#a855f7", "#fb923c"][i % 4]})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 16px", fontSize: "28px"
                    }}>👤</div>
                    <h5 style={{ fontWeight: "700", marginBottom: "6px" }}>{c.name}</h5>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>{c.party}</p>
                    <div style={{
                      marginTop: "12px",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "20px", padding: "4px 14px",
                      display: "inline-block", fontSize: "12px"
                    }}>
                      {c.votes} votes
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to={user ? "/vote" : "/login"} style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white", padding: "14px 40px",
                borderRadius: "50px", textDecoration: "none",
                fontWeight: "700", fontSize: "16px",
                boxShadow: "0 8px 25px rgba(99,102,241,0.4)"
              }}>
                🗳️ Cast Your Vote Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== CTA SECTION ===== */}
      <div style={{
        background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
        padding: "80px 0", textAlign: "center", color: "white"
      }}>
        <div className="container">
          <h2 style={{ fontWeight: "800", fontSize: "40px", marginBottom: "16px" }}>
            Ready to Make Your Voice Heard?
          </h2>
          <p style={{ fontSize: "18px", opacity: 0.85, marginBottom: "36px" }}>
            Join thousands of citizens participating in India's digital democracy.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {!user ? (
              <>
                <Link to="/register" style={{
                  background: "white", color: "#6366f1",
                  padding: "14px 36px", borderRadius: "50px",
                  textDecoration: "none", fontWeight: "700", fontSize: "16px"
                }}>📝 Register Now</Link>
                <Link to="/login" style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "2px solid white",
                  color: "white", padding: "14px 36px",
                  borderRadius: "50px", textDecoration: "none",
                  fontWeight: "700", fontSize: "16px"
                }}>🔑 Login</Link>
              </>
            ) : (
              <Link to="/vote" style={{
                background: "white", color: "#6366f1",
                padding: "14px 36px", borderRadius: "50px",
                textDecoration: "none", fontWeight: "700", fontSize: "16px"
              }}>🗳️ Vote Now</Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          from { transform: scale(1); opacity: 0.5; }
          to { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default Home;
