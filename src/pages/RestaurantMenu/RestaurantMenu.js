import React, { useState, useEffect } from "react";
import "./RestaurantMenu.css";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function RestaurantMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToAdd, setCategoryToAdd] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchMenu(parsed.id);
    }
  }, []);

  const fetchMenu = async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurant/menu/${restaurantId}`);
      const data = response.data;

      if (data.success) setMenuItems(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (category) => {
    setCategoryToAdd(category);
    setIsModalOpen(true);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const newItem = {
      nome_produto: nome,
      descricao: descricao,
      preco: preco,
      categoria: categoryToAdd,
      id_restaurante: user.id,
    };

    try {
      const response = await api.post("/api/restaurant/menu", newItem);
      if (response.data.success || response.status === 200) {
        alert("Item adicionado!");
        setIsModalOpen(false);
        setNome("");
        setDescricao("");
        setPreco("");
        fetchMenu(user.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderSection = (title, categoryDB, buttonLabel) => {
    const items = menuItems.filter((item) => item.categoria === categoryDB);

    return (
      <div className="menu-section">
        <h3>{title}</h3>

        <div className="items-list">
          {items.map((item) => (
            <div key={item.id_cardapio} className="menu-item-card">
              <div className="item-info">
                <strong>{item.nome_produto}</strong>
                <span>{item.descricao}</span>
                <span className="price">R$ {item.preco}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Adicionar*/}
        <div className="add-item-row" onClick={() => openModal(categoryDB)}>
          <span>{buttonLabel}</span>
          <FaPlus />
        </div>
      </div>
    );
  };

  return (
    <div className="menu-page-container">
      <div className="menu-card">
        <h2>Cardapio</h2>

        {/* Seções */}
        {renderSection("Refeições", "Refeicoes", "Adicionar refeição")}
        <hr className="divider" />

        {renderSection("Bebidas", "Bebidas", "Adicionar bebida")}
        <hr className="divider" />

        {renderSection("Aperitivos", "Aperitivos", "Adicionar aperitivos")}

        {/* Seta de Voltar */}
        <div
          className="back-button-container"
          onClick={() => navigate("/dashboard-restaurante")}
        >
          <FaArrowLeft size={24} />
        </div>
      </div>

      {/* Adicionar item */}
      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal-form" onSubmit={handleAddItem}>
            <h3>Adicionar em {categoryToAdd}</h3>

            <div className="form-group">
              <label>Nome do produto</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
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

export default RestaurantMenu;
