const express = require("express");
const router = express.Router();
const AuthorSubmission = require("../models/AuthorSubmission");
const Reviewer = require("../models/Reviewer");

// POST /api/assignments
router.post("/", async (req, res) => {
  try {
    const { reviewerId, paperId } = req.body;

    if (!reviewerId || !paperId) {
      return res.status(400).json({ message: "Reviewer ID and Paper ID are required." });
    }

    // 1. Update the paper with the reviewer ID
    await AuthorSubmission.findByIdAndUpdate(paperId, {
      $addToSet: { assignedReviewers: reviewerId },
    });

    // 2. Get paper info
    const paper = await AuthorSubmission.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found." });
    }

    const paperInfo = {
      paperId: paper._id,
      title: paper.title,
      filePath: paper.filePath,
    };

    // 3. Update reviewer with paper info
    await Reviewer.findByIdAndUpdate(
      reviewerId,
      { $addToSet: { PDF_IDs: paperInfo } }, // prevent duplicate entries
      { new: true }
    );

    res.json({ message: "Reviewer assigned successfully!" });
  } catch (err) {
    console.error("Assignment error:", err);
    res.status(500).json({ message: "Failed to assign reviewer." });
  }
});

module.exports = router;
