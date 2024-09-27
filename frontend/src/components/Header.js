import React, { useState } from "react";
import logo from "../images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export function Header({ navText, isLoggedIn, handleLogoutClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [navDisplayClass, setNavDisplayClass] = useState("");
  const [isNavLogoutVisible, setIsNavLogoutVisible] = useState(false);

  const navDisplay = isLoggedIn
    ? isNavLogoutVisible
      ? "Deseja sair?"
      : navText
    : location.pathname === "/signup"
    ? "Entrar"
    : "Inscrever-se";

  const handleMouseEnterLogic = () => {
    if (isLoggedIn) {
      setNavDisplayClass("nav__user-logout");
      setIsNavLogoutVisible(true);
    } else {
      setNavDisplayClass("");
    }
  };

  const handleMouseLeaveLogic = () => {
    setNavDisplayClass("");
    setIsNavLogoutVisible(false);
  };

  const handleLogoutClickLogic = () => {
    if (isLoggedIn && isNavLogoutVisible) {
      handleLogoutClick();
    } else if (!isLoggedIn) {
      location.pathname === "/signup"
        ? navigate("/signin")
        : navigate("/signup");
    }
  };

  const dynamicNavDisplayClass = `nav__user ${navDisplayClass}`;

  return (
    <header className="nav">
      <img src={logo} alt="Logotipo" className="nav__logo" />
      <button
        className={dynamicNavDisplayClass}
        onMouseEnter={handleMouseEnterLogic}
        onMouseLeave={handleMouseLeaveLogic}
        onClick={handleLogoutClickLogic}
      >
        {navDisplay}
      </button>
    </header>
  );
}
