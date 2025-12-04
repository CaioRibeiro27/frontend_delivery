import React from "react";
import "./Selection.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Selection() {
  const navigate = useNavigate();

  return (
    <div className="selection-container">
      <div className="selection-box">
        <h2>Qual você é?</h2>
        <button onClick={() => navigate("/cadastro")}>Usuário</button>
        <button onClick={() => navigate("/cadastro-restaurante")}>
          Restaurante
        </button>
      </div>
    </div>
  );
}

export default Selection;
