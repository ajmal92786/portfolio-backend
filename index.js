require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const skillRoutes = require("./routes/skill.routes");
const contactRoutes = require("./routes/contact.routes");

const app = express();

app.use(express.json());

app.use("/api/profile", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  return res.send(
    "<h1>Welcome to Mohd Ajmal Raza's portfolio backend APIs!</h1>"
  );
});

module.exports = { app };
