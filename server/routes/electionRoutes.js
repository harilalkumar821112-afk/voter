const express = require("express");
const router = express.Router();
const Election = require("../models/Election");
const User = require("../models/User");
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const AuditLog = require("../models/AuditLog");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const moment = require("moment");

// ✅ CREATE ELECTION (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, startTime, endTime, allowVoteChange } = req.body;

    if (!name || !startTime || !endTime) {
      return res.status(400).json({ message: "Name, start time, and end time required" });
    }

    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const election = await Election.create({
      name,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      allowVoteChange: allowVoteChange || false,
      createdBy: req.user.userId,
      status: "scheduled"
    });

    await AuditLog.create({
      action: "election_created",
      userId: req.user.userId,
      status: "success",
      metadata: { electionId: election._id, electionName: name },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.status(201).json({
      message: "Election created successfully",
      election
    });
  } catch (err) {
    console.error("Create election error:", err);
    res.status(500).json({ message: "Error creating election" });
  }
});

// ✅ GET ALL ELECTIONS
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find()
      .populate("candidates", "name party photo votes")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ elections });
  } catch (err) {
    console.error("Get elections error:", err);
    res.status(500).json({ message: "Error fetching elections" });
  }
});

// ✅ GET ACTIVE ELECTION
router.get("/active", async (req, res) => {
  try {
    const now = new Date();
    const election = await Election.findOne({
      startTime: { $lte: now },
      endTime: { $gte: now },
      isActive: true
    }).populate("candidates", "name party photo votes votePercentage");

    if (!election) {
      return res.status(404).json({ message: "No active election" });
    }

    // Calculate remaining time
    const remainingTime = election.endTime.getTime() - now.getTime();

    res.json({
      election,
      remainingTime,
      remainingTimeFormatted: moment.duration(remainingTime).format("HH:mm:ss")
    });
  } catch (err) {
    console.error("Get active election error:", err);
    res.status(500).json({ message: "Error fetching active election" });
  }
});

// ✅ GET ELECTION BY ID
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate("candidates")
      .populate("createdBy", "name email");

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    res.json({ election });
  } catch (err) {
    console.error("Get election error:", err);
    res.status(500).json({ message: "Error fetching election" });
  }
});

// ✅ UPDATE ELECTION (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, startTime, endTime, allowVoteChange, status } = req.body;

    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (name) election.name = name;
    if (description) election.description = description;
    if (allowVoteChange !== undefined) election.allowVoteChange = allowVoteChange;
    if (status) election.status = status;

    await election.save();

    await AuditLog.create({
      action: "election_updated",
      userId: req.user.userId,
      status: "success",
      metadata: { electionId: election._id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "Election updated successfully",
      election
    });
  } catch (err) {
    console.error("Update election error:", err);
    res.status(500).json({ message: "Error updating election" });
  }
});

// ✅ START ELECTION (Admin only)
router.post("/:id/start", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    election.isActive = true;
    election.status = "ongoing";
    await election.save();

    await AuditLog.create({
      action: "election_started",
      userId: req.user.userId,
      status: "success",
      metadata: { electionId: election._id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "Election started successfully",
      election
    });
  } catch (err) {
    console.error("Start election error:", err);
    res.status(500).json({ message: "Error starting election" });
  }
});

// ✅ END ELECTION (Admin only)
router.post("/:id/end", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    election.isActive = false;
    election.status = "ended";
    await election.save();

    await AuditLog.create({
      action: "election_ended",
      userId: req.user.userId,
      status: "success",
      metadata: { electionId: election._id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "Election ended successfully",
      election
    });
  } catch (err) {
    console.error("End election error:", err);
    res.status(500).json({ message: "Error ending election" });
  }
});

// ✅ DELETE ELECTION (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    await AuditLog.create({
      action: "election_deleted",
      userId: req.user.userId,
      status: "success",
      metadata: { electionId: election._id },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({ message: "Election deleted successfully" });
  } catch (err) {
    console.error("Delete election error:", err);
    res.status(500).json({ message: "Error deleting election" });
  }
});

// ✅ GET ELECTION STATISTICS
router.get("/:id/stats", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate("candidates");
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    const totalVotes = await Vote.countDocuments({ electionId: req.params.id });
    const candidateStats = election.candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      party: candidate.party,
      votes: candidate.votes,
      percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : 0
    }));

    res.json({
      election: {
        name: election.name,
        status: election.status,
        totalVotes
      },
      candidates: candidateStats
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

module.exports = router;
