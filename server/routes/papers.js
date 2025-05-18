const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const AuthorSubmission = require("../models/AuthorSubmission");
const SubmittedReview = require("../models/submittedReview");

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs are allowed."), false);
  },
});

// ✅ POST - Submit a new paper
router.post("/submit", upload.single("pdf"), async (req, res) => {
  try {
    const {
      title,
      abstract,
      keywords,
      authors,
      correspondingAuthor,
      correspondingAuthorEmail,
      category,
      conferenceId,
      conferenceName,
    } = req.body;

    const paper = new AuthorSubmission({
      title,
      abstract,
      keywords: keywords.split(",").map(k => k.trim()),
      authors: authors.split(",").map(a => a.trim()),
      correspondingAuthor: {
        name: correspondingAuthor,
        email: correspondingAuthorEmail,
      },
      category,
      filePath: `/uploads/${req.file.filename}`,
      conferenceId,
      conferenceName,
      assignedReviewers: [],
    });

    await paper.save();
    res.status(201).json({ message: "Paper submitted successfully!" });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Server error during submission." });
  }
});

// ✅ GET - All papers (minimal info)
router.get("/", async (req, res) => {
  try {
    const papers = await AuthorSubmission.find({}, "title _id assignedReviewers conferenceName");
    if (!papers.length) {
      return res.status(404).json({ message: "No papers found" });
    }
    res.status(200).json(papers);
  } catch (err) {
    console.error("Error fetching papers:", err);
    res.status(500).json({ message: "Failed to fetch papers." });
  }
});

// ✅ GET - Papers that can still be assigned (less than 2 reviewers)
router.get("/assignable", async (req, res) => {
  try {
    const papers = await AuthorSubmission.find(
      {
        $or: [
          { assignedReviewers: { $exists: false } },
          { assignedReviewers: { $size: 0 } },
          { assignedReviewers: { $size: 1 } },
        ],
      },
      "title _id assignedReviewers"
    );

    if (!papers.length) {
      return res.status(404).json({ message: "No assignable papers found" });
    }

    res.status(200).json(papers);
  } catch (err) {
    console.error("Error fetching assignable papers:", err);
    res.status(500).json({ message: "Failed to fetch assignable papers." });
  }
});

// ✅ GET - Papers with at least one submitted review
router.get("/reviewed", async (req, res) => {
  try {
    const reviewedPaperIds = await SubmittedReview.distinct("paperId");

    if (reviewedPaperIds.length === 0) {
      return res.status(404).json({ message: "No reviewed papers found." });
    }

    const reviewedPapers = await AuthorSubmission.find(
      { _id: { $in: reviewedPaperIds } },
      "title _id assignedReviewers conferenceName"
    );

    res.status(200).json(reviewedPapers);
  } catch (err) {
    console.error("Error fetching reviewed papers:", err);
    res.status(500).json({ message: "Failed to fetch reviewed papers." });
  }
});

// ✅ GET - Specific paper by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid paper ID." });
    }

    const paper = await AuthorSubmission.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found." });
    }

    res.status(200).json(paper);
  } catch (err) {
    console.error("Error fetching paper:", err);
    res.status(500).json({ message: "Error fetching paper." });
  }
});

module.exports = router;
