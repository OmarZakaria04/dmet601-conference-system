const express = require("express");
const router = express.Router();
const AuthorSubmission = require("../models/AuthorSubmission");
const Reviewer = require("../models/Reviewer");

// POST /api/assignments
router.post("/", async (req, res) => {
  try {
    console.log("🔵 Incoming body:", req.body);

    if (!req.body || typeof req.body !== "object") {
      console.log("❌ Invalid or missing body");
      return res.status(400).json({ message: "Invalid or missing request body." });
    }

    const { reviewerId, paperId } = req.body;

    if (!reviewerId || !paperId) {
      console.log("❌ Missing reviewerId or paperId");
      return res.status(400).json({ message: "Reviewer ID and Paper ID are required." });
    }

    // Confirm paper exists
    const paper = await AuthorSubmission.findById(paperId);
    if (!paper) {
      console.log("❌ Paper not found");
      return res.status(404).json({ message: "Paper not found." });
    }

    // Add reviewerId to paper assignedReviewers
    await AuthorSubmission.findByIdAndUpdate(
      paperId,
      { $addToSet: { assignedReviewers: reviewerId } },
      { new: true }
    );

    // Prepare paper info
    const paperInfo = {
      paperId: paper._id,
      title: paper.title,
      filePath: paper.filePath,
    };

    // Add paper info to reviewer
    const reviewer = await Reviewer.findByIdAndUpdate(
      reviewerId,
      { $addToSet: { PDF_IDs: paperInfo } },
      { new: true }
    );

    
  if (!reviewer) {
    console.log("❌ Reviewer not found with ID:", reviewerId);
    return res.status(404).json({ message: "Reviewer not found." });
  }
  
    console.log("📝 Added paper to reviewer:", reviewerId);
    console.log(`✅ Paper '${paper.title}' assigned to Reviewer '${reviewer.name}'`);
    res.status(200).json({ message: "Reviewer assigned successfully!" });

  } catch (err) {
    console.error("❌ Assignment error:", err);
    res.status(500).json({ message: "Failed to assign reviewer." });
  }
});

module.exports = router;
