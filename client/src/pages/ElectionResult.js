import React,{useEffect,useState} from "react";
import axios from "axios";

function ElectionResult(){

const [candidates,setCandidates] = useState([]);

useEffect(()=>{

axios.get("http://localhost:5000/api/candidates")
.then(res=>setCandidates(res.data));

},[]);

return(

<div className="container mt-4">

<h2 className="text-center">Election Results</h2>

<table className="table table-striped">

<thead>

<tr>
<th>Name</th>
<th>Party</th>
<th>Votes</th>
</tr>

</thead>

<tbody>

{candidates.map(c=>(
<tr key={c._id}>
<td>{c.name}</td>
<td>{c.party}</td>
<td>{c.votes}</td>
</tr>
))}

</tbody>

</table>

</div>

);

}

export default ElectionResult;