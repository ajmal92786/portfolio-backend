const express = require("express");
const router = express.Router();
const {
  login,
  callback,
  getTopTracks,
  getNowPlaying,
  stopPlayback,
  playTrack,
  getFollowedArtists,
} = require("../controllers/spotify.controller");

// OAuth
router.get("/auth/login", login);
router.get("/auth/callback", callback);

// Protected Route
router.get("/top/tracks", getTopTracks); // Show user's top 10 songs or tracks
router.get("/currently-playing", getNowPlaying); // Show currently playing song on Spotify
router.post("/player/stop", stopPlayback); // Stop currently playing track
router.post("/player/play", playTrack); // Start playing a specific track
router.get("/followed-artists", getFollowedArtists); // Show user's followed artists

module.exports = router;
