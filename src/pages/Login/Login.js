import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import InputGroup from "../../components/InputGroup/InputGroup";
import SocialLogin from "../../components/SocialLogin/SocialLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post("/api/auth/login", email, password);
      const data = response.data;

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.user, type: data.type })
        );

        if (data.type === "usuario") {
          navigate("/home");
        } else if (data.type === "restaurante") {
          navigate("/dashboard-restaurante");
        }
      } else {
        alert("Falha no login: " + data.message);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="login-container">
      <h2>Faça seu Login</h2>
      <form onSubmit={handleSubmit}>
        <InputGroup
          label="Seu e-mail"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputGroup
          label="Sua senha"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      <div className="separator">ou</div>

      <SocialLogin mode="login" />

      <p className="signup-link">
        Não possui conta? Faça seu <Link to="/selecao">cadastro</Link>
      </p>
    </div>
  );
}

export default Login;
