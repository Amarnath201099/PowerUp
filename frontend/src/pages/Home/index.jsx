import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import "./index.css";

const Home = () => {
  const navigate = useNavigate();

  const goToChargingStations = () => {
    navigate("/charging_stations");
  };

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-text-card">
          <h1>
            Welcome to{" "}
            <span
              style={{ display: "inline-block", transform: "skew(-16deg)" }}
            >
              Power<span style={{ color: "#ffd700" }}>U</span>p
            </span>
          </h1>
          <p className="quote">
            "Drive electric, charge smart — the planet will thank you."
          </p>
        </div>
        <button className="btn-find-stations" onClick={goToChargingStations}>
          Find Charging Stations
        </button>
      </div>
    </>
  );
};

export default Home;
