const express = require('express');
const router = express.Router();
const Conference = require('../models/Conference');

router.get('/', async (req, res) => {
  try {
    const conferences = await Conference.find();
    res.json(conferences);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
