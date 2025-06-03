import { useState } from "react";
import { RiChargingPile2Fill } from "react-icons/ri";

import Login from "../../components/Login";
import Register from "../../components/Register";

import "./index.css";

const Authentication = () => {
  const [currentView, setCurrentView] = useState("login");
  const [fade, setFade] = useState(true); // true: show current, false: fade out

  const handleToggle = (view) => {
    if (view === currentView) return;

    setFade(false); // start fade out

    setTimeout(() => {
      setCurrentView(view);
      setFade(true); // fade in new view
    }, 300); // same as CSS transition duration
  };

  return (
    <div className="auth-page">
      <h1 className="auth-logo lg-screen-logo">
        <span className="logo-text-style">
          Power<span style={{ color: "#ffd700" }}>U</span>p
          <RiChargingPile2Fill />
        </span>
      </h1>
      <div className="auth-form-container">
        <h1 className="auth-logo sm-screen-logo">
          <span className="logo-text-style">
            Power<span style={{ color: "#ffd700" }}>U</span>p
            <RiChargingPile2Fill />
          </span>
        </h1>

        <div className={`fade-wrapper ${fade ? "fade-in" : "fade-out"}`}>
          {currentView === "login" ? <Login /> : <Register />}
        </div>

        <hr />
        <div className="auth-toggle-buttons">
          <button
            onClick={() => handleToggle("register")}
            disabled={currentView === "register" && fade}
            className={currentView === "register" ? "active" : ""}
          >
            Register
          </button>
          <button
            onClick={() => handleToggle("login")}
            disabled={currentView === "login" && fade}
            className={currentView === "login" ? "active" : ""}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
