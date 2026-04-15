import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../services/api";
import voteImg from "./image/voting.png";
import voteforfuture from "./image/voteforfuture.webp";
import votephone from "./image/votephone.png";

// Free election images from Unsplash (no attribution required)
const ELECTION_IMGS = {
  hero: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&q=80",
  ballot: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=600&q=80",
  democracy: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80",
  vote: "https://images.unsplash.com/photo-1568027762272-e4da8b386fe9?w=600&q=80",
  india: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80",
};

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
    { icon: "🔒", title: "Secure Voting", desc: "End-to-end encrypted voting ensuring your vote is safe and tamper-proof.", color: "#4361ee" },
    { icon: "⚡", title: "Real-time Results", desc: "Watch live election results as votes are counted instantly.", color: "#f72585" },
    { icon: "📱", title: "Mobile Friendly", desc: "Vote from anywhere using your smartphone, tablet, or desktop.", color: "#7209b7" },
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

      {/* ===== HERO ===== */}
      <div style={{
        position: "relative", minHeight: "95vh",
        display: "flex", alignItems: "center", overflow: "hidden"
      }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${ELECTION_IMGS.hero})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.3)"
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(15,12,41,0.95) 0%, rgba(48,43,99,0.85) 50%, rgba(36,36,62,0.9) 100%)"
        }} />

        {/* Floating blobs */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-white">
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "30px", padding: "8px 20px",
                fontSize: "13px", color: "#a5b4fc",
                marginBottom: "24px", letterSpacing: "1px"
              }}>
                🇮🇳 INDIA'S DIGITAL ELECTION PLATFORM
              </div>
              <h1 style={{ fontSize: "clamp(38px, 5vw, 68px)", fontWeight: "900", lineHeight: "1.1", marginBottom: "24px" }}>
                Your Vote,<br />
                <span style={{ background: "linear-gradient(90deg, #818cf8, #f472b6, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Your Future
                </span>
              </h1>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", marginBottom: "40px", lineHeight: "1.8" }}>
                Participate in India's most secure and transparent digital voting platform.
                Every vote counts. Make yours matter.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <Link to={user ? "/vote" : "/register"} style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white", padding: "16px 36px",
                  borderRadius: "50px", textDecoration: "none",
                  fontWeight: "700", fontSize: "16px",
                  boxShadow: "0 8px 30px rgba(99,102,241,0.5)"
                }}>
                  {user ? "🗳️ Vote Now" : "📝 Register to Vote"}
                </Link>
                <Link to="/result" style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "white", padding: "16px 36px",
                  borderRadius: "50px", textDecoration: "none",
                  fontWeight: "600", fontSize: "16px",
                  backdropFilter: "blur(10px)"
                }}>
                  📊 Live Results
                </Link>
              </div>

              {stats && (
                <div style={{ display: "flex", gap: "40px", marginTop: "52px", flexWrap: "wrap" }}>
                  {[
                    { label: "Candidates", value: stats.totalCandidates, icon: "🏛️" },
                    { label: "Votes Cast", value: stats.totalVotes, icon: "🗳️" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "28px" }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: "30px", fontWeight: "900", color: "white", lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hero Right Image */}
            <div className="col-lg-6 d-none d-lg-block">
              <div style={{ position: "relative" }}>
                <img src={voteforfuture} alt="Vote for Future"
                  style={{ width: "100%", borderRadius: "24px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
                {/* Floating badge */}
                <div style={{
                  position: "absolute", bottom: "-20px", left: "-20px",
                  background: "white", borderRadius: "16px",
                  padding: "16px 20px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  display: "flex", alignItems: "center", gap: "12px"
                }}>
                  <span style={{ fontSize: "32px" }}>🗳️</span>
                  <div>
                    <div style={{ fontWeight: "800", color: "#1a1a2e", fontSize: "16px" }}>Secure Voting</div>
                    <div style={{ color: "#888", fontSize: "12px" }}>100% Encrypted</div>
                  </div>
                </div>
                <div style={{
                  position: "absolute", top: "-20px", right: "-20px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  borderRadius: "16px", padding: "16px 20px",
                  boxShadow: "0 10px 40px rgba(99,102,241,0.4)",
                  color: "white", textAlign: "center"
                }}>
                  <div style={{ fontSize: "28px", fontWeight: "900" }}>🇮🇳</div>
                  <div style={{ fontSize: "12px", marginTop: "4px" }}>Digital India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== AWARENESS SECTION ===== */}
      <div style={{ background: "#fff", padding: "80px 0" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div style={{ position: "relative" }}>
                <img src={ELECTION_IMGS.democracy} alt="Democracy"
                  style={{ width: "100%", borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "24px",
                  background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))"
                }} />
              </div>
            </div>
            <div className="col-lg-6">
              <span style={{ color: "#6366f1", fontWeight: "700", fontSize: "13px", letterSpacing: "2px" }}>
                DIGITAL VOTING AWARENESS
              </span>
              <h2 style={{ fontWeight: "800", fontSize: "38px", marginTop: "12px", lineHeight: "1.2", color: "#1a1a2e" }}>
                Empowering Every<br />
                <span style={{ background: "linear-gradient(90deg, #6366f1, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Indian Citizen
                </span>
              </h2>
              <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.8", margin: "20px 0 32px" }}>
                This initiative promotes digital voting awareness and encourages citizens to participate actively in the election process. Your vote is your right — exercise it with confidence.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {["Secure & tamper-proof voting system", "Real-time vote counting & results", "Accessible from any device, anywhere"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", flexShrink: 0 }}>✓</div>
                    <span style={{ color: "#444", fontSize: "15px" }}>{item}</span>
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
            <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "700", fontSize: "14px", letterSpacing: "2px" }}>HOW IT WORKS</span>
            <h2 style={{ fontWeight: "800", fontSize: "38px", marginTop: "8px", color: "#1a1a2e" }}>Vote in 4 Simple Steps</h2>
          </div>
          <div className="row g-4">
            {steps.map((s, i) => (
              <div className="col-md-3 col-6" key={i}>
                <div style={{ background: "white", borderRadius: "20px", padding: "32px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden", transition: "transform 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ position: "absolute", top: "-15px", right: "-10px", fontSize: "70px", opacity: "0.05", fontWeight: "900", color: s.color }}>{s.step}</div>
                  <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "30px" }}>{s.icon}</div>
                  <h5 style={{ fontWeight: "700", color: s.color }}>{s.title}</h5>
                  <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== VOTE IMAGE BANNER ===== */}
      <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
        <img src={ELECTION_IMGS.vote} alt="Voting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(99,102,241,0.85), rgba(236,72,153,0.85))", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "white", textAlign: "center", padding: "20px" }}>
          <h2 style={{ fontWeight: "900", fontSize: "clamp(28px, 4vw, 52px)", marginBottom: "16px" }}>
            Democracy in Action 🗳️
          </h2>
          <p style={{ fontSize: "18px", opacity: 0.9, maxWidth: "600px", marginBottom: "32px" }}>
            Every vote shapes the future of our nation. Be part of the change.
          </p>
          <Link to={user ? "/vote" : "/register"} style={{ background: "white", color: "#6366f1", padding: "14px 40px", borderRadius: "50px", textDecoration: "none", fontWeight: "800", fontSize: "16px" }}>
            {user ? "🗳️ Cast Your Vote" : "📝 Join Now — It's Free"}
          </Link>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div style={{ padding: "80px 0", background: "white" }}>
        <div className="container">
          <div className="text-center mb-5">
            <span style={{ background: "linear-gradient(135deg, #f72585, #7209b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "700", fontSize: "14px", letterSpacing: "2px" }}>FEATURES</span>
            <h2 style={{ fontWeight: "800", fontSize: "38px", marginTop: "8px", color: "#1a1a2e" }}>Why Choose Our Platform?</h2>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-lg-4 col-md-6" key={i}>
                <div style={{ padding: "28px", borderRadius: "20px", border: "1px solid #f0f0f0", transition: "all 0.3s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px ${f.color}25`; e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "16px" }}>{f.icon}</div>
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
              <span style={{ color: "#a5b4fc", fontWeight: "700", fontSize: "14px", letterSpacing: "2px" }}>CURRENT ELECTION</span>
              <h2 style={{ fontWeight: "800", fontSize: "38px", color: "white", marginTop: "8px" }}>Meet the Candidates</h2>
            </div>
            <div className="row g-4 justify-content-center">
              {candidates.slice(0, 4).map((c, i) => (
                <div className="col-lg-3 col-md-6" key={c._id}>
                  <div style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "28px", textAlign: "center", color: "white", transition: "transform 0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: `linear-gradient(135deg, ${["#6366f1", "#f72585", "#7209b7", "#f77f00"][i % 4]}, ${["#8b5cf6", "#ec4899", "#a855f7", "#fb923c"][i % 4]})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>👤</div>
                    <h5 style={{ fontWeight: "700", marginBottom: "6px" }}>{c.name}</h5>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>{c.party}</p>
                    <div style={{ marginTop: "12px", background: "rgba(255,255,255,0.1)", borderRadius: "20px", padding: "4px 14px", display: "inline-block", fontSize: "12px" }}>{c.votes} votes</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link to={user ? "/vote" : "/login"} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", padding: "16px 44px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "16px", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
                🗳️ Cast Your Vote Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== PHONE MOCKUP SECTION ===== */}
      <div style={{ background: "#f8f9ff", padding: "80px 0" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span style={{ color: "#f72585", fontWeight: "700", fontSize: "13px", letterSpacing: "2px" }}>MOBILE VOTING</span>
              <h2 style={{ fontWeight: "800", fontSize: "38px", marginTop: "12px", color: "#1a1a2e", lineHeight: "1.2" }}>
                Vote From<br />
                <span style={{ background: "linear-gradient(90deg, #f72585, #7209b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Anywhere, Anytime
                </span>
              </h2>
              <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.8", margin: "20px 0 32px" }}>
                Our platform is fully optimized for mobile devices. Cast your vote securely from the comfort of your home using any device.
              </p>
              <div className="row g-3">
                {[
                  { icon: "📱", title: "Mobile App", desc: "Works on all devices" },
                  { icon: "🔐", title: "Secure Login", desc: "Protected access" },
                  { icon: "⚡", title: "Instant", desc: "Real-time updates" },
                ].map((item, i) => (
                  <div className="col-4" key={i}>
                    <div style={{ background: "white", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize: "24px" }}>{item.icon}</div>
                      <div style={{ fontWeight: "700", fontSize: "13px", marginTop: "8px" }}>{item.title}</div>
                      <div style={{ color: "#888", fontSize: "11px" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <img src={votephone} alt="Vote Phone" style={{ width: "100%", borderRadius: "20px", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }} />
                </div>
                <div className="col-6" style={{ paddingTop: "40px" }}>
                  <img src={voteImg} alt="Voting" style={{ width: "100%", borderRadius: "20px", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src={ELECTION_IMGS.ballot} alt="Ballot" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.2)" }} />
        <div style={{ position: "relative", background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(236,72,153,0.9))", padding: "100px 0", textAlign: "center", color: "white" }}>
          <div className="container">
            <h2 style={{ fontWeight: "900", fontSize: "clamp(32px, 4vw, 52px)", marginBottom: "16px" }}>
              Ready to Make Your Voice Heard?
            </h2>
            <p style={{ fontSize: "18px", opacity: 0.85, marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
              Join thousands of citizens participating in India's digital democracy.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              {!user ? (
                <>
                  <Link to="/register" style={{ background: "white", color: "#6366f1", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", fontWeight: "800", fontSize: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.2)" }}>
                    📝 Register Now
                  </Link>
                  <Link to="/login" style={{ background: "rgba(255,255,255,0.15)", border: "2px solid white", color: "white", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", fontWeight: "700", fontSize: "16px" }}>
                    🔑 Login
                  </Link>
                </>
              ) : (
                <Link to="/vote" style={{ background: "white", color: "#6366f1", padding: "16px 40px", borderRadius: "50px", textDecoration: "none", fontWeight: "800", fontSize: "16px" }}>
                  🗳️ Vote Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
