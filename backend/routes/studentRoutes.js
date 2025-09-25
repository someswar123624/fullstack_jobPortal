const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Job = require("../models/Job");
const Application = require("../models/Application");
const multer = require("multer");
const path = require("path");

// ----------------- MULTER CONFIG -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ----------------- STUDENT ROUTES -------------------

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    const student = new Student({ name, email, password });
    await student.save();
    res.status(201).json({ success: true, student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email, password });
    if (!student) return res.status(401).json({ success: false, message: "Invalid credentials" });
    res.json({ success: true, student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get student's applications
router.get("/:studentId/applications", async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.params.studentId })
      .populate("jobId")
      .populate("employerId");
    res.json({ success: true, applications });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Apply for a job with form data + resume
router.post("/:studentId/apply/:jobId", upload.single("resume"), async (req, res) => {
  try {
    const { studentId, jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const existing = await Application.findOne({ studentId, jobId });
    if (existing) return res.status(400).json({ success: false, message: "Already applied" });

    const application = new Application({
      studentId,
      jobId,
      employerId: job.employerId,
      formData: {
        name: req.body.name,
        srn: req.body.srn,
        college: req.body.college,
        class10: req.body.class10,
        class12: req.body.class12,
        degree: req.body.degree,
        degreeCgpa: req.body.degreeCgpa,
        skills: req.body.skills,
        projects: req.body.projects,
        resume: req.file ? req.file.filename : null, // save filename
      },
      status: "Pending",
    });

    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});


module.exports = router;
