require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const circuitsRoute = require("./routes/circuits.js");

const raceRoutes = require("./routes/raceRoutes");
const driverRoutes = require("./routes/driverRoutes");
const constructorRoutes = require("./routes/constructorRoutes");
const driverStandingRoutes = require("./routes/driverStandingRoutes");
const constructorStandingRoutes = require("./routes/constructorStandingRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/assets", express.static("assets"));
app.use("/circuits", circuitsRoute);

app.use("/api/races", raceRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/constructors", constructorRoutes);
app.use("/api/driver-standings", driverStandingRoutes);
app.use("/api/constructor-standings", constructorStandingRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);