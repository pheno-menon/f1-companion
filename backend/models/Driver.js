const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  driverId: String,
  code: String,
  givenName: String,
  familyName: String,
  dateOfBirth: String,
  nationality: String
});

module.exports = mongoose.model("Driver", driverSchema);