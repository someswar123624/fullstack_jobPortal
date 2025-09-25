import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Jobs from "../student/Jobs";
import Applications from "../student/Applications";
import "./StudentLayout.css";

const StudentLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [active, setActive] = useState("jobs"); // default view

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
              className={`nav-btn ${active === "jobs" ? "active" : ""}`}
              onClick={() => setActive("jobs")}
            >
              Jobs
            </button>
            <button
              className={`nav-btn ${active === "applications" ? "active" : ""}`}
              onClick={() => setActive("applications")}
            >
              Applications
            </button>
            <button onClick={handleLogout} className="nav-btn logout-btn">
              Logout
            </button>
          </nav>
        ) : (
          // BEFORE login
          <nav className="nav-links">
            <Link to="/student/login" className="nav-btn login-btn">
              Login
            </Link>
            <Link to="/student/register" className="nav-btn">
              Register
            </Link>
          </nav>
        )}
      </header>

      <main className="content">
        {user ? (
          <>
            {active === "jobs" && <Jobs />}
            {active === "applications" && <Applications />}
          </>
        ) : (
          <Outlet /> // for login/register pages
        )}
      </main>
    </div>
  );
};

export default StudentLayout;
