import React, { useState } from "react";

const PostJob = () => {
  const [job, setJob] = useState({ title: "", company: "", location: "", description: "", salary: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleChange = e => setJob({ ...job, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!token || !user) return alert("Login required");

    try {
      const res = await fetch(`http://localhost:5000/api/employers/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(job),
      });
      const data = await res.json();
      if (data.success) {
        alert("Job posted successfully!");
        setJob({ title: "", company: "", location: "", description: "", salary: "" });
      } else alert(data.message || "Error posting job");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="job-form">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={job.title} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={job.company} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={job.location} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={job.description} onChange={handleChange} required />
        <input name="salary" placeholder="Salary" value={job.salary} onChange={handleChange} required />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
