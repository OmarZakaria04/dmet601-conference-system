const mongoose = require("mongoose");

const reviewerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  PDF_IDs: [
    {
      paperId: { type: mongoose.Schema.Types.ObjectId, ref: "AuthorSubmission" },
      title: String,
      filePath: String,
    }
  ],
});

module.exports = mongoose.model("Reviewer", reviewerSchema,"reviewers");
