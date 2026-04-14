import React,{useState} from "react";

function DownloadEpic(){

const [epic,setEpic] = useState("");

const handleSubmit = (e)=>{
e.preventDefault();
alert("EPIC Number: "+epic);
};

return(

<div className="container mt-5">

<h2>Download E-EPIC</h2>

<form onSubmit={handleSubmit}>

<div className="mb-3">

<label>Enter EPIC Number</label>

<input
className="form-control"
placeholder="EPIC Number"
value={epic}
onChange={(e)=>setEpic(e.target.value)}
/>

</div>

<button className="btn btn-primary">
Download
</button>

</form>

</div>

);

}

export default DownloadEpic;