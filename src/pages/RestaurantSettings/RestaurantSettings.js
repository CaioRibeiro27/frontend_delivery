import React, { useState, useEffect } from "react";
import "./RestaurantSettings.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";

import RestGeneralSettings from "../../components/RestGeneralSettings/RestGeneralSettings";
import RestProfileSettings from "../../components/RestProfileSettings/RestProfileSettings";

function RestaurantSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("gerais");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "gerais":
        return (
          <RestGeneralSettings
            restaurantId={user?.id}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        );
      case "perfil":
        return <RestProfileSettings restaurantId={user?.id} />;
      default:
        return null;
    }
  };

  return (
    <div className={`settings-page ${isDarkMode ? "dark-mode" : ""}`}>
      <nav className="settings-sidebar">
        <h3>Configurações</h3>
        <div className="settings-user-profile">
          <FaUserCircle size={24} />
          <strong>{user ? user.nome : "Restaurante"}</strong>
        </div>
        <ul className="settings-menu">
          <li
            className={activeTab === "gerais" ? "active" : ""}
            onClick={() => setActiveTab("gerais")}
          >
            Configurações gerais
          </li>
          <li
            className={activeTab === "perfil" ? "active" : ""}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </li>
        </ul>
        <div
          className="settings-back-arrow"
          onClick={() => navigate("/dashboard-restaurante")}
        >
          <FaArrowLeft size={20} />
        </div>
      </nav>
      <main className="settings-content">{renderContent()}</main>
    </div>
  );
}

export default RestaurantSettings;
