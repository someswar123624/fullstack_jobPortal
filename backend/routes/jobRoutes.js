const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const authenticateToken = require("../middleware/auth");

// Get all jobs (for students)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get applications for a specific job (for employers)
router.get("/applications/:jobId", authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("studentId", "name email");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
