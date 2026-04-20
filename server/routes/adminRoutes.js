const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const User = require("../models/User");
const Election = require("../models/Election");
const Vote = require("../models/Vote");
const AuditLog = require("../models/AuditLog");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const multer = require("multer");

// Setup multer for photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// ✅ ADD CANDIDATE (Admin only)
router.post("/candidates", authenticateToken, requireAdmin, upload.single("photo"), async (req, res) => {
  try {
    const { name, party, description, bio, age, education, experience, website, electionId } = req.body;

    if (!name || !party || !electionId) {
      return res.status(400).json({ message: "Name, party, and election required" });
    }

    const candidate = await Candidate.create({
      name,
      party,
      description,
      bio,
      age,
      education,
      experience,
      website,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
      electionId
    });

    // Add candidate to election
    await Election.findByIdAndUpdate(electionId, {
      $push: { candidates: candidate._id }
    });

    await AuditLog.create({
      action: "candidate_added",
      userId: req.user.userId,
      status: "success",
      metadata: { candidateId: candidate._id, candidateName: name },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.status(201).json({
      message: "Candidate added successfully",
      candidate
    });
  } catch (err) {
    console.error("Add candidate error:", err);
    res.status(500).json({ message: "Error adding candidate" });
  }
});

// ✅ GET ALL CANDIDATES (For election)
router.get("/candidates/:electionId", async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId })
      .select("name party photo description votes votePercentage status");

    res.json({ candidates });
  } catch (err) {
    console.error("Get candidates error:", err);
    res.status(500).json({ message: "Error fetching candidates" });
  }
});

// ✅ UPDATE CANDIDATE (Admin only)
router.put("/candidates/:id", authenticateToken, requireAdmin, upload.single("photo"), async (req, res) => {
  try {
    const { name, party, description, bio, age, education, experience, website, status } = req.body;

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    if (name) candidate.name = name;
    if (party) candidate.party = party;
    if (description) candidate.description = description;
    if (bio) candidate.bio = bio;
    if (age) candidate.age = age;
    if (education) candidate.education = education;
    if (experience) candidate.experience = experience;
    if (website) candidate.website = website;
    if (status) candidate.status = status;
    if (req.file) candidate.photo = `/uploads/${req.file.filename}`;

    await candidate.save();

    await AuditLog.create({
      action: "candidate_updated",
      userId: req.user.userId,
      status: "success",
      metadata: { candidateId: candidate._id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "Candidate updated successfully",
      candidate
    });
  } catch (err) {
    console.error("Update candidate error:", err);
    res.status(500).json({ message: "Error updating candidate" });
  }
});

// ✅ DELETE CANDIDATE (Admin only)
router.delete("/candidates/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await AuditLog.create({
      action: "candidate_deleted",
      userId: req.user.userId,
      status: "success",
      metadata: { candidateId: candidate._id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Delete candidate error:", err);
    res.status(500).json({ message: "Error deleting candidate" });
  }
});

// ✅ GET ALL USERS (Admin only)
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshTokens -otp")
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ GET AUDIT LOG (Admin only)
router.get("/audit-log", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { action, userId, limit = 100, skip = 0 } = req.query;

    let query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("userId", "name email");

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (err) {
    console.error("Get audit log error:", err);
    res.status(500).json({ message: "Error fetching audit log" });
  }
});

// ✅ GET DASHBOARD STATS (Admin only)
router.get("/dashboard/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalElections = await Election.countDocuments();
    const totalVotes = await Vote.countDocuments();
    const activeElections = await Election.countDocuments({ isActive: true });
    const endedElections = await Election.countDocuments({ status: "ended" });

    // Recent audit logs
    const recentLogs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("userId", "name email");

    res.json({
      stats: {
        totalUsers,
        totalElections,
        totalVotes,
        activeElections,
        endedElections
      },
      recentLogs
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

// ✅ VERIFY VOTE (Admin can verify a vote with receipt code)
router.post("/verify-vote/:verificationCode", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const vote = await Vote.findOne({ verificationCode: req.params.verificationCode })
      .populate("userId", "name email voterId")
      .populate("candidateId", "name party")
      .populate("electionId", "name");

    if (!vote) {
      return res.status(404).json({ message: "Vote not found" });
    }

    res.json({
      verified: true,
      vote: {
        voteId: vote._id,
        voter: vote.userId,
        candidate: vote.candidateId,
        election: vote.electionId,
        timestamp: vote.timestamp,
        verificationCode: vote.verificationCode
      }
    });
  } catch (err) {
    console.error("Verify vote error:", err);
    res.status(500).json({ message: "Error verifying vote" });
  }
});

module.exports = router;
