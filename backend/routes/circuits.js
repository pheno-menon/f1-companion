const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// __dirname works natively in CommonJS
const circuitsPath = path.join(__dirname, "../data/circuitsCurrent.json");

const circuits = JSON.parse(fs.readFileSync(circuitsPath, "utf-8"));

router.get("/current", (req, res) => {
  const enriched = circuits.map((circuit) => ({
    ...circuit,
    svgPath: `/assets/circuits/${circuit.layoutId}.svg`,
  }));

  res.json(enriched);
});

module.exports = router;