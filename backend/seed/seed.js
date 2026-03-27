require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");

const Race = require("../models/Race");
const Driver = require("../models/Driver");
const Constructor = require("../models/Constructor");
const DriverStanding = require("../models/DriverStanding");
const ConstructorStanding = require("../models/ConstructorStanding");

const races = JSON.parse(fs.readFileSync("./data/races.json"));
const drivers = JSON.parse(fs.readFileSync("./data/drivers.json"));
const constructors = JSON.parse(fs.readFileSync("./data/constructors.json"));
const driverStandings = JSON.parse(fs.readFileSync("./data/driverStandings.json"));
const constructorStandings = JSON.parse(fs.readFileSync("./data/constructorStandings.json"));

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Race.deleteMany();
  await Driver.deleteMany();
  await Constructor.deleteMany();
  await DriverStanding.deleteMany();
  await ConstructorStanding.deleteMany();

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

  const formattedDriverStandings = driverStandings.map(d => ({
    position: d.position,
    points: d.points,
    wins: d.wins,
    driver: {
      driverId: d.Driver.driverId,
      driverNumber: d.Driver.permanentNumber,
      driverCode: d.Driver.code,
      driverGivenName: d.Driver.givenName,
      driverFamilyName: d.Driver.familyName,
      driverNationality: d.Driver.nationality
    },
    constructorInfo: {
      constructorId: d.Constructors[0].constructorId,
      name: d.Constructors[0].name,
      nationality: d.Constructors[0].nationality
    }
  }));

  const formattedConstructorStandings = constructorStandings.map(c => ({
    position: c.position,
    points: c.points,
    wins: c.wins,
    constructorInfo: {
      constructorId: c.Constructor.constructorId,
      name: c.Constructor.name,
      nationality: c.Constructor.nationality
    }
  }));

  await Race.insertMany(formattedRaces);
  await Driver.insertMany(drivers);
  await Constructor.insertMany(constructors);
  await DriverStanding.insertMany(formattedDriverStandings);
  await ConstructorStanding.insertMany(formattedConstructorStandings);
  console.log(formattedDriverStandings[0]);
  console.log(formattedConstructorStandings[0]);

  console.log("Data Seeded");
  process.exit();
};

seed();