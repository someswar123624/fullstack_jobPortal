import React, { useEffect, useState } from "react";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) throw new Error("User not logged in");

      const res = await fetch(
        `http://localhost:5000/api/students/${user._id}/applications`
      );

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();

      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications);
      } else {
        setApplications([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setApplications([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Optional: Function to withdraw an application
  const handleWithdraw = async (appId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/students/applications/${appId}/withdraw`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: "Withdrawn" } : app
          )
        );
      }
    } catch (err) {
      console.error("Failed to withdraw application:", err);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="applications-container">
      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        applications.map((app) => {
          const job = app.jobId || {};
          return (
            <div key={app._id} className="application-card">
              <h3> <strong>Tittle:</strong> { job.title || "Job Title Not Available"}</h3>
              <p>
                <strong>Company:</strong> {job.company || "N/A"}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary || "N/A"}
              </p>
               <p>
                <strong>Description:</strong> {job.description || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {app.status || "Pending"}
              </p>
              {/* Show withdraw button only if pending */}
              {app.status === "Pending" && (
                <button onClick={() => handleWithdraw(app._id)}>
                  Withdraw Application
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Applications;
