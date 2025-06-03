const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "appdata.db");

let db = null;

const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Import routes **after db is ready**
    const authRoutes = require("./routes/auth")(db);
    app.use("/api/auth", authRoutes);

    const chargingStationsRoutes = require("./routes/chargingStations")(db);
    app.use("/api/charging_stations", chargingStationsRoutes);

    const geocodeRoutes = require("./routes/geocode");
    app.use("/api/geocode", geocodeRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(
      PORT,
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDatabaseAndServer();
