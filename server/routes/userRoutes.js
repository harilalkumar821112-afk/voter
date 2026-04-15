const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// ✅ REGISTER
router.post("/register", async (req, res) => {

  try {

    const { name, email, password, voterId } = req.body;

    // 🔹 check empty
    if (!name || !email || !password || !voterId) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔹 check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔹 check duplicate voterId
    const existingVoter = await User.findOne({ voterId });
    if (existingVoter) {
      return res.status(400).json({ message: "Voter ID already taken" });
    }

    // 🔹 create user with provided voterId
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      voterId,
      isAdmin: false,
      hasVoted: false   // 🔥 important for voting system
    });

    await user.save();

    res.json({ message: "User Registered Successfully", voterId });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Error registering user" });

  }

});


// ✅ LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    // 🔹 check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 check password
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Server error" });

  }

});

// ✅ ADMIN: LIST USERS
router.get("/admin/users", async (req, res) => {
  try {
    const adminId = req.query.adminId;
    if (!adminId) return res.status(401).json({ message: "Admin access required" });

    const adminUser = await User.findById(adminId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ ADMIN: ASSIGN VOTER ID
router.put("/admin/user/:id", async (req, res) => {
  try {
    const adminId = req.body.adminId;
    const { id } = req.params;
    const { voterId, isVerified } = req.body;

    if (!adminId) return res.status(401).json({ message: "Admin access required" });
    const adminUser = await User.findById(adminId);
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (voterId) {
      const existing = await User.findOne({ voterId, _id: { $ne: id } });
      if (existing) return res.status(400).json({ message: "Voter ID already taken" });
      user.voterId = voterId;
    }
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
    }

    await user.save();
    const updated = user.toObject();
    delete updated.password;
    res.json({ message: "User updated successfully", user: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// ✅ CREATE ADMIN (first admin only)
router.post("/admin/create", async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    const SECRET = "admin-secret-123";
    if (adminSecret !== SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }

    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      isAdmin: true,
      voterId: "",
      hasVoted: false
    });

    await user.save();
    res.json({ message: "Admin user created" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating admin" });
  }
});

// ✅ UPDATE PROFILE
router.put("/profile/:id", async (req, res) => {

  try {

    const { id } = req.params;
    const { name, profilePic } = req.body;

    // 🔹 find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 update only name and profilePic (not email)
    user.name = name || user.name;
    user.profilePic = profilePic || user.profilePic;

    await user.save();

    res.json({ message: "Profile updated successfully", user });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Error updating profile" });

  }

});

// ✅ FETCH NOTIFICATIONS
router.get("/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("notifications");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ notifications: user.notifications || [] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

module.exports = router;