import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import InputGroup from "../../components/InputGroup/InputGroup";
import SocialLogin from "../../components/SocialLogin/SocialLogin";
import api from "../../services/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefone, setTelefone] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      nome: name,
      telefone: telefone,
      senha: password,
      email: email,
    };

    try {
      const response = await api.post("/api/auth/register", userData);

      const data = response.data;

      if (data.success) {
        alert("Cadastro realizado com sucesso!");
        navigate("/");
      } else {
        alert("Erro no cadastro: " + data.message);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert(
        "Não foi possível conectar ao servidor. Tente novamente mais tarde."
      );
    }
  };
  return (
    <div className="signup-container">
      <h2>Faça seu cadastro</h2>{" "}
      <form onSubmit={handleSubmit}>
        <InputGroup
          label="Nome"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />{" "}
        <InputGroup
          label="Email"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <InputGroup
          label="Senha"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <InputGroup
          label="Telefone"
          type="tel"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />{" "}
        <button type="submit" className="signup-button">
          Cadastrar
        </button>{" "}
      </form>
      <div className="separator">ou</div>
      <SocialLogin mode="signup" />
      <p className="login-link">
        Já possui conta? Fazer <Link to="/">login</Link> {" "}
      </p>
    </div>
  );
}

export default Signup;
