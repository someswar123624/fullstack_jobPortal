import React, { useState } from "react";

const PostJob = () => {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: ""
  });

  const handleChange = (e) => setJob({ ...job, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")); // logged-in employer
    if (!user || !user._id) return alert("You must be logged in as employer");

    try {
     const res = await fetch(`http://localhost:5000/api/employers/${user._id}/jobs`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(job) // employerId is now in URL
});

      const data = await res.json();
      if (data.success) {
        alert("Job posted successfully!");
        setJob({ title: "", company: "", location: "", description: "", salary: "" });
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="job-form">
      <h2>Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />
        <input
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={job.description}
          onChange={handleChange}
          required
        />
        <input
          name="salary"
          placeholder="Salary"
          value={job.salary}
          onChange={handleChange}
          required
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
