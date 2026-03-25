const express = require("express");
const router = express.Router();
const Race = require("../models/Race");

router.get("/", async (req, res) => {
  const races = await Race.find().sort({ date: 1 });
  res.json(races);
});

module.exports = router;