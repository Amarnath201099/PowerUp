import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import Cookies from "js-cookie";

import { MdOutlineEdit, MdOutlineDelete, MdAdd } from "react-icons/md";

import Header from "../../components/Header";
import MapView from "../../components/MapView";
import ChargerStationForm from "../../components/ChargerStationForm";
import Loader from "../../components/Loader";

import "./index.css";

const authorizationToken = Cookies.get("jwt_token");

const Dashboard = () => {
  const [chargers, setChargers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [connectorTypeFilter, setConnectorTypeFilter] = useState("");
  const [powerOutputFilter, setPowerOutputFilter] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isLoader, setLoaderStatus] = useState(true);

  const powerOptions = ["3.3", "7.2", "15", "22", "50", "74", "120"];
  const connectorOptions = [
    "Type 2 (IEC 62196)",
    "CCS2",
    "CHAdeMO",
    "Bharat AC-001",
    "Bharat DC-001",
  ];

  const fetchChargers = async () => {
    try {
      const response = await fetch(
        "https://powerup-6csa.onrender.com/api/charging_stations",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authorizationToken}`,
          },
        }
      );
      const data = await response.json();
      setChargers(data.charging_stations);
    } catch (error) {
      console.error("Error fetching chargers:", error);
    }
    setLoaderStatus(false);
  };

  useEffect(() => {
    setLoaderStatus(true);
    fetchChargers();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      const queryParams = new URLSearchParams();

      if (statusFilter) queryParams.append("status", statusFilter);
      if (connectorTypeFilter)
        queryParams.append("connectorType", connectorTypeFilter);
      if (powerOutputFilter)
        queryParams.append("powerOutput", powerOutputFilter);
      if (locationSearch.trim())
        queryParams.append("location", locationSearch.trim());

      try {
        const response = await fetch(
          `https://powerup-6csa.onrender.com/api/charging_stations?${queryParams.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authorizationToken}`,
            },
          }
        );
        const data = await response.json();
        setChargers(data.charging_stations);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchFilteredData();
  }, [statusFilter, connectorTypeFilter, powerOutputFilter, locationSearch]);

  const handleToggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const handleFormSubmit = () => {
    fetchChargers();
  };

  const handleDelete = async (id) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authorizationToken}`,
      },
    };
    try {
      const response = await fetch(
        `https://powerup-6csa.onrender.com/api/charging_stations/${id}`,
        options
      );
      const data = await response.json();
      console.log(data.message);
      fetchChargers();
    } catch (error) {
      console.error("Error fetching chargers:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-actions">
          <Popup
            trigger={
              <button className="btn-add">
                Add Station <MdAdd />
              </button>
            }
            position="right center"
            modal
          >
            {(close) => (
              <div className="form-popup-modal-container">
                <ChargerStationForm
                  initialValues={null}
                  onSubmit={() => {
                    handleFormSubmit();
                    close();
                  }}
                />
                <button
                  className="cancel-button"
                  onClick={() => {
                    console.log("modal closed ");
                    close();
                  }}
                >
                  cancel
                </button>
              </div>
            )}
          </Popup>
          <button className="btn-filter" onClick={handleToggleFilters}>
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Connector Type</label>
              <select
                value={connectorTypeFilter}
                onChange={(event) => setConnectorTypeFilter(event.target.value)}
              >
                <option value="">Select</option>
                {connectorOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Power Output (kW)</label>
              <select
                value={powerOutputFilter}
                onChange={(event) => setPowerOutputFilter(event.target.value)}
              >
                <option value="">Select</option>
                {powerOptions.map((val) => (
                  <option key={val} value={val}>
                    {val} kW
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Search Location</label>
              <input
                type="text"
                placeholder="Enter location"
                value={locationSearch}
                onChange={(event) => setLocationSearch(event.target.value)}
              />
            </div>
          </div>
        )}

        <>
          {isLoader ? (
            <Loader />
          ) : (
            <div className="content-section">
              <div className="charger-list">
                {chargers.length === 0 ? (
                  <p>No chargers found</p>
                ) : (
                  chargers.map((charger) => (
                    <div key={charger.id} className="charger-card">
                      <div className="charger-details-card">
                        <h4>{charger.name}</h4>
                        <p>Status: {charger.status}</p>
                        <p>Power: {charger.powerOutput} kW</p>
                        <p>Connector: {charger.connectorType}</p>
                        <p>Location: {charger.location}</p>
                      </div>
                      <div className="charger-card-icons">
                        <Popup
                          trigger={
                            <button className="charger-icon-btn">
                              <MdOutlineEdit size={25} />
                            </button>
                          }
                          position="right center"
                          modal
                        >
                          {(close) => (
                            <div className="form-popup-modal-container">
                              <ChargerStationForm
                                initialValues={charger}
                                onSubmit={() => {
                                  handleFormSubmit();
                                  close();
                                }}
                              />
                              <button
                                className="cancel-button"
                                onClick={() => {
                                  console.log("modal closed ");
                                  close();
                                }}
                              >
                                cancel
                              </button>
                            </div>
                          )}
                        </Popup>
                        <button
                          className="charger-icon-btn"
                          onClick={() => handleDelete(charger.id)}
                        >
                          <MdOutlineDelete size={25} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <MapView chargers={chargers} />
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default Dashboard;
