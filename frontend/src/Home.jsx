import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h2>Welcome! Please choose your role</h2>
      <button onClick={() => navigate("/student")}>🎓 Student</button>
      <button onClick={() => navigate("/employer")}>🏢 Employer</button>
    </div>
  );
};

export default Home;
