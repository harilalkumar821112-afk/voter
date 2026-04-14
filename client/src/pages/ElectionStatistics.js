import React,{useEffect,useState} from "react";
import axios from "axios";

function ElectionStatistics(){

const [stats,setStats] = useState({
totalVoters:0,
totalCandidates:0,
totalVotes:0,
candidates:[]
});

useEffect(()=>{
axios.get("http://localhost:5000/api/stats")
.then(res=>setStats(res.data))
.catch(err=>console.log(err));
},[]);

return(

<div className="container mt-5">

<h1 className="text-center mb-4">📊 Election Statistics</h1>

<div className="row text-center">

<div className="col-md-3">
<div className="card shadow p-4">
<h3>👥 {stats.totalVoters}</h3>
<p>Total Voters</p>
</div>
</div>

<div className="col-md-3">
<div className="card shadow p-4">
<h3>🧑‍💼 {stats.totalCandidates}</h3>
<p>Candidates</p>
</div>
</div>

<div className="col-md-3">
<div className="card shadow p-4">
<h3>🗳️ {stats.totalVotes}</h3>
<p>Votes Casted</p>
</div>
</div>

<div className="col-md-3">
<div className="card shadow p-4">
<h3>🏆 Leader</h3>
<p>Top Candidate</p>
</div>
</div>

</div>

{/* 🔥 LIVE RESULT */}
<div className="mt-5">

<h3 className="text-center mb-4">Live Results</h3>

<div className="card p-4 shadow">

{stats.candidates.map(c=>{

const percent = stats.totalVotes 
? (c.votes / stats.totalVotes) * 100 
: 0;

return(
<div key={c._id}>

<p>{c.name} - {c.votes} votes</p>

<div className="progress mb-3">
<div
className="progress-bar bg-success"
style={{width:`${percent}%`}}
>
{percent.toFixed(1)}%
</div>
</div>

</div>
);

})}

</div>

</div>

</div>

);

}

export default ElectionStatistics;