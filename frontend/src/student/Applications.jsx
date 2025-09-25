import React, { useEffect, useState } from "react";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students/applications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setApplications(data.applications);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleWithdraw = async appId => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/applications/${appId}/withdraw`, {
        method: "PUT", headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setApplications(prev => prev.map(app => app._id === appId ? { ...app, status: "Withdrawn" } : app));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchApplications(); }, []);

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="applications-container">
      {applications.length === 0 ? <p>No applications yet.</p> :
        applications.map(app => (
          <div key={app._id} className="application-card">
            <h3>{app.jobId?.title || "N/A"}</h3>
            <p><strong>Company:</strong> {app.jobId?.company || "N/A"}</p>
            <p><strong>Status:</strong> {app.status}</p>
            {app.status === "Pending" && <button onClick={() => handleWithdraw(app._id)}>Withdraw</button>}
          </div>
        ))
      }
    </div>
  );
};

export default Applications;
