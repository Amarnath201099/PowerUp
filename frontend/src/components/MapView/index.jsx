import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./index.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Helper component to change map center programmatically
const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const MapView = ({ chargers }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [inputLocation, setInputLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setErrorMessage("");
      },
      () => {
        setErrorMessage("Permission denied or unable to retrieve location");
      }
    );
  }, []);

  // Geocode input location
  const handleLocationSearch = async () => {
    if (!inputLocation.trim()) {
      setErrorMessage("Please enter a location");
      return;
    }
    try {
      const response = await fetch(
        `https://powerup-6csa.onrender.com/api/geocode?q=${encodeURIComponent(
          inputLocation
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setUserLocation([lat, lon]);
        setErrorMessage("");
      } else {
        setErrorMessage("Location not found");
      }
    } catch (error) {
      setErrorMessage("Error fetching location data");
    }
  };

  return (
    <div className="map-section">
      <div className="location-search">
        <div className="location-search-box">
          <input
            type="text"
            placeholder="Enter location"
            value={inputLocation}
            onChange={(event) => setInputLocation(event.target.value)}
          />
          <button onClick={handleLocationSearch}>Search</button>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      <MapContainer
        center={userLocation || [20.5937, 78.9629]}
        zoom={userLocation ? 13 : 5}
        style={{ height: "400px", width: "100%" }}
      >
        <ChangeMapCenter center={userLocation} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>{inputLocation || "Your Location"}</Popup>
          </Marker>
        )}
        {chargers.map((charger) => (
          <Marker
            key={charger.id}
            position={[
              parseFloat(charger.latitude),
              parseFloat(charger.longitude),
            ]}
          >
            <Popup>
              <strong>{charger.name}</strong>
              <br />
              {charger.connector_type} - {charger.power_output} kW
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
