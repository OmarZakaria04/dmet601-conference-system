const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  deadline: { type: Date, required: true },
  description: { type: String }
}, { timestamps: true });

const Conference = mongoose.model('Conference', conferenceSchema);

module.exports = Conference;
