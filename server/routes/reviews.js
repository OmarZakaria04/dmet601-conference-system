const express = require("express");
const router = express.Router();
const SubmittedReview = require("../models/submittedReview");
const Reviewer = require("../models/Reviewer"); // Reviewer model import

// ✅ POST - Submit Review
router.post("/", async (req, res) => {
  try {
    const { paperId, grade, feedback, reviewerEmail } = req.body;

    if (!paperId || !grade || !feedback || !reviewerEmail) {
      return res.status(400).json({ message: "Paper ID, grade, feedback, and reviewer email are required." });
    }

    // Save the review
    const review = new SubmittedReview({
      paperId,
      grade,
      feedback,
      reviewerEmail, // optionally save reviewerEmail in review
    });

    await review.save();

    // Remove the paper assignment from the reviewer (fix: use .toString() to compare ObjectIds)
    const reviewer = await Reviewer.findOne({ email: reviewerEmail });
    if (reviewer) {
      // Filter out the paper with matching paperId
      reviewer.PDF_IDs = reviewer.PDF_IDs.filter(
        (pdf) => pdf.paperId.toString() !== paperId.toString()
      );

      await reviewer.save();
    }

    res.status(201).json({ message: "Review submitted successfully and paper removed from reviewer.", review });
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
