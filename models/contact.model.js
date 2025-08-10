const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  message: { type: String, required: true },
});

module.exports = mongoose.model("Contact", contactSchema);
