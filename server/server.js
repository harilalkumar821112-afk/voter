const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-ratelimit");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const electionRoutes = require("./routes/electionRoutes");
const advancedVoteRoutes = require("./routes/advancedVoteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// ✅ DATABASE CONNECT — cached for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn("⚠️  MONGO_URI not found");
    return;
  }
  try {
    await mongoose.connect(mongoUri, {
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

// DB middleware for API routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

// ✅ ADVANCED API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/votes", advancedVoteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Advanced Voting API Running", dbConnected: isConnected });
});

app.get("/", (req, res) => {
  res.json({ message: "✅ Advanced Online Voting System API v2.0 Running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Advanced Voting Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

module.exports = app;
