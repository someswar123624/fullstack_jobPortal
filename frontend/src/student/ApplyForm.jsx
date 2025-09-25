import React, { useState } from "react";

const ApplyForm = ({ job, student, onClose }) => {
  const [formData, setFormData] = useState({
    contactNumber: "",
    resume: "",
    coverLetter: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/${job._id}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student._id,
            employerId: job.employerId,
            additionalInfo: formData, // save extra info
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Application submitted successfully!");
        onClose(); // close form after submission
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="apply-form">
      <h3>Apply for {job.title}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />
        <textarea
          name="coverLetter"
          placeholder="Cover Letter"
          value={formData.coverLetter}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="resume"
          placeholder="Resume Link or Text"
          value={formData.resume}
          onChange={handleChange}
        />
        <button type="submit">Submit Application</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default ApplyForm;
