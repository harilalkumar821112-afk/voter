import React from "react";
import {Link} from "react-router-dom";

function Navbar(){

return(

<nav className="navbar navbar-dark bg-dark">

<div className="container">

<Link className="navbar-brand" to="/">
🗳 Voting System
</Link>

<div>

<Link className="btn btn-light m-1" to="/vote">
Vote
</Link>

<Link className="btn btn-warning m-1" to="/result">
Result
</Link>

</div>

</div>

</nav>

);

}

export default Navbar;