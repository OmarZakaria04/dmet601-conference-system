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

module.exports = mongoose.model("SubmittedReview", submittedReviewSchema, "submittedReview");
