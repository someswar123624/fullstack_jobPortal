const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const authenticateToken = require("../middleware/auth");

// ==============================
// Update Application Status
// ==============================
router.put("/:appId/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Find the application
    const application = await Application.findById(req.params.appId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Check if logged-in user is the employer of this job
    if (req.user.role !== "employer" || req.user.id !== application.employerId.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Update status
    application.status = status;
    await application.save();

    // Populate student and job info
    await application.populate("studentId", "name email").populate("jobId", "title company");

    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
