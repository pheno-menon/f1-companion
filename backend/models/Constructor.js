const mongoose = require("mongoose");

const constructorSchema = new mongoose.Schema({
  constructorId: String,
  name: String,
  nationality: String
});

module.exports = mongoose.model("Constructor", constructorSchema);