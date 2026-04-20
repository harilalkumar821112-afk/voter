const express = require("express");
const router = express.Router();
const Vote = require("../models/Vote");
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Election = require("../models/Election");
const AuditLog = require("../models/AuditLog");
const { authenticateToken, requireEmailVerified } = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

// ✅ CAST VOTE (With prevention)
router.post("/cast", authenticateToken, requireEmailVerified, async (req, res) => {
  try {
    const { candidateId, electionId } = req.body;

    if (!candidateId || !electionId) {
      return res.status(400).json({ message: "Candidate ID and Election ID required" });
    }

    // Get user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already voted in this election
    const existingVote = await Vote.findOne({
      userId: req.user.userId,
      electionId: electionId
    });

    if (existingVote) {
      await AuditLog.create({
        action: "vote_cast_failed",
        userId: req.user.userId,
        voterId: user.voterId,
        status: "failed",
        reason: "User already voted",
        metadata: { electionId, candidateId },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return res.status(400).json({ message: "You have already voted in this election" });
    }

    // Check election status
    const election = await Election.findById(electionId);
    if (!election || !election.isActive) {
      await AuditLog.create({
        action: "vote_cast_failed",
        userId: req.user.userId,
        voterId: user.voterId,
        status: "failed",
        reason: "Election not active",
        metadata: { electionId },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return res.status(400).json({ message: "Election is not active" });
    }

    // Check if voting time is valid
    const now = new Date();
    if (now < election.startTime || now > election.endTime) {
      await AuditLog.create({
        action: "vote_cast_failed",
        userId: req.user.userId,
        voterId: user.voterId,
        status: "failed",
        reason: "Voting time invalid",
        metadata: { electionId },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      return res.status(400).json({ message: "Voting is not available at this time" });
    }

    // Get candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Create unique verification code
    const verificationCode = `VRF-${uuidv4().slice(0, 12).toUpperCase()}`;

    // Create vote
    const vote = await Vote.create({
      userId: req.user.userId,
      candidateId: candidateId,
      voterId: user.voterId,
      electionId: electionId,
      verificationCode: verificationCode,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    // Update candidate vote count
    candidate.votes += 1;
    await candidate.save();

    // Update user - mark as voted
    user.hasVoted = true;
    user.votedFor = candidateId;
    user.voteTime = new Date();
    await user.save();

    // Update election total votes
    election.totalVotesCast += 1;
    await election.save();

    // Add notification
    user.notifications.push({
      type: "receipt",
      title: "Vote Cast Successfully",
      message: `Your vote for ${candidate.name} has been recorded`,
      receipt: {
        receiptNumber: verificationCode,
        voterId: user.voterId,
        candidateName: candidate.name,
        candidateParty: candidate.party,
        voteDate: new Date()
      }
    });
    await user.save();

    // Log vote
    await AuditLog.create({
      action: "vote_cast",
      userId: req.user.userId,
      voterId: user.voterId,
      status: "success",
      voteDetails: {
        candidateId: candidate._id,
        candidateName: candidate.name,
        electionId: election._id
      },
      metadata: { verificationCode },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.status(201).json({
      message: "Vote cast successfully",
      vote: {
        verificationCode,
        candidateName: candidate.name,
        electionName: election.name,
        timestamp: vote.timestamp
      }
    });
  } catch (err) {
    console.error("Cast vote error:", err);
    res.status(500).json({ message: "Error casting vote" });
  }
});

// ✅ CHANGE VOTE (If allowed)
router.post("/change", authenticateToken, requireEmailVerified, async (req, res) => {
  try {
    const { candidateId, electionId } = req.body;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    if (!election.allowVoteChange) {
      return res.status(400).json({ message: "Vote changes are not allowed for this election" });
    }

    // Find existing vote
    const existingVote = await Vote.findOne({
      userId: req.user.userId,
      electionId: electionId
    });

    if (!existingVote) {
      return res.status(400).json({ message: "You haven't voted yet" });
    }

    // Update vote
    const oldCandidate = await Candidate.findById(existingVote.candidateId);
    const newCandidate = await Candidate.findById(candidateId);

    existingVote.candidateId = candidateId;
    existingVote.verificationCode = `VRF-${uuidv4().slice(0, 12).toUpperCase()}`;
    await existingVote.save();

    // Update vote counts
    if (oldCandidate) {
      oldCandidate.votes = Math.max(0, oldCandidate.votes - 1);
      await oldCandidate.save();
    }

    newCandidate.votes += 1;
    await newCandidate.save();

    await AuditLog.create({
      action: "vote_changed",
      userId: req.user.userId,
      status: "success",
      voteDetails: {
        candidateId: newCandidate._id,
        candidateName: newCandidate.name,
        electionId
      },
      metadata: { oldCandidateId: existingVote.candidateId },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({
      message: "Vote changed successfully",
      vote: {
        verificationCode: existingVote.verificationCode,
        candidateName: newCandidate.name
      }
    });
  } catch (err) {
    console.error("Change vote error:", err);
    res.status(500).json({ message: "Error changing vote" });
  }
});

// ✅ GET MY VOTE STATUS
router.get("/status/:electionId", authenticateToken, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      userId: req.user.userId,
      electionId: req.params.electionId
    }).populate("candidateId", "name party");

    const hasVoted = !!vote;

    res.json({
      hasVoted,
      vote: hasVoted ? {
        candidateName: vote.candidateId.name,
        candidateParty: vote.candidateId.party,
        timestamp: vote.timestamp,
        verificationCode: vote.verificationCode
      } : null
    });
  } catch (err) {
    console.error("Get vote status error:", err);
    res.status(500).json({ message: "Error fetching vote status" });
  }
});

// ✅ GET VOTING RESULTS
router.get("/results/:electionId", async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    // Get all votes with candidates
    const votes = await Vote.find({ electionId: req.params.electionId })
      .populate("candidateId", "name party votes");

    const candidates = await Candidate.find({ electionId: req.params.electionId });
    const totalVotes = votes.length;

    const results = candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      party: candidate.party,
      votes: candidate.votes,
      percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : 0
    }));

    res.json({
      election: {
        name: election.name,
        status: election.status
      },
      totalVotes,
      results: results.sort((a, b) => b.votes - a.votes)
    });
  } catch (err) {
    console.error("Get results error:", err);
    res.status(500).json({ message: "Error fetching results" });
  }
});

module.exports = router;
