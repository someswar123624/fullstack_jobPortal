import React, { useEffect, useState } from "react";
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(JSON.parse(localStorage.getItem("user")));
  const [openFormJobId, setOpenFormJobId] = useState(null); // track which job form is open
  const [formData, setFormData] = useState({
    name: "",
    srn: "",
    college: "",
    class10: "",
    class12: "",
    degree: "",
    degreeCgpa: "",
    skills: "",
    projects: "",
    resume: null, // file
  });

  // Fetch jobs from backend
 const fetchJobs = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/jobs");
    const data = await res.json();
    console.log("Fetched jobs:", data); // debug

    if (!res.ok || !data.success) {
      setError(data.message || "Failed to fetch jobs");
      setJobs([]);
      return;
    }

    setJobs(Array.isArray(data.jobs) ? data.jobs : []);
  } catch (err) {
    console.error(err);
    setError("Something went wrong while fetching jobs");
    setJobs([]);
  }
};


  useEffect(() => {
    fetchJobs();
  }, []);

  // Toggle form display for a job
  const toggleForm = (jobId) => {
    if (!student || !student._id) return alert("Please login to apply");
    setOpenFormJobId(openFormJobId === jobId ? null : jobId);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] }); // resume file
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit application
  const handleSubmit = async (jobId) => {
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      const res = await fetch(
        `http://localhost:5000/api/students/${student._id}/apply/${jobId}`,
        {
          method: "POST",
          body: formPayload,
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Application submitted successfully!");
        setOpenFormJobId(null); // close the form
        setFormData({
          name: "",
          srn: "",
          college: "",
          class10: "",
          class12: "",
          degree: "",
          degreeCgpa: "",
          skills: "",
          projects: "",
          resume: null,
        });
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="jobs-list">
      {error && <p style={{ color: "red" }}>{error}</p>}

      {jobs.length === 0 && !error ? (
        <p>No jobs available.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3> <strong>Tittle:</strong> {job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> {job.salary || "Not specified"}</p>
            <p>{job.description}</p>
            <button onClick={() => toggleForm(job._id)}>
              {openFormJobId === job._id ? "Close Form" : "Apply"}
            </button>

            {/* Conditional rendering of the application form */}
            {openFormJobId === job._id && (
              <div className="application-form" style={{ marginTop: "10px" }}>
                <h4>Student Details</h4>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  name="srn"
                  placeholder="SRN"
                  value={formData.srn}
                  onChange={handleChange}
                  required
                />
                <input
                  name="college"
                  placeholder="College Name"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
                <input
                  name="class10"
                  placeholder="10th Percentage"
                  value={formData.class10}
                  onChange={handleChange}
                  required
                />
                <input
                  name="class12"
                  placeholder="12th Percentage"
                  value={formData.class12}
                  onChange={handleChange}
                  required
                />
                <input
                  name="degree"
                  placeholder="Degree Name"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                />
                <input
                  name="degreeCgpa"
                  placeholder="Degree CGPA/Percentage"
                  value={formData.degreeCgpa}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="skills"
                  placeholder="Skills (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="projects"
                  placeholder="Projects"
                  value={formData.projects}
                  onChange={handleChange}
                />
                <input
                  type="file"
                  name="resume"
                  onChange={handleChange}
                />
                <button onClick={() => handleSubmit(job._id)}>Submit Application</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Jobs;
