import React, { useEffect, useState } from "react";
import "./Jobs.css";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [expandedApplicants, setExpandedApplicants] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch jobs posted by the employer
  const fetchJobs = async () => {
    if (!user || !user._id) return;

    try {
      setLoading(true);

      // 1. Fetch employer's jobs
      const resJobs = await fetch(`http://localhost:5000/api/employers/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataJobs = await resJobs.json();
      if (!resJobs.ok || !dataJobs.success) throw new Error(dataJobs.message || "Failed to fetch jobs");
      setJobs(dataJobs.jobs);

      // 2. Fetch all applications for this employer
      const resApps = await fetch(`http://localhost:5000/api/employers/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataApps = await resApps.json();
      if (!resApps.ok || !dataApps.success) throw new Error(dataApps.message || "Failed to fetch applications");

      // Map applications to each job
      const appsData = {};
      dataJobs.jobs.forEach(job => {
        appsData[job._id] = dataApps.applications.filter(app => app.jobId._id === job._id);
      });
      setApplications(appsData);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  // Update application status
  const handleUpdateStatus = async (appId, jobId, status) => {
    if (!["Accepted", "Rejected"].includes(status)) return; // safety check

    try {
      console.log("Updating status:", { appId, jobId, status });
      const res = await fetch(`http://localhost:5000/api/employers/applications/${appId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update status");
        return;
      }

      // Update UI state
      setApplications(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(app => app._id === appId ? { ...app, status } : app)
      }));

    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };

  // Toggle which applicant details are expanded
  const toggleApplicant = (jobId, appId) => {
    setExpandedApplicants(prev => ({ ...prev, [jobId]: prev[jobId] === appId ? null : appId }));
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="jobs-list">
      {jobs.length === 0 ? <p>No jobs posted yet.</p> :
        jobs.map(job => (
          <div key={job._id} className="job-card">
            <h3><strong>Title:</strong> {job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> {job.salary || "Not specified"}</p>
            <p>{job.description}</p>

            <h4>Applicants:</h4>
            {!applications[job._id] || applications[job._id].length === 0
              ? <p>No applicants yet.</p>
              : <select
                  value={expandedApplicants[job._id] || ""}
                  onChange={e => toggleApplicant(job._id, e.target.value)}
                >
                  <option value="" disabled>Select an applicant</option>
                  {applications[job._id].map(app => (
                    <option key={app._id} value={app._id}>{app.studentId?.name || "N/A"}</option>
                  ))}
                </select>
            }

            {expandedApplicants[job._id] &&
              applications[job._id]
                .filter(app => app._id === expandedApplicants[job._id])
                .map(app => (
                  <div key={app._id} className="applicant-card">
                    <p><strong>Name:</strong> {app.formData?.name || app.studentId?.name}</p>
                    <p><strong>Email:</strong> {app.studentId?.email}</p>
                    <p><strong>SRN:</strong> {app.formData?.srn}</p>
                    <p><strong>College:</strong> {app.formData?.college}</p>
                    <p><strong>10th:</strong> {app.formData?.class10}</p>
                    <p><strong>12th:</strong> {app.formData?.class12}</p>
                    <p><strong>Degree:</strong> {app.formData?.degree}</p>
                    <p><strong>Degree CGPA:</strong> {app.formData?.degreeCgpa}</p>
                    <p><strong>Skills:</strong> {app.formData?.skills}</p>
                    <p><strong>Projects:</strong> {app.formData?.projects}</p>
                    {app.formData?.resume &&
                      <p><strong>Resume:</strong> 
                        <a href={`http://localhost:5000/uploads/${app.formData.resume}`} target="_blank" rel="noopener noreferrer">View</a>
                      </p>
                    }
                    <p><strong>Status:</strong> {app.status}</p>

                    {app.status === "Pending" && (
                      <div>
                        <button onClick={() => handleUpdateStatus(app._id, job._id, "Accepted")}>Accept</button>
                        <button onClick={() => handleUpdateStatus(app._id, job._id, "Rejected")}>Reject</button>
                      </div>
                    )}
                  </div>
              ))
            }
          </div>
        ))
      }
    </div>
  );
};

export default MyJobs;
