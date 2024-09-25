import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";
import successCheckImage from "../images/successCheck.png";
import failureCheckImage from "../images/failureCheck.png";

export function Login({ onLogin, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    login({
      email: cleanEmail,
      password: cleanPassword,
    })
      .then((res) => {
        setEmail("");
        setPassword("");
        console.log("Login bem-sucedido:", res);
        onLogin(true, "Login bem-sucedido!", successCheckImage);
        setIsLoggedIn(true); // Atualiza o estado de autenticação
        navigate("/");
      })
      .catch((err) => {
        onLogin(false, "Erro no login", failureCheckImage);
        console.error("Erro no login:", err);
      })
      .finally(() => setIsSubmitting(false));
  };

  const buttonClass = `register__button ${
    isSubmitting ? `register__button-loading` : ""
  }`;

  return (
    <section className="register">
      <form className="register__form" onSubmit={handleLoginSubmit}>
        <p className="register__title">Entrar</p>
        <fieldset className="register__fieldset">
          <div className="register__input-container">
            <input
              value={email}
              type="email"
              placeholder="E-mail"
              required
              className="register__input"
              onChange={handleEmailChange}
            ></input>
          </div>
          <div className="register__input-container">
            <input
              value={password}
              type="password"
              placeholder="Senha"
              required
              className="register__input"
              onChange={handlePasswordChange}
            ></input>
          </div>
        </fieldset>
        <button className={buttonClass} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Entrar"}
        </button>
        <p className="register__notation">
          Ainda não é membro?
          <a
            className="register__notation-link"
            href="#"
            onClick={() => navigate("/signup")}
          >
            Inscreva-se aqui!
          </a>
        </p>
      </form>
    </section>
  );
}
