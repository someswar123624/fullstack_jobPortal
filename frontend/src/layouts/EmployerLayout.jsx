import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import PostJob from "../employer/PostJob";
import MyJobs from "../employer/MyJobs";
import "./EmployerLayout.css";

const EmployerLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("post"); // default view

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // back to home
  };

  return (
    <div>
      <header className="navbar">
        <div className="logo">JobPortal</div>

        {user ? (
          // AFTER login
          <nav className="nav-links">
            <button
              className={`nav-btn ${active === "post" ? "active" : ""}`}
              onClick={() => setActive("post")}
            >
              Post Job
            </button>
            <button
              className={`nav-btn ${active === "myjobs" ? "active" : ""}`}
              onClick={() => setActive("myjobs")}
            >
              My Jobs
            </button>
            <button onClick={handleLogout} className="nav-btn logout-btn">
              Logout
            </button>
          </nav>
        ) : (
          // BEFORE login
          <nav className="nav-links">
            <Link to="/employer/login" className="nav-btn login-btn">
              Login
            </Link>
            <Link to="/employer/register" className="nav-btn">
              Register
            </Link>
          </nav>
        )}
      </header>

      <main className="content">
        {user ? (
          <>
            {active === "post" && <PostJob />}
            {active === "myjobs" && <MyJobs />}
          </>
        ) : (
          <Outlet /> // login/register pages
        )}
      </main>
    </div>
  );
};

export default EmployerLayout;
