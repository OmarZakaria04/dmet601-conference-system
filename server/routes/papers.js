const express = require("express");
const multer = require("multer");
const path = require("path");
const AuthorSubmission = require("../models/AuthorSubmission");

const router = express.Router();

// Ensure /uploads folder exists (create it manually if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "server/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs are allowed."), false);
  },
});

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
    });

    await paper.save();
    res.status(201).json({ message: "Paper submitted successfully!" });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: "Server error during submission." });
  }
});

module.exports = router;
