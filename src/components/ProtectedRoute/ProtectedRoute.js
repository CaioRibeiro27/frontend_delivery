import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  //Verifica se temos o usuário salvo
  const storedUser = localStorage.getItem("user");

  //Lógica do Segurança:
  if (!storedUser) {
    // Sem usuário, redireciona para o login
    return <Navigate to="/" replace />;
  }

  // Tem usuário, deixa passar
  return children;
}

export default ProtectedRoute;
