const express = require("express");
const router = express.Router();
const ChairDecision = require("../models/chairDecision");
const AuthorSubmission = require("../models/AuthorSubmission");
const SubmittedReview = require("../models/submittedReview"); // add this
const { sendEmail } = require("../utils/emailService"); // adjust path as needed

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

    // Fetch all reviews for this paper
    const reviews = await SubmittedReview.find({ paperId });

    // Format reviews for email body
    let reviewsText = "Reviews Summary:\n\n";
    if (reviews.length === 0) {
      reviewsText += "No reviews available.\n";
    } else {
      reviews.forEach((review, idx) => {
        reviewsText += `Reviewer #${idx + 1}:\n`;
        reviewsText += `Grade: ${review.grade}\n`;
        reviewsText += `Feedback: ${review.feedback}\n\n`;
      });
    }

    // Compose email details including reviews
    const emailOptions = {
      from: '"Conference Chair" <dmet491@gmail.com>', // replace with your sender email
      to: paper.correspondingAuthor?.email,
      subject: `Paper Decision: ${decision}`,
      text: `Dear ${paper.correspondingAuthor?.name || "Author"},\n\n` +
            `Your paper titled "${paper.title}" has been ${decision}.\n\n` +
            `${reviewsText}` +
            `Regards,\nConference Chair.`,
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

      // Remove the submission after successful email
      await AuthorSubmission.findByIdAndDelete(paperId);
      message += " Author submission removed.";
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
