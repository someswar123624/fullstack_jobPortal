const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// Update application status (Accept / Reject)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Rejected"
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    application.status = status;
    await application.save();

    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
