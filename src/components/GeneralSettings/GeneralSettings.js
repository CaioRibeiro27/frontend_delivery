import React from "react";
import "./GeneralSettings.css";
import {
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeOff,
} from "react-icons/fa";

function GeneralSettings({ isDarkMode, setIsDarkMode }) {
  const handleThemeChange = (mode) => {
    setIsDarkMode(mode === "dark");
  };

  return (
    <>
      <h2>Tela e som</h2>

      <div className="setting-row">
        <span>Tema</span>
        <div className="theme-toggle">
          <button
            className={`theme-btn ${!isDarkMode ? "active" : ""}`}
            onClick={() => handleThemeChange("light")}
          >
            Claro
          </button>
          <button
            className={`theme-btn ${isDarkMode ? "active" : ""}`}
            onClick={() => handleThemeChange("dark")}
          >
            Escuro
          </button>
        </div>
      </div>
    </>
  );
}

export default GeneralSettings;
