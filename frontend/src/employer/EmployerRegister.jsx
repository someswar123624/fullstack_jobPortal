import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

const EmployerRegister = () => {
  const [form, setForm] = useState({ companyName: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/employers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("Employer registration successful! Please login.");
        navigate("/employer/login");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Employer Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Company Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default EmployerRegister;
