import React, { useState } from "react";

const ApplyForm = ({ studentId, jobId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "", srn: "", college: "", class10: "", class12: "",
    degree: "", degreeCgpa: "", skills: "", projects: "", resume: null
  });

  const token = localStorage.getItem("token"); // JWT token

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData(prev => ({ ...prev, [name]: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));

      const res = await fetch(`http://localhost:5000/api/students/${studentId}/apply/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Application submitted successfully!");
        setFormData({
          name: "", srn: "", college: "", class10: "", class12: "",
          degree: "", degreeCgpa: "", skills: "", projects: "", resume: null
        });
        onSuccess && onSuccess(); // Callback to parent to close form or refresh
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className="application-form" style={{ marginTop: "10px" }} onSubmit={handleSubmit}>
      <h4>Student Details</h4>
      <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
      <input name="srn" placeholder="SRN" value={formData.srn} onChange={handleChange} required />
      <input name="college" placeholder="College Name" value={formData.college} onChange={handleChange} required />
      <input name="class10" placeholder="10th Percentage" value={formData.class10} onChange={handleChange} required />
      <input name="class12" placeholder="12th Percentage" value={formData.class12} onChange={handleChange} required />
      <input name="degree" placeholder="Degree Name" value={formData.degree} onChange={handleChange} required />
      <input name="degreeCgpa" placeholder="Degree CGPA/Percentage" value={formData.degreeCgpa} onChange={handleChange} required />
      <textarea name="skills" placeholder="Skills (comma separated)" value={formData.skills} onChange={handleChange} required />
      <textarea name="projects" placeholder="Projects" value={formData.projects} onChange={handleChange} />
      <input type="file" name="resume" onChange={handleChange} />
      <button type="submit">Submit Application</button>
    </form>
  );
};

export default ApplyForm;
