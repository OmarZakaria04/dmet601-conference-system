const mongoose = require("mongoose");

const authorSubmissionSchema = new mongoose.Schema({
  title: String,
  abstract: String,
  keywords: [String],
  authors: [String],
  correspondingAuthor: {
    name: String,
    email: String,
  },
  category: String,
  filePath: String,
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  assignedReviewers: [String],
  // Add conference fields here
  conferenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conference',
  },
  conferenceName: String,
}, { collection: "AuthorSubmission" });

module.exports = mongoose.model("AuthorSubmission", authorSubmissionSchema, "AuthorSubmission");