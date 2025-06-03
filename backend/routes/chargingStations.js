const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/auth");

const validateChargingStationInput = (inputData) => {
  const name = inputData.name?.trim();
  const location = inputData.location?.trim();

  // Ensure latitude, longitude and powerOutput are numbers regardless of input type
  const latitude = Number(inputData.latitude);
  const longitude = Number(inputData.longitude);
  const powerOutput = Number(inputData.powerOutput);

  const status = inputData.status;
  const connectorType = inputData.connectorType;

  // Basic input validation
  if (
    !name ||
    !location ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    !status ||
    isNaN(powerOutput) ||
    !connectorType
  ) {
    return { isValid: false };
  }

  return {
    isValid: true,
    cleanedData: {
      name,
      location,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
    },
  };
};

module.exports = (db) => {
  // Get list of all charging stations
  router.get("/", authenticateToken, async (request, response) => {
    // Read query params and assign defaults
    const status = request.query.status || ""; // If nothing, default to ""
    const connectorType = request.query.connectorType || "";
    const powerOutput = request.query.powerOutput || "";
    const location = request.query.location
      ? `%${request.query.location.toLowerCase()}%`
      : "%%";

    // SQL query with fixed placeholders
    const sql = `
    SELECT *
    FROM charging_stations
    WHERE 
      (status = ? OR ? = '')
      AND (connectorType = ? OR ? = '')
      AND (CAST(powerOutput AS TEXT) = ? OR ? = '')
      AND (LOWER(location) LIKE ?)
  `;

    const values = [
      status,
      status,
      connectorType,
      connectorType,
      powerOutput,
      powerOutput,
      location,
    ];

    try {
      const chargingStationsList = await db.all(sql, values);
      response.status(200).send({ charging_stations: chargingStationsList });
    } catch (error) {
      console.error("Database error:", error.message);
      response.status(500).send({ error: "Failed to fetch charging stations" });
    }
  });

  // Add a new charging station

  router.post("/", authenticateToken, async (request, response) => {
    const {
      name,
      location,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
    } = request.body;

    const inputData = {
      name,
      location,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
    };

    const validation = validateChargingStationInput(inputData);

    if (!validation.isValid) {
      return response
        .status(400)
        .send({ error: "Invalid or missing input fields" });
    }

    const data = validation.cleanedData;

    if (data.powerOutput <= 0) {
      return response
        .status(400)
        .send({ error: "Power output must be positive" });
    }

    try {
      const addNewChargingStationQuery = `
        INSERT INTO charging_stations (name, location, latitude, longitude, status, powerOutput, connectorType)
        VALUES (?,?,?,?,?,?,?);`;

      await db.run(addNewChargingStationQuery, [
        data.name,
        data.location,
        data.latitude,
        data.longitude,
        data.status,
        data.powerOutput,
        data.connectorType,
      ]);

      const lastId = (await db.get("SELECT last_insert_rowid() AS id")).id;
      const newStation = await db.get(
        "SELECT * FROM charging_stations WHERE id = ?",
        [lastId]
      );

      response.status(201).send({
        message: "Charging Station Added Successfully",
        charging_station: newStation,
      });
    } catch (error) {
      console.error("Insert error:", error.message);
      response.status(500).send({ error: "Failed to add charging station" });
    }
  });

  // Update an existing charging station by ID

  router.put("/:id", authenticateToken, async (request, response) => {
    const { id } = request.params;
    const {
      name,
      location,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
    } = request.body;
    const inputData = {
      name,
      location,
      latitude,
      longitude,
      status,
      powerOutput,
      connectorType,
    };

    const validation = validateChargingStationInput(inputData);

    if (!validation.isValid) {
      return response
        .status(400)
        .send({ error: "Invalid or missing input fields" });
    }

    const data = validation.cleanedData;

    if (data.powerOutput <= 0) {
      return response
        .status(400)
        .send({ error: "Power output must be positive" });
    }

    try {
      const updateChargingStationQuery = `
        UPDATE charging_stations SET 
        name = ? ,location = ?, latitude = ? , longitude = ?, status = ?, powerOutput = ?, connectorType = ? 
        WHERE id = ? ;`;

      const result = await db.run(updateChargingStationQuery, [
        data.name,
        data.location,
        data.latitude,
        data.longitude,
        data.status,
        data.powerOutput,
        data.connectorType,
        id,
      ]);

      // checking if row was actually updated
      if (result.changes === 0) {
        return response
          .status(404)
          .send({ error: "Charging station not found" });
      }

      const updatedStation = await db.get(
        "SELECT * FROM charging_stations WHERE id = ?",
        [id]
      );

      response.status(200).send({
        message: "Charging station updated successfully",
        charging_station: updatedStation,
      });
    } catch (error) {
      console.error("Update error:", error.message);
      response.status(500).send({ error: "Failed to update charging station" });
    }
  });

  // Delete a charging station by ID

  router.delete("/:id", authenticateToken, async (request, response) => {
    const { id } = request.params;

    try {
      const deleteChargingStationQuery = `
        DELETE FROM charging_stations WHERE id = ?;`;

      const result = await db.run(deleteChargingStationQuery, [id]);

      if (result.changes === 0) {
        return response
          .status(404)
          .send({ error: "Charging station not found" });
      }

      response
        .status(200)
        .send({ message: "Charging station removed successfully" });
    } catch (error) {
      console.error("Delete Error:", error.message);
      response.status(500).send({ error: "Failed to remove charging station" });
    }
  });

  return router;
};
