import React from "react";
import "./SocialLogin.css";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

function SocialLogin({ mode }) {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenResponse.access_token }),
      });

      const data = await response.json();

      if (data.success) {
        if (mode === "signup" && data.created === false) {
          alert("Esta conta já existe. Por favor, faça login.");
          navigate("/");
          return;
        }

        localStorage.setItem(
          "user",
          JSON.stringify({ ...data.user, type: data.type })
        );

        if (!data.user.telefone && mode === "login") {
        }

        navigate("/home");
      } else {
        alert("Erro: " + data.message);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => alert("Falha no Google"),
  });

  return (
    <div className="social-logins">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
        alt="Login com Google"
        className="social-icon"
        onClick={() => loginGoogle()}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}

export default SocialLogin;
