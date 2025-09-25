const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");

// Get all jobs (for students)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all jobs of an employer
router.get("/:employerId/jobs", async (req, res) => {
  const jobs = await Job.find({ employerId: req.params.employerId });
  res.json({ success: true, jobs });
});

// Get applications for a specific job
router.get("/:jobId/applications", async (req, res) => {
  const applications = await Application.find({ jobId: req.params.jobId }).populate("studentId");
  res.json({ success: true, applications });
});

module.exports = router;
