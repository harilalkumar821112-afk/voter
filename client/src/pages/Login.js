import React,{useState, useEffect} from "react";
import apiClient from "../services/api";
import "../App.css";

function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

useEffect(() => {
  // If already logged in, redirect to home
  const user = localStorage.getItem("user");
  if (user) {
    window.location.href = "/";
  }
}, []);

const loginUser = async ()=>{

if(!email || !password){
  alert("Please fill all fields");
  return;
}

try{
const res = await apiClient.post("/login",{email,password});

localStorage.setItem("user", JSON.stringify(res.data.user));

alert(res.data.message);
window.location.href="/dashboard";

}catch(err){
alert("Login failed");
}

};

return(

<div className="auth-container">

<div className="auth-box">

<h2>Login</h2>

<input
className="auth-input"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
className="auth-input"
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="auth-btn" onClick={loginUser}>
Login
</button>

</div>

</div>

);

}

export default Login;