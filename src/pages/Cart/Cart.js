import React, { useState, useEffect } from "react";
import "./Cart.css";
import { FaArrowLeft, FaMinus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initialCart = location.state?.cart || [];
  const restaurant = location.state?.restaurant;

  const [cart, setCart] = useState(initialCart);
  const [paymentMethod, setPaymentMethod] = useState("Dinheiro");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!restaurant || !initialCart) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      fetchAddresses(user.id);
      fetchCards(user.id);
    }
  }, []);

  const fetchAddresses = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/user/addresses/${userId}`
      );
      const data = await res.json();
      if (data.success && data.addresses.length > 0) {
        setAddresses(data.addresses);
        setSelectedAddressId(data.addresses[0].id_endereco);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCards = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/user/cards/${userId}`);
      const data = await res.json();
      if (data.success) {
        setCards(data.cards);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeOne = (item) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.id_cardapio === item.id_cardapio) {
            return { ...i, quantidade: i.quantidade - 1 };
          }
          return i;
        })
        .filter((i) => i.quantidade > 0);
    });
  };

  const total = cart.reduce(
    (acc, curr) => acc + parseFloat(curr.preco) * curr.quantidade,
    0
  );

  const handleFinishOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Validação de Endereço
    if (addresses.length === 0) {
      if (
        window.confirm(
          "Você não tem endereços cadastrados. Deseja ir para as configurações adicionar um?"
        )
      ) {
        navigate("/configuracoes");
      }
      return;
    }

    if (!selectedAddressId) {
      alert("Erro: Selecione um endereço de entrega.");
      return;
    }

    // Validação de cartão
    if (paymentMethod === "Cartao" && cards.length === 0) {
      if (
        window.confirm(
          "Você selecionou pagamento por Cartão, mas não possui nenhum cadastrado. Deseja ir para as configurações adicionar um?"
        )
      ) {
        navigate("/configuracoes");
      }
      return;
    }

    const orderData = {
      id_usuario: user.id,
      id_restaurante: restaurant.id_restaurante,
      valor_total: total,
      forma_pagamento: paymentMethod,
      id_endereco: selectedAddressId,
      itens: cart,
    };

    try {
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Pedido realizado com sucesso!");
        navigate("/home");
      } else {
        alert("Erro ao finalizar pedido (Verifique o console do backend).");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!restaurant) return null;

  return (
    <div className="cart-container-layout">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`cart-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
        <div className="cart-card">
          <div className="cart-header">
            <h2>Carrinho</h2>
          </div>

          <div className="cart-body">
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id_cardapio} className="cart-item-row">
                  <span className="item-qty">{item.quantidade}x</span>
                  <span className="item-name">{item.nome_produto}</span>
                  <span className="dots"></span>
                  <span className="item-price">
                    R${" "}
                    {(item.preco * item.quantidade)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>

                  <div className="remove-icon" onClick={() => removeOne(item)}>
                    <FaMinus size={12} />
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <p style={{ textAlign: "center", color: "#666" }}>
                  Seu carrinho está vazio.
                </p>
              )}
            </div>

            <div className="cart-footer-info">
              <div className="total-display">
                <span>Total a pagar</span>
                <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
              </div>

              <div className="options-row">
                <label>Método de pagamento</label>
                <select
                  className="styled-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartao">Cartão</option>
                  <option value="Pix">Pix</option>
                </select>
              </div>

              {/* Seleção de endereco */}
              <div className="options-row">
                <label>Entregar em:</label>
                {addresses.length > 0 ? (
                  <select
                    className="styled-select"
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                  >
                    {addresses.map((addr) => (
                      <option key={addr.id_endereco} value={addr.id_endereco}>
                        {addr.localizacao} ({addr.rua})
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    style={{
                      color: "#2563EB",
                      backgroundColor: "transparent",
                      border: "1px solid #2563EB",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={() => navigate("/configuracoes")}
                  >
                    + Adicionar endereço
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="cart-actions">
            <FaArrowLeft
              size={24}
              onClick={() => navigate(-1)}
              style={{ cursor: "pointer" }}
            />

            {cart.length > 0 && (
              <button className="btn-finish-order" onClick={handleFinishOrder}>
                Finalizar pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
