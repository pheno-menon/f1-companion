const express = require("express");
const router = express.Router();
const Constructor = require("../models/Constructor");

router.get("/", async (req, res) => {
  const constructors = await Constructor.find();
  res.json(constructors);
});

module.exports = router;