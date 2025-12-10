import React, { useState, useEffect } from "react";
import "./RestaurantDashboard.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

function RestaurantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchOrders(parsedUser.id);
    }
  }, []);

  const fetchOrders = async (restaurantId) => {
    try {
      const response = await api.get(`/api/restaurant/${restaurantId}/orders`);
      const data = response.data;

      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const updateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      const response = await api.put(
        `/api/orders/${selectedOrder.id_pedido}/status`,
        { status: newStatus }
      );

      if (response.status === 200) {
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

  // Cálculo do Lucro (somente pedidos entregues)
  const lucroDia = orders
    .filter((o) => o.statusPedido === "Entregue")
    .reduce((acc, curr) => acc + parseFloat(curr.valor_total), 0);

  // Pedidos em aberto (não entregues e não cancelados)
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
            {/* Exibe o nome do restaurante logado */}
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
            {/* Coluna esquerda: Lista */}
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

            {/* Coluna direita: Detalhes */}
            <div className="order-details-col">
              <h3>Detalhes do pedidos</h3>

              {selectedOrder ? (
                <div className="details-card">
                  {/* Lista de itens */}
                  <div className="items-list-box">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <div key={index}>
                          {item.quantidade}x {item.nome_produto} -- R${" "}
                          {item.preco_unitario}
                        </div>
                      ))
                    ) : (
                      <p>Carregando itens ou sem itens...</p>
                    )}
                  </div>

                  <div className="order-info-text">
                    <p>
                      {/* Correção do pagamento */}
                      <strong>Pagamento:</strong>{" "}
                      {selectedOrder.forma_pagamento || "Não informado"}
                    </p>
                    <p>
                      <strong>Endereço:</strong> {selectedOrder.rua},{" "}
                      {selectedOrder.numero} - {selectedOrder.bairro}
                    </p>
                  </div>

                  {/* Botões de ação */}
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
