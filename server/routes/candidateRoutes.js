const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// ✅ ADD CANDIDATE
router.post("/addCandidate", async (req, res) => {
    try {
        const { name, party } = req.body;
        if (!name || !party) {
            return res.status(400).json({ message: "Name and party are required" });
        }
        const candidate = new Candidate({ name, party });
        await candidate.save();
        res.json({ message: "Candidate Added", candidate });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding candidate" });
    }
});

// ✅ GET ALL CANDIDATES
router.get("/candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ message: "Error fetching candidates" });
    }
});

// ✅ DELETE CANDIDATE
router.delete("/candidate/:id", async (req, res) => {
    try {
        await Candidate.findByIdAndDelete(req.params.id);
        res.json({ message: "Candidate deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting candidate" });
    }
});

module.exports = router;
