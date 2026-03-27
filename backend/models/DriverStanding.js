const mongoose = require("mongoose");

const driverStandingSchema = new mongoose.Schema({
    position: Number,
    points: Number,
    wins: Number,
    driver: {
        driverId: String,
        driverNumber: Number,
        driverCode: String,
        driverGivenName: String,
        driverFamilyName: String,
        driverNationality: String
    },
    constructorInfo: {
        constructorId: String,
        name: String,
        nationality: String
    }
});

module.exports = mongoose.model("DriverStanding", driverStandingSchema);