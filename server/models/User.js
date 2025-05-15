// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String},
}, { collection: "Auth" }); // 👈 Force the collection name

module.exports = mongoose.model("User", userSchema);
