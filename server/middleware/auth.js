const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Authentication error" });
  }
};

// Middleware to verify admin
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Authorization error" });
  }
};

// Middleware to verify email
const requireEmailVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isEmailVerified) {
      return res.status(403).json({ message: "Email verification required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Verification check error" });
  }
};

// Optional auth - sets req.user if token is valid
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }
    next();
  } catch (err) {
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireEmailVerified,
  optionalAuth
};
