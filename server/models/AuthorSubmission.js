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
});

module.exports = mongoose.model("AuthorSubmission", authorSubmissionSchema, "AuthorSubmission");
