const querystring = require("querystring");
const axios = require("axios");

let accessToken = "";

const login = async (req, res) => {
  const scope =
    "user-top-read user-read-playback-state user-modify-playback-state user-follow-read";

  const loginURL =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      scope,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    });

  res.redirect(loginURL);
};

const callback = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;

    // res.send("Login successful! Now go to /spotify/top/tracks");

    res.status(200).send(`
            <h1>Login Successfull.</h1>
            <h2>Now, You can access your top 10 tracks, play a track, get now playing song, stop current track and get your followed artists using following routes </h2>
            <h4> /spotify/top/tracks </h4>
            <h4> /spotify/currently-playing </h4>
            <h4> /spotify/player/stop </h4>
            <h4> /spotify/player/play </h4>
            <h4> /spotify/followed-artists </h4>
        `);
  } catch (error) {
    console.error("Auth error:", error.response?.data || error.message);
    res.status(400).send("Authentication failed");
  }
};

const getTopTracks = async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({
      error: "Access token not found. Please login.",
    });
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const formattedTracks = response.data.items.map((track) => ({
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      album_image: track.album.images[0]?.url,
      preview_url: track.preview_url,
      id: track.id,
    }));

    res.json({ topTracks: formattedTracks });
  } catch (error) {
    console.error("Top Tracks Error:", error.message);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
};

const getNowPlaying = async (req, res) => {
  try {
    // Validate access token
    if (!accessToken) {
      return res.status(401).json({
        error: "Access token not found. Please login.",
      });
    }

    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 204 || !response.data || !response.data.item) {
      return res.status(200).json({ message: "No song is currently playing." });
    }

    const data = response.data;

    return res.status(200).json({
      isPlaying: data.is_playing,
      song: {
        name: data?.item?.name,
        artists: data?.item?.artists?.map((a) => a.name).join(", "),
        album: data?.item?.album?.name,
        albumArt: data?.item?.album?.images?.[0]?.url,
        previewUrl: data?.item?.preview_url,
        externalUrl: data?.item?.external_urls?.spotify,
      },
    });
  } catch (error) {
    console.log(error.response.status);
    console.error("Spotify Now Playing Error: ", error.message);
    res
      .status(500)
      .json({ error: "Internal server error while fetching current song." });
  }
};

const stopPlayback = async (req, res) => {
  // Validate access token
  if (!accessToken) {
    return res.status(401).json({
      error: "Access token not found. Please login.",
    });
  }

  try {
    await axios.put(
      "https://api.spotify.com/v1/me/player/pause",
      {}, // Empty request body
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.status(200).json({ message: "Playback stopped successfully." });
  } catch (error) {
    // Detect if user is not a Premium user
    if (
      error.response &&
      error.response?.status === 403 &&
      error.response?.data?.error?.reason === "PREMIUM_REQUIRED"
    ) {
      return res.status(403).json({
        error: "Premium required",
        message: "This feature requires a Spotify Premium account.",
      });
    }

    console.error(
      "Error stopping playback:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to stop playback" });
  }
};

const getFollowedArtists = async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({
      error: "Access token not found. Please login.",
    });
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/following?type=artist",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.artists.items.length === 0) {
      return res.status(200).json({ message: "No artist found." });
    }

    const formattedArtists = response.data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      followers: artist.followers.total,
      image: artist.images[0]?.url,
      spotify_url: artist.external_urls.spotify,
    }));

    return res.status(200).json({ artists: formattedArtists });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const playTrack = async (req, res) => {
  const trackId = req.body.trackId;

  if (!trackId) {
    return res
      .status(400)
      .json({ error: "trackId is required in the request body." });
  }

  // Validate access token
  if (!accessToken) {
    return res.status(401).json({
      error: "Access token not found. Please login.",
    });
  }

  try {
    await axios.put(
      "https://api.spotify.com/v1/me/player/play",
      {
        uris: [`spotify:track:${trackId}`],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ message: `Track ${trackId} started playing.` });
  } catch (error) {
    // Detect if user is not a Premium user
    if (
      error.response &&
      error.response?.status === 403 &&
      error.response?.data?.error?.reason === "PREMIUM_REQUIRED"
    ) {
      return res.status(403).json({
        error: "Premium required",
        message: "This feature requires a Spotify Premium account.",
      });
    }

    console.error(
      "Error playing track:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to start track playback" });
  }
};

module.exports = {
  login,
  callback,
  getTopTracks,
  getNowPlaying,
  stopPlayback,
  playTrack,
  getFollowedArtists,
};
