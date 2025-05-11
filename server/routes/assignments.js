const express = require("express");
const router = express.Router();
const AuthorSubmission = require("../models/AuthorSubmission");

router.post("/", async (req, res) => {
  try {
    const { reviewerId, paperId } = req.body;
    
    // Update paper with reviewer assignment
    await AuthorSubmission.findByIdAndUpdate(paperId, {
      $addToSet: { assignedReviewers: reviewerId }
    });

    res.json({ message: "Reviewer assigned successfully!" });
  } catch (err) {
    console.error("Assignment error:", err);
    res.status(500).json({ message: "Failed to assign reviewer." });
  }
});

module.exports = router;