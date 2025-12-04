import React, { useState, useEffect } from "react";
import "./RestGeneralSettings.css";
import { FaVolumeUp } from "react-icons/fa";
import api from "../../services/api";

function RestGeneralSettings({ restaurantId, isDarkMode, setIsDarkMode }) {
  const [address, setAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    cep: "",
  });

  // Busca o endereço
  const fetchAddress = async () => {
    try {
      const response = await api.get(`/api/restaurant/${restaurantId}/address`);
      const data = response.data;
      if (data.success) {
        setAddress(data.address);
        setFormData(data.address);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [restaurantId]);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/api/restaurant/${restaurantId}/address`,
        formData
      );

      const data = response.data;

      if (data.success) {
        alert("Endereço atualizado!");
        setIsModalOpen(false);
        fetchAddress();
      } else {
        alert("Erro ao atualizar: " + (data.message || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="rest-general-content">
      {/* Seção tela e som */}
      <h2>Tela e som</h2>
      <div className="setting-row">
        <span>Tema</span>
        <div className="theme-toggle">
          <button
            className={`theme-btn ${!isDarkMode ? "active" : ""}`}
            onClick={() => setIsDarkMode(false)}
          >
            Claro
          </button>
          <button
            className={`theme-btn ${isDarkMode ? "active" : ""}`}
            onClick={() => setIsDarkMode(true)}
          >
            Escuro
          </button>
        </div>
      </div>
      <div className="setting-row">
        <span>Notificação</span>
        <FaVolumeUp size={20} />
      </div>

      <hr className="divider" />

      {/* Seção endereço */}
      <h2>Endereço do estabelecimento</h2>
      {address ? (
        <div className="address-display-card">
          <div className="address-info">
            <p>
              <strong>
                {address.rua}, {address.numero}
              </strong>
            </p>
            <p>
              {address.bairro} - {address.cidade}
            </p>
            <p>CEP: {address.cep}</p>
          </div>
          <button
            className="btn-edit-address"
            onClick={() => setIsModalOpen(true)}
          >
            Editar
          </button>
        </div>
      ) : (
        <p>Carregando endereço...</p>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-form" onSubmit={handleUpdateAddress}>
            <h3>Editar Endereço</h3>
            <div className="form-group">
              <label>Cidade</label>
              <input
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Rua</label>
              <input name="rua" value={formData.rua} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Número</label>
              <input
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>CEP</label>
              <input name="cep" value={formData.cep} onChange={handleChange} />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-avancar">
                Salvar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setIsModalOpen(false)}
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

export default RestGeneralSettings;
