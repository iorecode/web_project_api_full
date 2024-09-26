import React, { useState } from "react";
import { register } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import successCheckImage from "../images/successCheck.png";
import failureCheckImage from "../images/failureCheck.png";

export function Register({ onRegister }) {
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

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (validatePassword(cleanPassword) && validateEmail(cleanEmail)) {
      setIsSubmitting(true);
      register(cleanEmail, cleanPassword)
        .then((res) => {
          onRegister(true, "Vitória! Você precisa entrar.", successCheckImage);
          console.log("Registro bem-sucedido:", res);
        })
        .catch((err) => {
          setEmail("");
          setPassword("");
          onRegister(
            false,
            "Ops, algo saiu deu errado! Por favor, tente novamente.",
            failureCheckImage
          );
        })
        .finally(() => {
          setIsSubmitting(false);
          setEmail("");
          setPassword("");
        });
    } else if (!validateEmail(cleanEmail)) {
      onRegister(false, "Insira um E-mail valido", failureCheckImage);
    } else if (!validatePassword(cleanPassword)) {
      onRegister(
        false,
        "A senha exige pelo menos uma letra maiúscula, uma letra minúscula, um número, e um caractere especial, com um comprimento mínimo de 8 caracteres.",
        failureCheckImage
      );
    }
  };

  const buttonClass = `register__button ${
    isSubmitting ? `register__button-loading` : ""
  }`;

  return (
    <section className="register">
      <form className="register__form" onSubmit={handleRegisterSubmit}>
        <p className="register__title">Inscrever-se</p>
        <fieldset className="register__fieldset">
          <div className="register__input-container">
            <input
              value={email}
              type="email"
              placeholder="E-mail"
              required
              className="register__input"
              onChange={handleEmailChange}
              minLength="6"
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
              minLength="8"
            ></input>
          </div>
        </fieldset>
        <button className={buttonClass} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Registrar"}
        </button>
        <p className="register__notation">
          Já é um membro?
          <a
            className="register__notation-link"
            href="#"
            onClick={() => navigate("/signin")}
          >
            Faça o login aqui!
          </a>
        </p>
      </form>
    </section>
  );
}
