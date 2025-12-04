import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBars,
  FaListAlt,
  FaCog,
  FaTicketAlt,
  FaSignOutAlt,
  FaBookOpen,
} from "react-icons/fa";

function Sidebar({ isOpen, setIsOpen, onHistoryClick }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSettingsClick = () => {
    if (user && user.type === "restaurante") {
      navigate("/configuracoes-restaurante");
    } else {
      navigate("/configuracoes");
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <FaUserCircle size={40} />
        <div className="user-info">
          <strong>{user ? user.nome : "Visitante"}</strong>
          <span>{user ? user.email : "..."}</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li onClick={onHistoryClick}>
          <FaListAlt /> <span>Histórico de pedidos</span>
        </li>

        <li onClick={handleSettingsClick}>
          <FaCog /> <span>Configurações</span>
        </li>

        {/* Cardápio (Apenas para Restaurante) */}
        {user && user.type === "restaurante" && (
          <li onClick={() => navigate("/cardapio-restaurante")}>
            <FaBookOpen /> <span>Cardápio</span>
          </li>
        )}

        {/* Descontos (Para todos) */}
        <li>
          <FaTicketAlt /> <span>Descontos</span>
        </li>

        {/* Botão de Sair */}
        <li
          onClick={handleLogout}
          style={{ marginTop: "20px", borderTop: "1px solid #eee" }}
        >
          <FaSignOutAlt /> <span>Sair</span>
        </li>
      </ul>

      <div className="sidebar-footer-toggle" onClick={toggleSidebar}>
        {!isOpen && <FaBars size={30} />}
      </div>
    </div>
  );
}

export default Sidebar;
