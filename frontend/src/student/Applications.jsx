import React, { useEffect, useState } from "react";
import "./Applications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/applications", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // include JWT
          },
        });

        const data = await res.json();
        if (data.success) {
          setApplications(data.applications);
        } else {
          console.error(data.message || "Failed to fetch applications");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading applications...</p>;

  if (applications.length === 0) return <p>No applications found.</p>;

  return (
    <div className="applications-container">
      {applications.map((app) => (
        <div className="application-card" key={app._id}>
          <h3>{app.jobId?.title || "N/A"}</h3>
          <p><strong>Company:</strong> {app.jobId?.company || "N/A"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${app.status.toLowerCase() || "pending"}`}>
              {app.status || "Pending"}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Applications;
