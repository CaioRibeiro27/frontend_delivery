import React, { useState, useEffect } from "react";
import "./RestaurantDashboard.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

function RestaurantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchOrders(parsedUser.id);
    }
  }, []);

  const fetchOrders = async (restaurantId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/restaurant/${restaurantId}/orders`
      );
      const data = await response.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectOrder = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await fetch(
        `http://localhost:3001/api/orders/${order.id_pedido}/items`
      );
      const data = await response.json();
      if (data.success) setOrderItems(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const response = await fetch(
        `http://localhost:3001/api/orders/${selectedOrder.id_pedido}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (response.ok) {
        const updatedOrders = orders.map((o) =>
          o.id_pedido === selectedOrder.id_pedido
            ? { ...o, statusPedido: newStatus }
            : o
        );
        setOrders(updatedOrders);
        setSelectedOrder({ ...selectedOrder, statusPedido: newStatus });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const lucroDia = orders
    .filter((o) => o.statusPedido === "Entregue")
    .reduce((acc, curr) => acc + parseFloat(curr.valor_total), 0);

  const pedidosAbertos = orders.filter(
    (o) => o.statusPedido !== "Entregue" && o.statusPedido !== "Cancelado"
  ).length;

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`dashboard-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
        <div className="main-card">
          <div className="dashboard-header">
            <h2>{user ? user.nome : "Restaurante"}</h2>
            <div className="stats-row">
              <div className="stat-box">
                <span>Lucro do dia</span>
                <strong>R$ {lucroDia.toFixed(2).replace(".", ",")}</strong>
              </div>
              <div className="stat-box">
                <span>Pedidos em aberto</span>
                <strong>{pedidosAbertos}</strong>
              </div>
            </div>
          </div>

          <div className="orders-area">
            {/* Coluna esquerda */}
            <div className="orders-list-col">
              <h3>Lista de pedidos</h3>
              <div className="orders-scroll">
                {orders.map((order) => (
                  <div
                    key={order.id_pedido}
                    className={`order-card-summary ${
                      selectedOrder?.id_pedido === order.id_pedido
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleSelectOrder(order)}
                  >
                    <span>Pedido de {order.nome_cliente}</span>
                    <span className="plus-icon">+</span>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="empty-msg">Sem pedidos hoje.</p>
                )}
              </div>
            </div>

            {/* Coluna direita */}
            <div className="order-details-col">
              <h3>Detalhes do pedidos</h3>

              {selectedOrder ? (
                <div className="details-card">
                  <div className="items-list-box">
                    {orderItems.map((item, index) => (
                      <div key={index}>
                        {item.quantidade}x {item.nome_produto} -- R${" "}
                        {item.preco_unitario}
                      </div>
                    ))}
                  </div>

                  <div className="order-info-text">
                    <p>
                      <strong>Pagamento:</strong> Pix
                    </p>
                    <p>
                      <strong>Endereço:</strong> {selectedOrder.rua},{" "}
                      {selectedOrder.numero} - {selectedOrder.bairro}
                    </p>
                  </div>

                  <div className="action-area">
                    {selectedOrder.statusPedido === "Em_andamento" && (
                      <button
                        className="btn-accept"
                        onClick={() => updateStatus("Aceito")}
                      >
                        Aceitar pedido
                      </button>
                    )}
                    {selectedOrder.statusPedido === "Aceito" && (
                      <div className="status-controls">
                        <p
                          style={{
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          Pedido em preparo...
                        </p>
                        <button onClick={() => updateStatus("A_caminho")}>
                          Saiu para entrega
                        </button>
                      </div>
                    )}
                    {selectedOrder.statusPedido === "A_caminho" && (
                      <div className="status-controls">
                        <p
                          style={{
                            marginBottom: "10px",
                            color: "#007bff",
                            fontWeight: "bold",
                          }}
                        >
                          Pedido a caminho!
                        </p>
                        <button onClick={() => updateStatus("Entregue")}>
                          Confirmar Entrega
                        </button>
                      </div>
                    )}
                    {selectedOrder.statusPedido === "Entregue" && (
                      <div
                        className="status-finished"
                        style={{ color: "green", fontWeight: "bold" }}
                      >
                        ✅ Pedido Finalizado
                      </div>
                    )}
                    {selectedOrder.statusPedido === "Cancelado" && (
                      <div
                        className="status-finished"
                        style={{ color: "red", fontWeight: "bold" }}
                      >
                        ❌ Pedido Cancelado
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-selection">
                  Selecione um pedido para ver detalhes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
