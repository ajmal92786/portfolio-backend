const User = require("../models/user.model");

// GET user profile (assuming only one user - your portfolio)
const getProfile = async (req, res) => {
  const profile = await User.findOne();
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.json(profile);
};

// PUT update profile (later you can protect this with JWT)
const updateProfile = async (req, res) => {
  let profile = await User.findOne();
  if (!profile) {
    profile = new User(req.body);
  } else {
    Object.assign(profile, req.body);
  }
  const updated = await profile.save();
  res.json(updated);
};

module.exports = { getProfile, updateProfile };
