import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth.css";

const EmployerLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/employers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        alert("Employer login successful!");
        // Save the full employer object including _id
        localStorage.setItem("user", JSON.stringify({ ...data.employer, role: "employer" }));
        navigate("/employer/jobs"); // redirect to jobs page
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Employer Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Company Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default EmployerLogin;
