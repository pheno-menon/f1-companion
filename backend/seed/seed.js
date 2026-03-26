require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

const Race = require("../models/Race");
const Driver = require("../models/Driver");
const Constructor = require("../models/Constructor");

const races = JSON.parse(fs.readFileSync("./data/races.json"));
const drivers = JSON.parse(fs.readFileSync("./data/drivers.json"));
const constructors = JSON.parse(fs.readFileSync("./data/constructors.json"));

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Race.deleteMany();
  await Driver.deleteMany();
  await Constructor.deleteMany();

  const formattedRaces = races.map(r => ({
    season: r.season,
    round: r.round,
    raceName: r.raceName,
    circuit: {
      circuitId: r.Circuit.circuitId,
      name: r.Circuit.circuitName,
      locality: r.Circuit.Location.locality,
      country: r.Circuit.Location.country
    },
    date: new Date(r.date),
    time: r.time,
    sessions: {
      fp1: r.FirstPractice,
      fp2: r.SecondPractice,
      fp3: r.ThirdPractice,
      qualifying: r.Qualifying,
      sprintQualifying: r.SprintQualifying,
      sprint: r.Sprint
    }
  }));

  await Race.insertMany(formattedRaces);
  await Driver.insertMany(drivers);
  await Constructor.insertMany(constructors);

  console.log("Data Seeded");
  process.exit();
};

seed();