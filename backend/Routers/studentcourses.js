const express = require("express");
const router = express.Router();
const StudentSelection = require("../model/selectedcourses");
router.get("/", async (req, res) => {
  try {
    const students = await StudentSelection.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students." });
  }
});
router.post("/submit", async (req, res) => {
  try {
    const { marks, course, subjects , rollNo } = req.body;

    const entry = new StudentSelection({
        rollNo,
      marks,
      course,
      subjects
    });

    await entry.save();

    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data." });
  }
});

module.exports = router;
