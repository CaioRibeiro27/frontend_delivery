import React, { useState, useEffect } from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaSearch, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OrderHistory from "../../components/OrderHistory/OrderHistory";
import api from "../../services/api";

function Home() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      fetchData(parsed.id);

      const intervalId = setInterval(() => {
        fetchActiveOrderOnly(parsed.id);
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, []);

  const fetchData = async (userId) => {
    try {
      const resRest = await api.get("/api/restaurant/all");
      const dataRest = resRest.data;

      if (dataRest.success) setRestaurants(dataRest.restaurants);
    } catch (e) {
      console.error(e);
    }

    fetchActiveOrderOnly(userId);
  };

  const fetchActiveOrderOnly = async (userId) => {
    try {
      const resOrder = await api.get(`/api/user/${userId}/active-order`);
      const dataOrder = resOrder.data;

      if (dataOrder.success) {
        setActiveOrder(dataOrder.activeOrder);
      }
    } catch (e) {}
  };

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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>Status</h3>
                  {activeOrder && (
                    <span style={{ fontSize: "10px", color: "green" }}>
                      ● Ao vivo
                    </span>
                  )}
                </div>

                <div className="status-content">
                  {activeOrder ? (
                    <>
                      <div className="order-summary-card">
                        <h4>
                          Resumo do pedido ({activeOrder.nome_restaurante})
                        </h4>
                        <ul>
                          {activeOrder.items && activeOrder.items.length > 0 ? (
                            activeOrder.items.map((item, idx) => (
                              <li key={idx}>
                                {item.quantidade}x {item.nome_produto}
                              </li>
                            ))
                          ) : (
                            <li>Carregando itens...</li>
                          )}
                        </ul>
                      </div>
                      <button className="status-btn">
                        {activeOrder.statusPedido
                          ? activeOrder.statusPedido.replace("_", " ")
                          : "Processando..."}
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
