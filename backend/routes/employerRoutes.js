const express = require("express");
const router = express.Router();
const Employer = require("../models/Employer");
const Job = require("../models/Job");
const Application = require("../models/Application");
const generateToken = require("../utils/jwt");
const authenticateToken = require("../middleware/auth");

// ======================
// Employer Registration
// ======================
router.post("/register", async (req, res) => {
  try {
    const { companyName, email, password } = req.body;
    const existing = await Employer.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email exists" });

    const employer = await Employer.create({ companyName, email, password });
    const token = generateToken(employer._id, "employer");

    res.status(201).json({ success: true, employer, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ======================
// Employer Login
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const employer = await Employer.findOne({ email });
    if (!employer || !(await employer.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(employer._id, "employer");
    res.json({ success: true, employer, token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ======================
// Post a Job
// ======================
router.post("/jobs", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "employer")
      return res.status(403).json({ success: false, message: "Forbidden" });

    const { title, company, location, description, salary } = req.body;
    const job = await Job.create({
      employerId: req.user.id,
      title,
      company,
      location,
      description,
      salary,
    });

    res.status(201).json({ success: true, job });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ======================
// Get all jobs posted by this employer
// ======================
router.get("/jobs", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "employer")
      return res.status(403).json({ success: false, message: "Forbidden" });

    const jobs = await Job.find({ employerId: req.user.id });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ======================
// Get applications for this employer
// ======================
router.get("/applications", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "employer")
      return res.status(403).json({ success: false, message: "Forbidden" });

    const applications = await Application.find({ employerId: req.user.id })
      .populate("studentId", "name email")
      .populate("jobId", "title company");

    res.json({ success: true, applications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ======================
// Update application status
// ======================
router.put("/applications/:appId/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "employer")
      return res.status(403).json({ success: false, message: "Forbidden" });

    const application = await Application.findById(req.params.appId);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    if (application.employerId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Forbidden" });

    const { status } = req.body;
    if (!["Pending", "Accepted", "Rejected"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    application.status = status;
    await application.save();

    await application.populate("studentId", "name email").populate("jobId", "title company");

    res.json({ success: true, application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
