require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const raceRoutes = require("./routes/raceRoutes");
const driverRoutes = require("./routes/driverRoutes");
const constructorRoutes = require("./routes/constructorRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/races", raceRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/constructors", constructorRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);