const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver");

router.get("/", async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

module.exports = router;