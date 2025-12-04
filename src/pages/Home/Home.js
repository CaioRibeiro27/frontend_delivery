import React, { useState, useEffect } from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaSearch, FaStore, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OrderHistory from "../../components/OrderHistory/OrderHistory";

function Home() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Estados de Dados
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchData(parsed.id);
    }
  }, []);

  const fetchData = async (userId) => {
    // Busca Restaurantes
    try {
      const resRest = await fetch("http://localhost:3001/api/restaurant/all");
      const dataRest = await resRest.json();
      if (dataRest.success) setRestaurants(dataRest.restaurants);
    } catch (e) {
      console.error(e);
    }

    // Busca Pedido Ativo
    try {
      const resOrder = await fetch(
        `http://localhost:3001/api/user/${userId}/active-order`
      );
      const dataOrder = await resOrder.json();
      if (dataOrder.success) setActiveOrder(dataOrder.activeOrder);
    } catch (e) {
      console.error(e);
    }
  };

  // Filtra restaurantes pela busca
  const filteredRestaurants = restaurants.filter((rest) =>
    rest.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onHistoryClick={() => setIsHistoryOpen(true)}
      />

      <div
        className={`home-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
        <div className="main-card-home">
          <div className="search-header">
            <h2>Buscar restaurante</h2>
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Digite o nome do restaurante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="content-grid">
            <div className="restaurants-box">
              <h3>Restaurantes próximos</h3>
              <div className="restaurants-scroll">
                {filteredRestaurants.map((rest) => (
                  <div
                    key={rest.id_restaurante}
                    className="restaurant-card"
                    onClick={() =>
                      navigate(`/restaurante/${rest.id_restaurante}`)
                    }
                  >
                    <div className="rest-icon">
                      <FaUtensils />
                    </div>
                    <div className="rest-info">
                      <strong>{rest.nome}</strong>
                      <span>{(Math.random() * 5 + 1).toFixed(1)} KM</span>
                    </div>
                  </div>
                ))}

                {filteredRestaurants.length === 0 && (
                  <p>Nenhum restaurante encontrado.</p>
                )}
              </div>
            </div>

            <div className="right-column">
              <div className="status-box">
                <h3>Status</h3>
                <div className="status-content">
                  {activeOrder ? (
                    <>
                      <div className="order-summary-card">
                        <h4>
                          Resumo do pedido ({activeOrder.nome_restaurante})
                        </h4>
                        <ul>
                          {activeOrder.items.map((item, idx) => (
                            <li key={idx}>
                              {item.quantidade}x {item.nome_produto}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="status-btn">
                        {activeOrder.statusPedido.replace("_", " ")}
                      </button>
                    </>
                  ) : (
                    <div className="no-order">
                      <p>Você não tem pedidos em andamento.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Box Em Breve */}
              <div className="coming-soon-box">
                <h3>Em breve</h3>
                <div className="coming-soon-content">
                  <p>Novidades e promoções aparecerão aqui!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isHistoryOpen && user && (
        <OrderHistory
          userId={user.id}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </div>
  );
}

export default Home;
