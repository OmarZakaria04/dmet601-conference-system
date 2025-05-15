const express = require("express");
const router = express.Router();
const SubmittedReview = require("../models/submittedReview");

// ✅ POST - Submit Review
router.post("/", async (req, res) => {
  try {
    const { paperId, grade, feedback } = req.body;

    if (!paperId || !grade || !feedback) {
      return res.status(400).json({ message: "Paper ID, grade, and feedback are required." });
    }

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

// ✅ GET - Get all reviews by paper ID
router.get("/by-paper/:paperId", async (req, res) => {
  try {
    const { paperId } = req.params;

    const reviews = await SubmittedReview.find({ paperId });

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this paper." });
    }

    res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews." });
  }
});

module.exports = router;
