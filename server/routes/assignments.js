const express = require("express");
const router = express.Router();
const AuthorSubmission = require("../models/AuthorSubmission");
const Reviewer = require("../models/Reviewer");

router.post("/", async (req, res) => {
  try {
    console.log("🔵 Incoming body:", req.body);

    const { reviewerEmail, paperId } = req.body;

    if (!reviewerEmail || !paperId) {
      return res.status(400).json({ message: "Reviewer Email and Paper ID are required." });
    }

    // ✅ Get paper
    const paper = await AuthorSubmission.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found." });
    }

    // ✅ Check if paper already has 3 reviewers assigned
    if (paper.assignedReviewers && paper.assignedReviewers.length >= 3) {
      return res.status(400).json({ message: "This paper already has 3 reviewers assigned." });
    }

    // ✅ Check if reviewer is already assigned to this paper
    if (paper.assignedReviewers && paper.assignedReviewers.includes(reviewerEmail)) {
      return res.status(400).json({ message: "This reviewer is already assigned to this paper." });
    }

    // ✅ Update reviewer (add paper info to PDF_IDs)
    const paperInfo = {
      paperId: paper._id.toString(),
      title: paper.title,
      filePath: paper.filePath,
    };

    const reviewer = await Reviewer.findOneAndUpdate(
      { email: reviewerEmail },
      { $addToSet: { PDF_IDs: paperInfo } },
      { new: true }
    );

    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found with email." });
    }

    // ✅ Update paper (add reviewer email to assignedReviewers)
    await AuthorSubmission.findByIdAndUpdate(
      paperId,
      { $addToSet: { assignedReviewers: reviewerEmail } }
    );

    console.log(`✅ Paper '${paper.title}' assigned to Reviewer '${reviewer.name}' successfully.`);
    res.status(200).json({ message: "Paper assigned and updated successfully." });

  } catch (err) {
    console.error("❌ Assignment error:", err);
    res.status(500).json({ message: "Failed to assign reviewer." });
  }
});

module.exports = router;
