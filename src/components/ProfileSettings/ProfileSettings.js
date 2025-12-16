import React, { useState, useEffect } from "react";
import "./ProfileSettings.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ProfileSettings({ userId }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/api/user/users/${userId}`);
      const data = response.data;
      if (data.success) setUserData(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  const maskPhone = (phone) => {
    if (!phone) return "Não cadastrado";

    const numbers = phone.replace(/\D/g, "");

    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    }
    return phone;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let body = {};

    if (modalType === "telefone") body = { telefone: inputValue };
    if (modalType === "senha")
      body = { novaSenha: inputValue, senhaAtual: currentPassword };

    try {
      const response = await api.put(`/api/user/users/${userId}`, body);
      const data = response.data;

      if (data.success) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...body };

        delete updatedUser.senhaAtual;
        delete updatedUser.novaSenha;

        localStorage.setItem("user", JSON.stringify(updatedUser));

        alert("Atualizado com sucesso!");
        setModalType(null);
        setInputValue("");
        fetchUserData();
        setCurrentPassword("");
      } else {
        alert("Erro: " + data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    // Verificação de segurança: garante que temos o ID vindo das props
    if (!userId) {
      alert("Erro: ID do usuário não encontrado.");
      return;
    }

    const confirm = window.confirm(
      "Tem certeza? Isso apagará todo seu histórico e endereços."
    );

    if (confirm) {
      try {
        await api.delete(`/api/user/users/${userId}`);

        alert("Conta excluída.");

        localStorage.clear();
        sessionStorage.clear();

        navigate("/login");
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao excluir conta. Veja o console.");
      }
    }
  };

  if (!userData) return <div>Carregando perfil...</div>;

  return (
    <div className="profile-content">
      <h2>Perfil</h2>
      <div className="profile-header-card">
        <div className="profile-picture-section static">
          <FaUserCircle size={80} />
        </div>
        <div className="profile-info-text">
          <p>
            <strong>Nome:</strong> {userData.nome.split(" ")[0]}
          </p>
          <p>
            <strong>Sobrenome:</strong>{" "}
            {userData.nome.split(" ").length > 1
              ? userData.nome.split(" ").slice(1).join(" ")
              : ""}
          </p>
        </div>
      </div>

      <div className="profile-options-list">
        {/* Linha Telefone (Editável)*/}
        <div className="profile-option-row">
          <span>Telefone: {maskPhone(userData.telefone)}</span>
          <button
            className="btn-alterar"
            onClick={() => setModalType("telefone")}
          >
            Alterar
          </button>
        </div>

        {/* Linha Senha (Editável) */}
        <div className="profile-option-row">
          <span>Alterar senha</span>
          <button className="btn-alterar" onClick={() => setModalType("senha")}>
            Alterar
          </button>
        </div>

        {/* Linha Excluir */}
        <div className="profile-option-row delete-row">
          <button className="btn-excluir-conta" onClick={handleDeleteAccount}>
            Excluir conta
          </button>
        </div>
      </div>

      {modalType && (
        <div className="modal-overlay">
          <form className="modal-form" onSubmit={handleUpdate}>
            <h3>Editar {modalType}</h3>
            {modalType === "telefone" && (
              <div className="form-group">
                <label>Telefone atual</label>
                <input
                  type="text"
                  value={userData.telefone || ""}
                  disabled
                  className="input-disabled"
                />
              </div>
            )}

            <div className="form-group">
              <label>Novo {modalType}</label>
              <input
                type={modalType === "senha" ? "password" : "text"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
                placeholder={modalType === "senha" ? "Digite a nova senha" : ""}
              />
            </div>

            {modalType === "senha" && (
              <div className="form-group">
                <label>Senha Atual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Digite sua senha atual"
                />
              </div>
            )}
            <div className="form-buttons">
              <button type="submit" className="btn-avancar">
                Avançar
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setModalType(null);
                  setInputValue("");
                }}
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

export default ProfileSettings;
