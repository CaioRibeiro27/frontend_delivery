import React, { useState, useEffect } from "react";
import "./OrderHistory.css";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

function OrderHistory({ userId, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/api/user/${userId}/orders`);
        const data = response.data;

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchHistory();
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    return status.replace("_", " ");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="history-overlay">
      <div className="history-container">
        <h2>Histórico de pedidos</h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Carregando pedidos...</p>
        ) : (
          <div className="order-list">
            {orders.length === 0 && (
              <p style={{ textAlign: "center", color: "#666" }}>
                Nenhum pedido realizado.
              </p>
            )}
            {orders.map((order) => (
              <div className="order-item" key={order.id_pedido}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>{order.nome_restaurante}</span>
                  <span>{formatCurrency(order.valor_total)}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                    fontSize: "0.9rem",
                    color: "#555",
                  }}
                >
                  <span>{formatDate(order.data_pedido)}</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {formatStatus(order.statusPedido)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="back-arrow" onClick={onClose}>
        <FaArrowLeft size={30} />
      </div>
    </div>
  );
}

export default OrderHistory;
