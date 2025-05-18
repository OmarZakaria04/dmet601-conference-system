const mongoose = require("mongoose");

const submittedReviewSchema = new mongoose.Schema({
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
}, { collection: "submittedReview" });

// Check if model already exists, otherwise create it
module.exports = mongoose.models.SubmittedReview || mongoose.model("SubmittedReview", submittedReviewSchema, "submittedReview");
