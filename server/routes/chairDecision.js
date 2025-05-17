const express = require("express");
const router = express.Router();
const ChairDecision = require("../models/chairDecision");
const AuthorSubmission = require("../models/AuthorSubmission");
const { sendEmail } = require("../utils/emailService"); // adjust path as needed

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

    // Compose email details
    const emailOptions = {
      from: '"Conference Chair" <dmet491@gmail.com>', // replace with your sender email
      to: paper.correspondingAuthor?.email, 
      subject: `Paper Decision: ${decision}`,
      text: `Dear ${paper.correspondingAuthor?.name || "Author"},\n\nYour paper titled "${paper.title}" has been ${decision}.\n\nRegards,\nConference Chair.`,
    };

    // Save or update decision in DB
    let message;
    const existingDecision = await ChairDecision.findOne({ paperId });

    if (existingDecision) {
      existingDecision.decision = decision;
      await existingDecision.save();
      message = "Decision updated successfully in DB.";
    } else {
      const chairDecision = new ChairDecision({ paperId, decision });
      await chairDecision.save();
      message = "Decision recorded successfully in DB.";
    }

    // Send notification email
    try {
      await sendEmail(emailOptions);
      message += " Email notification sent.";
    } catch (emailErr) {
      console.error("❌ Error sending email:", emailErr);
      message += " BUT failed to send email notification.";
    }

    return res.status(200).json({ message });
  } catch (err) {
    console.error("❌ Error processing chair decision:", err);
    res.status(500).json({ message: "Failed to process decision." });
  }
});

module.exports = router;
