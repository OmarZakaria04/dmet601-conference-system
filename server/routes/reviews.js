const express = require("express");
const router = express.Router();
const SubmittedReview = require("../models/submittedReview");

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { paperId, grade, feedback } = req.body;

    // Basic validation
    if (!paperId || !grade || !feedback) {
      return res.status(400).json({ message: "Paper ID, grade, and feedback are required." });
    }

    // Create the review
    const review = new SubmittedReview({
      paperId,
      grade,
      feedback,
    });

    await review.save();
    res.status(201).json({ message: "Review submitted successfully!", review });
  } catch (err) {
    console.error("❌ Review submission error:", err);
    res.status(500).json({ message: "Failed to submit review." });
  }
});

module.exports = router;
