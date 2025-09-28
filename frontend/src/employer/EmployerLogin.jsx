import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../Auth.css";

const EmployerLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle redirect from backend OAuth
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role: "employer" }));
      navigate("/employer/jobs");
    }
  }, [searchParams, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.employer, role: "employer" })
        );
        navigate("/employer/jobs");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Redirect to backend OAuth route
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google?role=employer";
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Employer Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Company Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <button className="google-btn" onClick={handleGoogleLogin}>
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
