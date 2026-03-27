const mongoose = require("mongoose");

const constructorStandingSchema = new mongoose.Schema({
    position: Number,
    points: Number,
    wins: Number,
    constructorInfo: {
        constructorId: String,
        name: String,
        nationality: String
    }
});

module.exports = mongoose.model("ConstructorStanding", constructorStandingSchema);