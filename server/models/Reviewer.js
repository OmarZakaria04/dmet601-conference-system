const mongoose = require('mongoose');

const reviewerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, // 👈 Make email required
    unique: true,   // 👈 Unique constraint
    sparse: true    // 👈 Allow null? (Only if email is optional)
  },
});

module.exports = mongoose.model('Reviewer', reviewerSchema);