import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateList(){

const [candidates,setCandidates] = useState([]);
const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user")); // ✅ get logged user

useEffect(()=>{

axios.get("http://localhost:5000/api/candidates")
.then(res=>setCandidates(res.data));

},[]);

const vote = async(id)=>{

if(!user){
  alert("Please login before voting.");
  navigate("/login");
  return;
}

try{

const res = await axios.post("http://localhost:5000/api/vote",{
userId:user._id,   // ✅ real user id
candidateId:id
});

alert(res.data.message);
navigate("/notifications");

}catch(err){

if(err.response){
  alert(err.response.data.message);
}else{
  alert("Voting failed");
}

}

};

return(

<div className="container mt-4 pt-5">

<h2 className="text-center mb-4">Vote For Candidate</h2>

<div className="row g-4">

{candidates.map(c=>(
<div className="col-lg-4 col-md-6 col-12" key={c._id}>

<div className="card shadow p-3 text-center h-100">

<h4 className="h5">{c.name}</h4>
<p className="mb-3">{c.party}</p>

<button
className="btn btn-success w-100"
onClick={()=>vote(c._id)}>

Vote

</button>

</div>

</div>
))}

</div>

</div>

);

}

export default CandidateList;