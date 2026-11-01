const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "backend", "data");
const RESULTS_DIR = path.join(
  ROOT,
  "frontend",
  "src",
  "data",
  "results"
);
const OUTPUT = path.join(__dirname, "generated-data.sql");

const SEASON = process.argv[2] || "2026";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sql(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : "NULL";
}

function insert(table, columns, values) {
  return `INSERT OR REPLACE INTO ${table} (${columns.join(", ")}) VALUES (${values.join(", ")});`;
}

const statements = [];

const races = readJson(path.join(DATA, "races.json"));
const drivers = readJson(path.join(DATA, "drivers.json"));
const constructors = readJson(path.join(DATA, "constructors.json"));
const driverStandings = readJson(
  path.join(DATA, "driverStandings.json")
);
const constructorStandings = readJson(
  path.join(DATA, "constructorStandings.json")
);
const circuits = readJson(
  path.join(DATA, "circuitsCurrent.json")
);

// Races
for (const race of races) {
  const sessions = {
    fp1: race.FirstPractice,
    fp2: race.SecondPractice,
    fp3: race.ThirdPractice,
    qualifying: race.Qualifying,
    sprintQualifying: race.SprintQualifying,
    sprint: race.Sprint
  };

  statements.push(insert(
    "races",
    ["season", "round", "race_name", "circuit_id", "circuit_name", "locality", "country", "race_date", "race_time", "sessions_json"],
    [
      sql(race.season),
      sqlNumber(race.round),
      sql(race.raceName),
      sql(race.Circuit.circuitId),
      sql(race.Circuit.circuitName),
      sql(race.Circuit.Location.locality),
      sql(race.Circuit.Location.country),
      sql(race.date),
      sql(race.time || ""),
      sql(JSON.stringify(sessions))
    ]
  ));
}

// Drivers
for (const driver of drivers) {
  statements.push(insert(
    "drivers",
    ["driver_id", "permanent_number", "code", "given_name", "family_name", "date_of_birth", "nationality"],
    [
      sql(driver.driverId),
      sql(driver.permanentNumber),
      sql(driver.code),
      sql(driver.givenName),
      sql(driver.familyName),
      sql(driver.dateOfBirth),
      sql(driver.nationality)
    ]
  ));
}

// Constructors
for (const constructor of constructors) {
  statements.push(insert(
    "constructors",
    ["constructor_id", "name", "nationality"],
    [
      sql(constructor.constructorId),
      sql(constructor.name),
      sql(constructor.nationality)
    ]
  ));
}

// Circuits
for (const circuit of circuits) {
  statements.push(insert(
    "circuits",
    ["circuit_id", "name", "country", "layout_id", "length", "laps", "fastest_lap_json"],
    [
      sql(circuit.id),
      sql(circuit.name),
      sql(circuit.country),
      sql(circuit.layoutId),
      sql(circuit.length),
      sqlNumber(circuit.laps),
      sql(JSON.stringify(circuit.fastestLap))
    ]
  ));
}

// Driver standings
for (const standing of driverStandings) {
  const driver = standing.Driver;
  const constructor = standing.Constructors?.[0];

  if (!constructor) {
    throw new Error(
      `No constructor found for driver ${driver.driverId}`
    );
  }

  const position = Number(standing.position);

  const payload = {
    _id: `${SEASON}-driver-${position}`,
    position,
    points: Number(standing.points),
    wins: Number(standing.wins),
    driver: {
      driverId: driver.driverId,
      driverNumber: Number(driver.permanentNumber),
      driverCode: driver.code,
      driverGivenName: driver.givenName,
      driverFamilyName: driver.familyName,
      driverNationality: driver.nationality
    },
    constructorInfo: {
      constructorId: constructor.constructorId,
      name: constructor.name,
      nationality: constructor.nationality
    }
  };

  statements.push(insert(
    "driver_standings",
    ["season", "position", "payload_json"],
    [
      sql(SEASON),
      sqlNumber(position),
      sql(JSON.stringify(payload))
    ]
  ));
}

// Constructor standings
for (const standing of constructorStandings) {
  const constructor = standing.Constructor;
  const position = Number(standing.position);

  const payload = {
    _id: `${SEASON}-constructor-${position}`,
    position,
    points: Number(standing.points),
    wins: Number(standing.wins),
    constructorInfo: {
      constructorId: constructor.constructorId,
      name: constructor.name,
      nationality: constructor.nationality
    }
  };

  statements.push(insert(
    "constructor_standings",
    ["season", "position", "payload_json"],
    [
      sql(SEASON),
      sqlNumber(position),
      sql(JSON.stringify(payload))
    ]
  ));
}

// Result filename -> circuit ID
const resultSlugToCircuitId = {
  australia_gp: "albert_park",
  china_gp: "shanghai",
  japan_gp: "suzuka",
  miami_gp: "miami",
  canada_gp: "villeneuve",
  monaco_gp: "monaco",
  barcelona_gp: "catalunya",
  austria_gp: "spielberg",
  britain_gp: "silverstone",
  belgium_gp: "spa",
  hungary_gp: "hungaroring",
  netherlands_gp: "zandvoort",
  italy_gp: "monza",
  madrid_gp: "madring",
  azerbaijan_gp: "baku",
  bahrain_gp: "sepang"
};

const roundByCircuitId = new Map(
  races
    .filter((race) => String(race.season) === SEASON)
    .map((race) => [
      race.Circuit.circuitId,
      Number(race.round)
    ])
);

const resultFiles = fs.readdirSync(RESULTS_DIR)
  .filter((file) => file.endsWith(".json"));

let importedResults = 0;

for (const file of resultFiles) {
  const resultKey = path.basename(file, ".json");
  const circuitId = resultSlugToCircuitId[resultKey];

  if (!circuitId) {
    throw new Error(
      `No circuit mapping found for results file: ${file}`
    );
  }

  const round = roundByCircuitId.get(circuitId);

  if (!round) {
    // The result file may belong to a different season.
    continue;
  }

  const resultData = readJson(path.join(RESULTS_DIR, file));

  statements.push(insert(
    "race_results",
    ["season", "round", "result_key", "results_json"],
    [
      sql(SEASON),
      sqlNumber(round),
      sql(resultKey),
      sql(JSON.stringify(resultData))
    ]
  ));

  importedResults += 1;
}

fs.writeFileSync(
  OUTPUT,
  statements.join("\n") + "\n",
  "utf8"
);

console.log(`Generated ${OUTPUT}`);
console.log(`Season: ${SEASON}`);
console.log(`Races: ${races.length}`);
console.log(`Drivers: ${drivers.length}`);
console.log(`Constructors: ${constructors.length}`);
console.log(`Circuits: ${circuits.length}`);
console.log(`Driver standings: ${driverStandings.length}`);
console.log(`Constructor standings: ${constructorStandings.length}`);
console.log(`Result files imported: ${importedResults}`);