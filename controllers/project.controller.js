const Project = require("../models/project.model");

// GET all
const getAllProjects = async (req, res) => {
  try {
    const sortParam = req.query.sort;
    const sortOrder = sortParam === "asc" ? 1 : -1; // default is 'desc'

    const projects = await Project.find().sort({ createdAt: sortOrder });
    res.json(projects);
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST
const createProject = async (req, res) => {
  const newProject = await Project.create(req.body);
  res.status(201).json(newProject);
};

module.exports = { getAllProjects, createProject };
