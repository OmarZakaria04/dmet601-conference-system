const express = require("express");
const multer = require("multer");
const path = require("path");
const AuthorSubmission = require("../models/Paper");

const router = express.Router();

// Setup multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "server/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs are allowed"), false);
  },
});

// POST /api/papers/submit
router.post("/submit", upload.single("pdf"), async (req, res) => {
  try {
    const {
      title,
      abstract,
      keywords,
      authors,
      correspondingAuthor,
      correspondingAuthorEmail,
    } = req.body;

    const newSubmission = new AuthorSubmission({
      title,
      abstract,
      keywords: keywords.split(",").map(k => k.trim()),
      authors: authors.split(",").map(a => a.trim()),
      correspondingAuthor: {
        name: correspondingAuthor,
        email: correspondingAuthorEmail,
      },
      filePath: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newSubmission.save();

    res.status(201).json({ message: "Paper submitted and saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submission failed." });
  }
});

module.exports = router;
