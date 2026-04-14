import React from "react";

function Footer(){

return(

<footer style={{background:"#111",color:"white",marginTop:"50px"}}>

<div className="container py-4">

<div className="row text-center text-md-start">

{/* ABOUT */}
<div className="col-lg-4 col-md-6 col-12 mb-4">
<h5>Online Voting System</h5>
<p style={{fontSize:"14px"}}>
This platform provides a secure and transparent digital
voting experience for citizens. It allows voters to
register, search their name in the electoral roll,
and participate in elections online.
</p>
</div>

{/* QUICK LINKS */}
<div className="col-lg-4 col-md-6 col-12 mb-4">
<h5>Quick Links</h5>
<ul style={{listStyle:"none",padding:0,fontSize:"14px"}}>
<li><a href="/" style={{color:"white",textDecoration:"none"}}>Home</a></li>
<li><a href="/register" style={{color:"white",textDecoration:"none"}}>Register Voter</a></li>
<li><a href="/search" style={{color:"white",textDecoration:"none"}}>Search Electoral Roll</a></li>
<li><a href="/result" style={{color:"white",textDecoration:"none"}}>Election Results</a></li>
</ul>
</div>

{/* CONTACT */}
<div className="col-lg-4 col-md-12 col-12">
<h5>Contact</h5>
<p style={{fontSize:"14px"}}>
Election Commission <br/>
Nirvachan Sadan, Ashoka Road <br/>
New Delhi, India
</p>
<p style={{fontSize:"14px"}}>
Helpline: 1950
</p>
</div>

</div>

</div>


{/* BOTTOM BAR */}

<div
style={{
background:"#000",
textAlign:"center",
padding:"10px",
fontSize:"14px"
}}
>

© 2026 Online Voting System | Created by <b>Harry Sahni</b>

</div>

</footer>

);

}

export default Footer;