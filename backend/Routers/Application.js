const express = require('express');
const Application = require('../model/Application');
const router = express.Router();

// Submit student application
router.post('/', async (req, res) => {
  try {
    const app = new Application(req.body);
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all applications (for teacher)
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update application (approve/reject + assign roll number)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;