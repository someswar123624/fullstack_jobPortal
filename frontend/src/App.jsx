import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages & Layouts
import Home from "./Home";
import StudentLayout from "./layouts/StudentLayout";
import EmployerLayout from "./layouts/EmployerLayout";
import StudentLogin from "./student/StudentLogin";
import StudentRegister from "./student/StudentRegister";
import EmployerLogin from "./employer/EmployerLogin";
import EmployerRegister from "./employer/EmployerRegister";
import PostJob from "./employer/PostJob";
import MyJobs from "./employer/MyJobs";

// OAuth Handler
import OAuthHandler from "./OAuthHandler";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="login" element={<StudentLogin />} />
        <Route path="register" element={<StudentRegister />} />
        <Route path="oauth" element={<OAuthHandler role="student" />} />
      </Route>

      {/* Employer Routes */}
      <Route path="/employer" element={<EmployerLayout />}>
        <Route path="login" element={<EmployerLogin />} />
        <Route path="register" element={<EmployerRegister />} />
        <Route path="jobs" element={<PostJob />} />
        <Route path="myjobs" element={<MyJobs />} />
        <Route path="oauth" element={<OAuthHandler role="employer" />} />
      </Route>
    </Routes>
  );
}

export default App;
