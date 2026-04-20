const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const electionRoutes = require("./routes/electionRoutes");
const advancedVoteRoutes = require("./routes/advancedVoteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

// ============ MIDDLEWARE ============
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Rate limiting (applied only to /api routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use("/api/", limiter);

// ============ DATABASE CONNECTION ============
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("✅ MongoDB Atlas Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    isConnected = false;
  }
};

connectDB();

// ============ ROUTES ============

// Root
app.get("/", (req, res) => {
  res.json({ message: "✅ Voting API Running" });
});

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running", dbConnected: isConnected });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/votes", advancedVoteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// ============ ERROR HANDLING ============

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Advanced Voting Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
