import React,{useState} from "react";

function SearchVoter(){

const [name,setName] = useState("");

const searchVoter=(e)=>{
e.preventDefault();
alert("Searching voter: "+name);
};

return(

<div className="container mt-5">

<h2>Search Electoral Roll</h2>

<form onSubmit={searchVoter}>

<input
className="form-control"
placeholder="Enter Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<br/>

<button className="btn btn-success">
Search
</button>

</form>

</div>

);

}

export default SearchVoter;
