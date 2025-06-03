const express = require("express");

// Dynamically import node-fetch (ESM compatibility in CommonJS)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query; // Location string from query param

  if (!q) {
    return res.status(400).json({ error: "Missing 'q' query parameter" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        q
      )}&limit=1&email=amarnath201099@gmail.com`
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch from Nominatim" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Missing lat or lon query parameter" });
  }
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&email=amarnath201099@gmail.com`
    );
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch from Nominatim" });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

module.exports = router;
