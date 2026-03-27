const express = require("express");
const router = express.Router();
const DriverStanding = require("../models/DriverStanding");

router.get("/", async(req, res) => {
    const standings = await DriverStanding.find().sort({ position: 1 });
    res.json(standings);
});

module.exports = router;