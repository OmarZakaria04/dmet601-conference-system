const express = require("express");
const router = express.Router();
const ChairDecision = require("../models/chairDecision");
const AuthorSubmission = require("../models/AuthorSubmission");

// ✅ POST - Chair submits decision (approve/decline)
router.post("/", async (req, res) => {
  try {
    const { paperId, decision } = req.body;

    if (!paperId || !decision) {
      return res.status(400).json({ message: "Paper ID and decision are required." });
    }

    const paper = await AuthorSubmission.findById(paperId);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found." });
    }

    // ✅ Save or update decision (optional: prevent duplicates by updating if already exists)
    const existingDecision = await ChairDecision.findOne({ paperId });

    if (existingDecision) {
      existingDecision.decision = decision;
      await existingDecision.save();
      return res.status(200).json({ message: "Decision updated successfully in DB." });
    } else {
      const chairDecision = new ChairDecision({
        paperId,
        decision,
      });
      await chairDecision.save();
      return res.status(201).json({ message: "Decision recorded successfully in DB." });
    }
  } catch (err) {
    console.error("❌ Error processing chair decision:", err);
    res.status(500).json({ message: "Failed to process decision." });
  }
});

module.exports = router;
