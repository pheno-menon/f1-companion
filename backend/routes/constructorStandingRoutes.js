const express = require("express");
const router = express.Router();
const ConstructorStanding = require("../models/ConstructorStanding");

router.get("/", async (req, res) => {
  const constructors = await ConstructorStanding.find().sort({ position: 1 });
  res.json(constructors);
});

module.exports = router;