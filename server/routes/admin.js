const express = require("express");
const User = require("../models/User");
const Reviewer = require("../models/Reviewer");
const router = express.Router();

// Route to get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
});

// Route to update user roles (admin only)
router.put("/update-role/:id", async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  const validRoles = ["admin", "user", "chair", "reviewer", "author"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role
    user.role = role;
    await user.save();

    // If reviewer, also insert into reviewers collection (if not exists)
    if (role === "reviewer") {
      const reviewerExists = await Reviewer.findOne({ email: user.email });
      if (!reviewerExists) {
        const reviewer = new Reviewer({
          name: user.email.split('@')[0], // fallback: use email prefix as name
          email: user.email,
          PDF_IDs: [],
        });
        await reviewer.save();
        console.log(`✅ Reviewer added: ${user.email}`);
      }
    }

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    console.error("❌ Error updating role:", err);
    res.status(500).json({ message: "Failed to update user role", error: err });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user." });
  }
});

module.exports = router;
