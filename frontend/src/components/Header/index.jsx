import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Cookies from "js-cookie";
import { FaBars, FaTimes } from "react-icons/fa";
import { RiChargingPile2Fill } from "react-icons/ri";

import "./index.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    console.log("Logged out");
    navigate("/authentication", { replace: true });
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <span className="logo-text-style">
          Power<span style={{ color: "#ffd700" }}>U</span>p
          <RiChargingPile2Fill />
        </span>
      </div>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/charging_stations"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          Charging Stations
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
          onClick={() => setMenuOpen(false)}
        >
          About
        </NavLink>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setMenuOpen(!menuOpen);
        }}
      >
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>
    </header>
  );
};

export default Header;
