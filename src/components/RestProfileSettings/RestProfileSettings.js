import React, { useState, useEffect } from "react";
import "./RestProfileSettings.css";
import { FaUserCircle } from "react-icons/fa";

function RestProfileSettings({ restaurantId }) {
  const [data, setData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/restaurant/${restaurantId}`
      );
      const json = await res.json();
      if (json.success) setData(json.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    let body = {};
    if (modalType === "nome") body = { nome: inputValue };
    if (modalType === "telefone") body = { telefone: inputValue };
    if (modalType === "senha") body = { novaSenha: inputValue };

    try {
      const res = await fetch(
        `http://localhost:3001/api/restaurant/${restaurantId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (res.ok) {
        alert("Atualizado!");
        setModalType(null);
        setInputValue("");
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <div>Carregando...</div>;

  return (
    <div className="profile-content">
      <h2>Perfil do Restaurante</h2>
      <div
        className="profile-header-card"
        style={{ textAlign: "center", marginBottom: 30 }}
      >
        <FaUserCircle size={80} color="#555" />
        <h3>{data.nome}</h3>
      </div>

      <div
        className="profile-options-list"
        style={{ border: "1px solid #ccc", borderRadius: 8 }}
      >
        <div
          className="profile-option-row"
          style={{
            padding: 20,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Nome: {data.nome}</span>
          <button
            style={{
              color: "blue",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
            onClick={() => setModalType("nome")}
          >
            Alterar
          </button>
        </div>
        <div
          className="profile-option-row"
          style={{
            padding: 20,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Email: {data.email}</span>
        </div>
        <div
          className="profile-option-row"
          style={{
            padding: 20,
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Telefone: {data.telefone}</span>
          <button
            style={{
              color: "blue",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
            onClick={() => setModalType("telefone")}
          >
            Alterar
          </button>
        </div>
        <div
          className="profile-option-row"
          style={{
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>CNPJ: {data.cnpj}</span>
        </div>
      </div>

      {modalType && (
        <div className="modal-overlay">
          <form className="modal-form" onSubmit={handleUpdate}>
            <h3>Editar {modalType}</h3>
            <div className="form-group">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button className="btn-avancar">Salvar</button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setModalType(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default RestProfileSettings;
