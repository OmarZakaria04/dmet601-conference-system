const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const SubmittedReview = require("../models/submittedReview");
const Reviewer = require("../models/Reviewer"); // ✅ Ensure this model exists

// ✅ POST - Submit a Review
router.post("/", async (req, res) => {
  try {
    const { paperId, grade, feedback, reviewerEmail } = req.body;

    if (!paperId || !grade || !feedback || !reviewerEmail) {
      return res.status(400).json({ message: "Paper ID, grade, feedback, and reviewer email are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return res.status(400).json({ message: "Invalid paper ID format." });
    }

    // Save the review to submittedReview collection
    const review = new SubmittedReview({
      paperId,
      grade,
      feedback,
      reviewerEmail,
    });

    await review.save();

    // Remove the reviewed paper from the reviewer's assigned list
    const reviewer = await Reviewer.findOne({ email: reviewerEmail });
    if (reviewer) {
      reviewer.PDF_IDs = reviewer.PDF_IDs.filter(
        (pdf) => pdf.paperId.toString() !== paperId.toString()
      );
      await reviewer.save();
    }

    res.status(201).json({
      message: "Review submitted successfully and paper removed from reviewer's list.",
      review,
    });
  } catch (err) {
    console.error("❌ Review submission error:", err);
    res.status(500).json({ message: "Failed to submit review." });
  }
});

// ✅ GET - Get all reviews for a given paper ID
router.get("/by-paper/:paperId", async (req, res) => {
  try {
    const { paperId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(paperId)) {
      return res.status(400).json({ message: "Invalid paper ID format." });
    }

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
