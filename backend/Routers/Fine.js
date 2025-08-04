// routes/fineRoutes.js
const express = require("express");
const router = express.Router();
const Fine = require("../model/Fine");

// POST /api/fines
router.post("/fines", async (req, res) => {
    try {
        const { rollNo, fines } = req.body;

        if (!rollNo || !Array.isArray(fines) || fines.length === 0) {
            return res.status(400).json({ error: "Invalid data" });
        }

        const fineDoc = new Fine({ rollNo, fines });
        await fineDoc.save();

        res.status(201).json({ message: "Fine recorded successfully", fine: fineDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});
 

router.get("/academic_fines/:rollNo", async (req, res) => {
    const { rollNo } = req.params; // Use params, not query
    console.log("RollNo from params:", rollNo); // Should print a string like "2025400014"

    if (!rollNo) {
        return res.status(400).send("enter your rollno");
    }

    try {
        const data = await Fine.findOne({ rollNo: String(rollNo) }); // Match as string
        if (!data) {
            return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching fine:", error);
        res.status(500).json({ message: "Server error" });
    }
});



module.exports = router;
