import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const storedUser = localStorage.getItem("user");

  //Lógica do Segurança:
  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
