const express = require("express");
const router = express.Router();

const { getDB } = require("../db");
const tokenRequired = require("../middleware/jwt");

// latest
router.get("/latest", tokenRequired, async (req, res) => {
  const db = getDB();
  const col = db.collection("people_count");

  const data = await col
    .find({ station: "station1" })
    .sort({ timestamp: -1 })
    .limit(1)
    .toArray();

  if (data.length === 0) return res.json({});

  res.json({
    station1: {
      waiting: data[0].waiting,
      status: data[0].status
    }
  });
});

// all
router.get("/all", async (req, res) => {
  const db = getDB();
  const col = db.collection("people_count");

  const data = await col
    .find()
    .sort({ timestamp: -1 })
    .limit(20)
    .toArray();

  res.json(data);
});

module.exports = router;