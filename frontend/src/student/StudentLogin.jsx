import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Auth.css";

const StudentLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle redirect after Google OAuth
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role: "student" }));
      navigate("/student"); // redirect to student dashboard
    }
  }, [searchParams, navigate]);

  // Normal login form handlers
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.student, role: "student" })
        );
        navigate("/student");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Redirect user to backend Google OAuth
  const handleGoogleLogin = () => {
    // Add query params to backend URL if needed
    // Backend Passport strategy already uses:
    // prompt: "consent", accessType: "offline"
    window.location.href =
      "http://localhost:5000/auth/google?role=student";
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <button onClick={handleGoogleLogin} className="google-btn">
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
