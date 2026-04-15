import React,{useState, useEffect} from "react";
import axios from "axios";

function Register(){

const [form,setForm] = useState({
name:"",
email:"",
password:""
});

useEffect(() => {
  // If already logged in, redirect to home
  const user = localStorage.getItem("user");
  if (user) {
    window.location.href = "/";
  }
}, []);

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const registerUser = async ()=>{

if(!form.name || !form.email || !form.password){
alert("Fill all fields");
return;
}

try{
const response = await axios.post("http://localhost:5000/api/register",form);
alert("Registration Successful! Your Voter ID: " + response.data.voterId);
window.location.href="/login";
}catch(err){
console.log(err);
alert("Error: " + (err.response?.data?.message || "Registration failed"));
}

};

return(

<div className="auth-container">

<div className="auth-box">

<h2>Register</h2>

<input className="auth-input" name="name" placeholder="Name" value={form.name} onChange={handleChange}/>
<input className="auth-input" name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
<input className="auth-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}/>

<button className="auth-btn" onClick={registerUser}>
Register
</button>

</div>

</div>

);

}

export default Register;