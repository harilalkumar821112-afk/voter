const express = require("express");
const router = express.Router();

const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const User = require("../models/User");

router.post("/vote", async (req,res)=>{
try{

const {userId,candidateId} = req.body;

// 🔹 check user exist
const user = await User.findById(userId);
if(!user){
return res.status(404).json({message:"User not found"});
}

// 🔹 check already voted (method 1 - using User)
if(user.hasVoted){
return res.status(400).json({message:"You already voted"});
}

// 🔹 check if vote already exists in database
const existingVote = await Vote.findOne({voterId: userId});
if(existingVote){
  return res.status(400).json({message:"You have already voted"});
}

// 🔹 fetch candidate
const candidate = await Candidate.findById(candidateId);
if(!candidate){
  return res.status(404).json({message:"Candidate not found"});
}

// 🔹 save vote
const vote = new Vote({
  voterId:userId,
  candidateId
});

await vote.save();

// 🔹 increase candidate votes
await Candidate.findByIdAndUpdate(
  candidateId,
  {$inc:{votes:1}}
);

// 🔹 mark user as voted
user.hasVoted = true;

if(!user.notifications){
  user.notifications = [];
}

const receiptNumber = `RCPT-${Date.now()}-${Math.floor(Math.random()*9000 + 1000)}`;
const receipt = {
  receiptNumber,
  voterId: user.voterId || "N/A",
  candidateName: candidate.name,
  candidateParty: candidate.party,
  voteDate: new Date()
};

user.notifications.push({
  type: "receipt",
  title: "Vote Receipt",
  message: `Your vote for ${candidate.name} has been recorded successfully.`,
  receipt,
  createdAt: new Date(),
  read: false
});

await user.save();

res.json({
  message:"Vote submitted successfully",
  receipt
});

}catch(err){

console.log(err);
res.status(500).json({message:"Voting error"});

}

});

router.get("/stats", async (req,res)=>{

try{

const totalVoters = await require("../models/User").countDocuments();

const totalCandidates = await require("../models/Candidate").countDocuments();

const totalVotes = await require("../models/Vote").countDocuments();

// candidate-wise votes
const candidates = await require("../models/Candidate").find();

res.json({
totalVoters,
totalCandidates,
totalVotes,
candidates
});

}catch(err){
res.status(500).json({message:"Error fetching stats"});
}

});

module.exports = router;