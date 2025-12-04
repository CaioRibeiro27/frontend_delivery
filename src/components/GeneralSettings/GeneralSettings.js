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

      <div className="setting-row">
        <span>Notificação</span>
        <div className="volume-controls">
          <FaVolumeOff size={20} />
          <FaVolumeMute size={20} />
          <FaVolumeDown size={20} />
          <FaVolumeUp size={20} />
        </div>
      </div>
    </>
  );
}

export default GeneralSettings;
