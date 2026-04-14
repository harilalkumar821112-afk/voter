const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// yaha par candidate add karne ka route banayenge
router.post("/addCandidate", async (req,res)=>{

const candidate = new Candidate(req.body);

await candidate.save();

res.json({message:"Candidate Added"});

});

router.get("/candidates", async (req,res)=>{

const candidates = await Candidate.find();

res.json(candidates);

});

// yaha par candidate ki details ko update karne ka route banayenge
router.get("/candidates", async (req,res)=>{

const candidates = await Candidate.find();

res.json(candidates);

});

module.exports = router;