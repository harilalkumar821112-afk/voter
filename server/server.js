const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();

// middleware - enable CORS for all origins
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", userRoutes);
app.use("/api", candidateRoutes);
app.use("/api", voteRoutes);

// ✅ DATABASE CONNECT
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.warn("⚠️  MONGO_URI not found in environment variables");
} else {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>console.log("✅ MongoDB Atlas Connected"))
  .catch(err=>console.error("❌ MongoDB connection failed:", err.message));
}

// test route
app.get("/",(req,res)=>{
  res.send("✅ Voting API Running");
});

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`🚀 Server running on port ${PORT}`);
});