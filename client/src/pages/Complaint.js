import React,{useState} from "react";

function Complaint(){

const [msg,setMsg] = useState("");

const submitComplaint=(e)=>{
e.preventDefault();
alert("Complaint Submitted");
};

return(

<div className="container mt-5">

<h2>Register Complaint</h2>

<form onSubmit={submitComplaint}>

<textarea
className="form-control"
placeholder="Enter your complaint"
value={msg}
onChange={(e)=>setMsg(e.target.value)}
/>

<br/>

<button className="btn btn-danger">
Submit
</button>

</form>

</div>

);

}

export default Complaint;