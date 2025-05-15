const mongoose = require("mongoose");

const chairDecisionSchema = new mongoose.Schema({
  paperId: { type: mongoose.Schema.Types.ObjectId, ref: "AuthorSubmission", required: true },
  decision: { type: String, enum: ["Approved", "Declined"], required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChairDecision", chairDecisionSchema);
