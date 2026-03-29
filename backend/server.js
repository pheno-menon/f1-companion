require("dotenv").config();
const mongoose = require("mongoose");
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
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://f1-companion-six.vercel.app"
  ]
}));

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use(express.json());

app.use("/assets", express.static("assets"));
app.use("/circuits", circuitsRoute);

app.use("/api/races", raceRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/constructors", constructorRoutes);
app.use("/api/driver-standings", driverStandingRoutes);
app.use("/api/constructor-standings", constructorStandingRoutes);

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
