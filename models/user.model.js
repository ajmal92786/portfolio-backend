const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bio: String,
    avatar: String, // profile image url
    location: String,
    email: String,
    resumeUrl: String,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      portfolio: String,
    },
    skills: [String], // optional if using separate Skill model
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
