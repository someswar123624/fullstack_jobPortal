import React, { useEffect, useState } from "react";
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [openFormJobId, setOpenFormJobId] = useState(null);
  const [formData, setFormData] = useState({ name:"", srn:"", college:"", class10:"", class12:"", degree:"", degreeCgpa:"", skills:"", projects:"", resume:null });
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch jobs");
      setJobs(data.jobs || []);
    } catch (err) { setError(err.message); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const toggleForm = jobId => setOpenFormJobId(openFormJobId === jobId ? null : jobId);
  const handleChange = e => { const { name, value, files } = e.target; setFormData({ ...formData, [name]: files ? files[0] : value }); };

  const handleSubmit = async jobId => {
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([k,v]) => formPayload.append(k,v));

      const res = await fetch(`http://localhost:5000/api/students/apply/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload
      });
      const data = await res.json();
      if (res.ok && data.success) { alert("Application submitted!"); setOpenFormJobId(null); setFormData({ name:"", srn:"", college:"", class10:"", class12:"", degree:"", degreeCgpa:"", skills:"", projects:"", resume:null }); }
      else alert(data.message || "Failed to apply");
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="jobs-list">
      {error && <p style={{ color:"red" }}>{error}</p>}
      {jobs.length === 0 ? <p>No jobs available.</p> :
        jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> {job.salary || "Not specified"}</p>
            <p>{job.description}</p>
            <button onClick={() => toggleForm(job._id)}>{openFormJobId === job._id ? "Close Form" : "Apply"}</button>

            {openFormJobId === job._id && (
              <div className="application-form">
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                <input name="srn" placeholder="SRN" value={formData.srn} onChange={handleChange} required />
                <input name="college" placeholder="College" value={formData.college} onChange={handleChange} required />
                <input name="class10" placeholder="10th %" value={formData.class10} onChange={handleChange} required />
                <input name="class12" placeholder="12th %" value={formData.class12} onChange={handleChange} required />
                <input name="degree" placeholder="Degree" value={formData.degree} onChange={handleChange} required />
                <input name="degreeCgpa" placeholder="CGPA/Percentage" value={formData.degreeCgpa} onChange={handleChange} required />
                <textarea name="skills" placeholder="Skills" value={formData.skills} onChange={handleChange} required />
                <textarea name="projects" placeholder="Projects" value={formData.projects} onChange={handleChange} />
                <input type="file" name="resume" onChange={handleChange} />
                <button onClick={() => handleSubmit(job._id)}>Submit Application</button>
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
};

export default Jobs;
