// src/OAuthHandler.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthHandler = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Save JWT
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role }));

      // Redirect based on role
      if (role === "student") navigate("/student");
      else if (role === "employer") navigate("/employer/jobs");
    } else {
      alert("OAuth login failed");
      navigate(role === "student" ? "/student/login" : "/employer/login");
    }
  }, [location, navigate, role]);

  return <div>Loading OAuth login...</div>;
};

export default OAuthHandler;
