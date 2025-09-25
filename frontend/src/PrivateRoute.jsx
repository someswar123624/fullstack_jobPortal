import React from "react";
import { Navigate } from "react-router-dom";

// role: "student" or "employer"
const PrivateRoute = ({ children, role }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user")); // { role: "student" }

  if (!loggedInUser || loggedInUser.role !== role) {
    // not logged in or wrong role → redirect to respective login
    return <Navigate to={`/${role}/login`} replace />;
  }

  return children;
};

export default PrivateRoute;
