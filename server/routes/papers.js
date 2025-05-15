const express = require("express");
const multer = require("multer");
const path = require("path");
const AuthorSubmission = require("../models/AuthorSubmission");
const router = express.Router();
const mongoose = require("mongoose");

// GET paper by ID
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

// Ensure /uploads folder exists
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

// POST submit paper
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
      assignedReviewers: [], // ✅ Initialize empty when paper is submitted
    });

    await paper.save();
    res.status(201).json({ message: "Paper submitted successfully!" });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Server error during submission." });
  }
});

// GET all papers (with assignedReviewers count)
router.get("/", async (req, res) => {
  try {
    const papers = await AuthorSubmission.find({}, "title _id assignedReviewers");
    if (!papers.length) {
      return res.status(404).json({ message: "No papers found" });
    }
    res.status(200).json(papers);
  } catch (err) {
    console.error("Error fetching papers:", err);
    res.status(500).json({ message: "Failed to fetch papers." });
  }
});

// ✅ NEW API: GET only assignable papers (less than 2 reviewers assigned)
router.get("/assignable", async (req, res) => {
  try {
    const papers = await AuthorSubmission.find({
      $or: [
        { assignedReviewers: { $exists: false } },
        { assignedReviewers: { $size: 0 } },
        { assignedReviewers: { $size: 1 } },
      ],
    }, "title _id assignedReviewers");

    if (!papers.length) {
      return res.status(404).json({ message: "No assignable papers found" });
    }

    res.status(200).json(papers);
  } catch (err) {
    console.error("Error fetching assignable papers:", err);
    res.status(500).json({ message: "Failed to fetch assignable papers." });
  }
});

module.exports = router;
