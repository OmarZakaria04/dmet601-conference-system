const express = require("express");
const router = express.Router();
const AuthorSubmission = require("../models/AuthorSubmission");
const Reviewer = require("../models/Reviewer");


// POST /api/assignments — assign paper to reviewer, update reviewer only
router.post("/", async (req, res) => {
  try {
    console.log("🔵 Incoming body:", req.body);

    const { reviewerEmail, paperId } = req.body;

    if (!reviewerEmail || !paperId) {
      return res.status(400).json({ message: "Reviewer Email and Paper ID are required." });
    }

    // Confirm paper exists and get its info
    const paper = await AuthorSubmission.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found." });
    }

    const paperInfo = {
      paperId: paper._id,
      title: paper.title,
      filePath: paper.filePath,
    };

    
    // Add paper info to reviewer only
    const reviewer = await Reviewer.findOneAndUpdate(
      { email: reviewerEmail },
      { $addToSet: { PDF_IDs: paperInfo } }, // Prevent duplicate papers
      { new: true }
    );


    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found with email." });
    }

    console.log(`✅ Paper '${paper.title}' assigned to Reviewer '${reviewer.name}' by email.`);
    res.status(200).json({ message: "Reviewer updated successfully!", reviewer });

  } catch (err) {
    console.error("❌ Assignment error:", err);
    res.status(500).json({ message: "Failed to assign reviewer." });
  }
});

module.exports = router;
