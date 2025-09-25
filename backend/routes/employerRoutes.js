const express = require("express");
const router = express.Router();
const Employer = require("../models/Employer");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Register
router.post("/register", async (req, res) => {
  try {
    const { companyName, email, password } = req.body;
    const existing = await Employer.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    const employer = new Employer({ companyName, email, password });
    await employer.save();
    res.status(201).json({ success: true, employer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const employer = await Employer.findOne({ email, password });
    if (!employer) return res.status(401).json({ success: false, message: "Invalid credentials" });
    res.json({ success: true, employer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Post a job
router.post("/:employerId/jobs", async (req, res) => {
  try {
    const { employerId } = req.params;
    const { title, company, location, description, salary } = req.body;
    const job = new Job({ title, company, location, description, salary, employerId });
    await job.save();
    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all jobs by employer
router.get("/:employerId/jobs", async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all applications for employer's jobs
router.get("/:employerId/applications", async (req, res) => {
  try {
    const applications = await Application.find({ employerId: req.params.employerId })
      .populate("studentId", "name email") // populate student name and email
      .populate("jobId", "title company"); // populate job title & company

    res.json({ success: true, applications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


// Update application status
router.put("/applications/:applicationId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.applicationId);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    application.status = status;
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
