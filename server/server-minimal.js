const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let dbConnected = false;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    dbConnected = true;
    console.log("✅ Database Connected");
  } catch (err) {
    console.error("❌ Database Error:", err.message);
  }
};

connectDB();

// Test Routes
app.get("/", (req, res) => {
  res.json({ message: "✅ API Running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", db: dbConnected });
});

app.post("/api/test", (req, res) => {
  res.json({ message: "POST working", body: req.body });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "GET working" });
});

// Import routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Not found", path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
