const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: String, // beginner, intermediate, expert (optional)
  icon: String, // optional: URL or class for icon
});

module.exports = mongoose.model("Skill", skillSchema);
