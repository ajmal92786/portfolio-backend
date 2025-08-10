const Skill = require("../models/skill.model");

// GET all skills
const getSkills = async (req, res) => {
  const skills = await Skill.find().sort("name");
  res.json(skills);
};

// POST new skill
const addSkill = async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
};

// DELETE a skill
const deleteSkill = async (req, res) => {
  const { id } = req.params;
  await Skill.findByIdAndDelete(id);
  res.json({ message: "Skill deleted" });
};

module.exports = { getSkills, addSkill, deleteSkill };
