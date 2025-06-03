import React, { useState, useEffect, useRef } from "react";

import Cookies from "js-cookie";

import "./index.css";

const powerOptions = ["3.3", "7.2", "15", "22", "50", "74", "120"];
const connectorOptions = [
  "Type 2 (IEC 62196)",
  "CCS2",
  "CHAdeMO",
  "Bharat AC-001",
  "Bharat DC-001",
];

const ChargerStationForm = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    status: "",
    powerOutput: "",
    connectorType: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // If user edits location input, debounce forward geocode call
    if (name === "location") {
      setErrorMessage("");
      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        if (value.trim() !== "") {
          forwardGeocode(value.trim());
        }
      }, 700);
    }
  };

  // Forward geocode address -> lat/lon using backend API
  const forwardGeocode = async (address) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/geocode?q=${encodeURIComponent(address)}`
      );
      if (!res.ok) throw new Error("Failed to fetch location");
      const data = await res.json();
      if (data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon,
        }));
        setErrorMessage("");
      } else {
        setErrorMessage("Location not found");
        setFormData((prev) => ({
          ...prev,
          latitude: "",
          longitude: "",
        }));
      }
    } catch (err) {
      setErrorMessage("Error fetching location");
      setFormData((prev) => ({
        ...prev,
        latitude: "",
        longitude: "",
      }));
    }
  };

  // Reverse geocode lat/lon -> address using backend API
  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/geocode/reverse?lat=${lat}&lon=${lon}`
      );
      if (!res.ok) throw new Error("Failed to reverse geocode");
      const data = await res.json();
      if (data.display_name) {
        setFormData((prev) => ({
          ...prev,
          location: data.display_name,
          latitude: lat.toString(),
          longitude: lon.toString(),
        }));
        setErrorMessage("");
      } else {
        setFormData((prev) => ({
          ...prev,
          location: `${lat}, ${lon}`,
          latitude: lat.toString(),
          longitude: lon.toString(),
        }));
      }
    } catch {
      setFormData((prev) => ({
        ...prev,
        location: `${lat}, ${lon}`,
        latitude: lat.toString(),
        longitude: lon.toString(),
      }));
    }
  };

  // On clicking "Use My Location"
  const handleUseMyLocation = () => {
    setErrorMessage("");
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        reverseGeocode(lat, lon);
      },
      () => {
        setErrorMessage("Permission denied or failed to get location.");
      }
    );
  };

  const handleSubmit = async () => {
    // Basic validation for required fields
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage("Location is required");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setErrorMessage("Valid location is required");
      return;
    }
    if (!formData.status) {
      setErrorMessage("Status is required");
      return;
    }
    if (!formData.powerOutput) {
      setErrorMessage("Power output is required");
      return;
    }
    if (!formData.connectorType) {
      setErrorMessage("Connector type is required");
      return;
    }

    const url = initialValues
      ? `https://powerup-6csa.onrender.com/api/charging_stations/${initialValues.id}`
      : "https://powerup-6csa.onrender.com/api/charging_stations";
    const method = initialValues ? "PUT" : "POST";

    const authorizationToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorizationToken}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        onSubmit();
      } else {
        setErrorMessage(result.error || "Error occurred");
      }
    } catch {
      setErrorMessage("Server error");
    }
  };

  return (
    <div className="modal-form">
      <h2>{initialValues ? "Edit Charger" : "Add New Charger"}</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <button
        type="button"
        className="btn-use-location"
        onClick={handleUseMyLocation}
      >
        Use My Location
      </button>

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="" disabled>
          Select Status
        </option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <select
        name="powerOutput"
        value={formData.powerOutput}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select Power Output
        </option>
        {powerOptions.map((value) => (
          <option key={value} value={value}>
            {value} kW
          </option>
        ))}
      </select>

      <select
        name="connectorType"
        value={formData.connectorType}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select Connector Type
        </option>
        {connectorOptions.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <div className="form-buttons">
        <button onClick={handleSubmit}>
          {initialValues ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default ChargerStationForm;
