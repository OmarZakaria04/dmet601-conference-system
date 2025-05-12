const express = require("express");
const router = express.Router();
const Reviewer = require("../models/Reviewer");

// ✅ GET all reviewers — /api/reviewers
router.get("/", async (req, res) => {
  try {
    const reviewers = await Reviewer.find({}, "name email _id");
    res.status(200).json(reviewers);
  } catch (err) {
    console.error("Error fetching reviewers:", err);
    res.status(500).json({ message: "Failed to fetch reviewers." });
  }
});

// ✅ GET a single reviewer by ID — /api/reviewers/:id
router.get("/:id", async (req, res) => {
  try {
    const reviewer = await Reviewer.findById(req.params.id);
    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found." });
    }
    res.status(200).json(reviewer);
  } catch (err) {
    console.error("Reviewer lookup error:", err);
    res.status(500).json({ message: "Error fetching reviewer." });
  }
});

module.exports = router;
