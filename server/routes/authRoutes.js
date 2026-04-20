const express = require("express");
const router = express.Router();
const User = require("../models/User");
const OTP = require("../models/OTP");
const AuditLog = require("../models/AuditLog");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { authenticateToken } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await AuditLog.create({
        action: "register_failed",
        email: email,
        status: "failed",
        reason: "Email already registered",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      voterId: `VID-${uuidv4().slice(0, 8).toUpperCase()}`
    });

    await user.save();

    // Log registration
    await AuditLog.create({
      action: "register_success",
      userId: user._id,
      email: user.email,
      status: "success",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: { id: user._id, name: user.name, email: user.email, voterId: user.voterId },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration error" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      await AuditLog.create({
        action: "login_failed",
        email: email,
        status: "failed",
        reason: "User not found",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if locked
    if (user.isLocked && user.lockedUntil > new Date()) {
      return res.status(403).json({ message: "Account locked. Try again later" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }
      await user.save();

      await AuditLog.create({
        action: "login_failed",
        userId: user._id,
        email: user.email,
        status: "failed",
        reason: "Invalid password",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });

      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.isLocked = false;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Log successful login
    await AuditLog.create({
      action: "login_success",
      userId: user._id,
      email: user.email,
      status: "success",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, voterId: user.voterId, isAdmin: user.isAdmin },
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error" });
  }
});

// ✅ REFRESH TOKEN
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Refresh token not found" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully"
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Token refresh error" });
  }
});

// ✅ REQUEST OTP (For email verification / password reset)
router.post("/request-otp", async (req, res) => {
  try {
    const { email, type = "email_verification" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create or update OTP
    await OTP.deleteMany({ email, type }); // Clear old OTPs
    const otpRecord = await OTP.create({
      email: email.toLowerCase(),
      otp,
      type,
      expiresAt
    });

    // TODO: In production, send OTP via email using nodemailer
    console.log(`OTP for ${email}: ${otp}`);

    await AuditLog.create({
      action: "otp_requested",
      email: email,
      status: "success",
      metadata: { type },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    // For development, return OTP (REMOVE IN PRODUCTION)
    res.json({
      message: "OTP sent to email",
      verificationToken: otpRecord.verificationToken,
      // otp: otp // REMOVE IN PRODUCTION
    });
  } catch (err) {
    console.error("Request OTP error:", err);
    res.status(500).json({ message: "OTP request error" });
  }
});

// ✅ VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, verificationToken, type = "email_verification" } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email: email.toLowerCase(), type });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.deleteOne();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= otpRecord.maxAttempts) {
        await otpRecord.deleteOne();
        return res.status(400).json({ message: "Too many attempts. Request new OTP" });
      }
      await otpRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    if (type === "email_verification") {
      // Update user email verification
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.isEmailVerified = true;
        await user.save();
      }
    }

    await AuditLog.create({
      action: "otp_verified",
      email: email,
      status: "success",
      metadata: { type },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "OTP verified successfully",
      verificationToken: otpRecord.verificationToken
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "OTP verification error" });
  }
});

// ✅ GET CURRENT USER
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -refreshTokens");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// ✅ LOGOUT
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findById(req.user.userId);
    if (user && refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save();
    }

    await AuditLog.create({
      action: "logout",
      userId: req.user.userId,
      status: "success",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout error" });
  }
});

module.exports = router;
