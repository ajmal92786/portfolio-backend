const Contact = require("../models/contact.model");

const sendMessage = async (req, res) => {
  const newMessage = await Contact.create(req.body);
  res.status(201).json({ message: "Message received", data: newMessage });
};

module.exports = { sendMessage };
