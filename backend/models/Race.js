const mongoose = require("mongoose");

const raceSchema = new mongoose.Schema({
  season: String,
  round: String,
  raceName: String,
  circuit: {
    circuitId: String,
    name: String,
    locality: String,
    country: String
  },
  date: String,
  time: String,
  sessions: Object
});

module.exports = mongoose.model("Race", raceSchema);