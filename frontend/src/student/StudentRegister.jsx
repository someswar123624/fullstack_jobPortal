import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

const StudentRegister = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("Registration successful! Please login.");
        navigate("/student/login");
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
        <h2>Student Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
