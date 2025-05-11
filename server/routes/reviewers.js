const express = require("express");
const router = express.Router();
const Reviewer = require("../models/Reviewer");

router.get("/", async (req, res) => {
  try {
    const reviewers = await Reviewer.find({}, "name email _id"); // Explicitly include _id
    res.status(200).json(reviewers);
  } catch (err) {
    console.error("Error fetching reviewers:", err);
    res.status(500).json({ message: "Failed to fetch reviewers." });
  }
});

module.exports = router;