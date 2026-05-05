const express = require("express");
const router = express.Router();
const { getDB } = require("../db");

// =========================
// 📤 CREATE REPORT
// =========================
router.post("/report", async (req, res) => {
  try {
    const db = getDB();

    console.log("BODY:", req.body);

    const { type, detail, location } = req.body;

    if (!type || !detail) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newReport = {
      type,
      detail,
      location: location || null,
      status: "pending",
      time: new Date(),
    };

    await db.collection("reports").insertOne(newReport);

    return res.status(201).json({
      message: "saved",
      data: newReport,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// =========================
// 📥 GET ALL REPORTS
// =========================
router.get("/report", async (req, res) => {
  try {
    const db = getDB();

    const reports = await db
      .collection("reports")
      .find()
      .sort({ time: -1 })
      .toArray();

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;