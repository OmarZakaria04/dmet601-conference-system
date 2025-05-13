const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the "Auth" collection
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Route to update the user's role
router.put('/update-role/:id', async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  // Validate role
  const validRoles = ['admin', 'user', 'chair', 'reviewer', 'author'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role
    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user role" });
  }
});

module.exports = router;
