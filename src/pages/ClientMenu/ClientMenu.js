import React, { useState, useEffect } from "react";
import "./ClientMenu.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../services/api";

function ClientMenu() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchRestaurantInfo();
    fetchMenu();
  }, [id]);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/restaurant/${id}`
      );
      const data = await response.json();
      if (data.success) setRestaurant(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/restaurant/menu/${id}`
      );
      const data = await response.json();
      if (data.success) setMenuItems(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id_cardapio === item.id_cardapio);
      if (existing) {
        return prevCart.map((i) =>
          i.id_cardapio === item.id_cardapio
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      } else {
        return [...prevCart, { ...item, quantidade: 1 }];
      }
    });
  };

  const goToCart = () => {
    navigate("/carrinho", { state: { cart, restaurant } });
  };

  const renderCategory = (title, categoryDB) => {
    const items = menuItems.filter((item) => item.categoria === categoryDB);
    if (items.length === 0) return null;

    return (
      <div className="client-menu-section">
        <h3>{title}</h3>
        <div className="client-items-list">
          {items.map((item) => (
            <div key={item.id_cardapio} className="client-menu-item">
              <div className="item-header">
                <span className="item-name">{item.nome_produto}</span>
                <span className="item-dots"></span>
                <span className="item-price">R$ {item.preco}</span>

                <button
                  className="add-btn-small"
                  onClick={() => addToCart(item)}
                >
                  <FaPlus />
                </button>
              </div>
              <p className="item-desc">({item.descricao})</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantidade, 0);

  return (
    <div className="client-menu-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`client-menu-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="paper-card">
          <div className="paper-header">
            <h2>{restaurant ? restaurant.nome : "Carregando..."}</h2>
          </div>

          <div className="paper-body">
            {renderCategory("PRATO PRINCIPAL", "Refeicoes")}
            {renderCategory("BEBIDAS", "Bebidas")}
            {renderCategory("APERITIVOS", "Aperitivos")}
          </div>

          <div className="paper-footer">
            <FaArrowLeft
              size={24}
              onClick={() => navigate("/home")}
              style={{ cursor: "pointer" }}
            />
            {totalItems > 0 && (
              <button className="btn-next-cart" onClick={goToCart}>
                Próximo ({totalItems})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientMenu;
