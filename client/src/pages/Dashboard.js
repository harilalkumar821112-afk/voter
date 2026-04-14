import React from "react";
import "./Dashboard.css";

function Dashboard(){

const user = JSON.parse(localStorage.getItem("user"));

if(!user){
  return <h2 style={{textAlign:"center"}}>Please Login First</h2>;
}

return(

<div className="dashboard container-fluid d-flex justify-content-center align-items-center vh-100">

  <div className="row w-100 justify-content-center">

    <div className="col-md-8 col-lg-6">

      <div className="card shadow-lg border-0">

        <div className="card-body text-center p-5">

          <h1 className="card-title mb-3">Welcome {user.name} 👋</h1>

          <p className="card-text text-muted mb-4">Choose what you want to do</p>

          <div className="row g-3">

            <div className="col-12">

              <div className="card h-100 border-primary">

                <div className="card-body text-center">

                  <div className="mb-3" style={{fontSize: '2rem'}}>🗳️</div>

                  <h5 className="card-title">Vote Now</h5>

                  <p className="card-text">Cast your vote in the current election.</p>

                  <button className="btn btn-primary" onClick={()=>window.location.href="/vote"}>Vote Now</button>

                </div>

              </div>

            </div>

            <div className="col-12">

              <div className="card h-100 border-info">

                <div className="card-body text-center">

                  <div className="mb-3" style={{fontSize: '2rem'}}>📥</div>

                  <h5 className="card-title">Download EPIC</h5>

                  <p className="card-text">Download your Electoral Photo Identity Card.</p>

                  <button className="btn btn-info" onClick={()=>window.location.href="/download"}>Download</button>

                </div>

              </div>

            </div>

            <div className="col-12">

              <div className="card h-100 border-danger">

                <div className="card-body text-center">

                  <div className="mb-3" style={{fontSize: '2rem'}}>🚪</div>

                  <h5 className="card-title">Logout</h5>

                  <p className="card-text">Sign out from your account.</p>

                  <button className="btn btn-danger" onClick={()=>{localStorage.removeItem("user"); window.location.href="/login";}}>Logout</button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>

);

}

export default Dashboard;