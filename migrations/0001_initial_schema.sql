CREATE TABLE IF NOT EXISTS races (
  season TEXT NOT NULL,
  round INTEGER NOT NULL,
  race_name TEXT NOT NULL,
  circuit_id TEXT NOT NULL,
  circuit_name TEXT NOT NULL,
  locality TEXT,
  country TEXT,
  race_date TEXT NOT NULL,
  race_time TEXT,
  sessions_json TEXT NOT NULL,
  PRIMARY KEY (season, round)
);

CREATE TABLE IF NOT EXISTS drivers (
  driver_id TEXT PRIMARY KEY,
  permanent_number TEXT,
  code TEXT,
  given_name TEXT NOT NULL,
  family_name TEXT NOT NULL,
  date_of_birth TEXT,
  nationality TEXT
);

CREATE TABLE IF NOT EXISTS constructors (
  constructor_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nationality TEXT
);

CREATE TABLE IF NOT EXISTS circuits (
  circuit_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  layout_id TEXT NOT NULL,
  length TEXT,
  laps INTEGER,
  fastest_lap_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS driver_standings (
  season TEXT NOT NULL,
  position INTEGER NOT NULL,
  payload_json TEXT NOT NULL,
  PRIMARY KEY (season, position)
);

CREATE TABLE IF NOT EXISTS constructor_standings (
  season TEXT NOT NULL,
  position INTEGER NOT NULL,
  payload_json TEXT NOT NULL,
  PRIMARY KEY (season, position)
);

CREATE TABLE IF NOT EXISTS race_results (
  season TEXT NOT NULL,
  round INTEGER NOT NULL,
  result_key TEXT NOT NULL,
  results_json TEXT NOT NULL,
  PRIMARY KEY (season, round),
  UNIQUE (season, result_key)
);

CREATE INDEX IF NOT EXISTS idx_races_season_date ON races (season, race_date);

CREATE INDEX IF NOT EXISTS idx_driver_standings_season ON driver_standings (season, position);

CREATE INDEX IF NOT EXISTS idx_constructor_standings_season ON constructor_standings (season, position);

CREATE INDEX IF NOT EXISTS idx_results_season_round ON race_results (season, round);
