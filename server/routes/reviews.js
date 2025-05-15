const express = require("express");
const router = express.Router();
const SubmittedReview = require("../models/submittedReview");
const Reviewer = require("../models/Reviewer");

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { paperId, grade, feedback, reviewerEmail } = req.body;

    // ✅ Validation
    if (!paperId || !grade || !feedback || !reviewerEmail) {
      return res.status(400).json({ message: "Paper ID, grade, feedback, and reviewer email are required." });
    }

    // ✅ 1. Save the review
    const review = new SubmittedReview({
      paperId,
      grade,
      feedback,
    });

    await review.save();

    // ✅ 2. Remove paper from reviewer's PDF_IDs array
    const reviewer = await Reviewer.findOneAndUpdate(
      { email: reviewerEmail },
      { $pull: { PDF_IDs: { paperId: paperId } } },
      { new: true }
    );

    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found. Cleanup failed." });
    }

    res.status(201).json({ message: "Review submitted successfully and paper removed from reviewer.", review });

  } catch (err) {
    console.error("❌ Review submission error:", err);
    res.status(500).json({ message: "Failed to submit review." });
  }
});

module.exports = router;
