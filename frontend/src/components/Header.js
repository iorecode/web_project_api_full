import React, { useState } from "react";
import logo from "../images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

export function Header({ navText, isLoggedin, handleLogoutClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [navDisplayClass, setNavDisplayClass] = useState("");
  const [isNavLogoutVisible, setIsNavLogoutVisible] = useState(false);

  const navDisplay = isLoggedin
    ? isNavLogoutVisible
      ? "Sair"
      : navText
    : location.pathname === "/signup"
    ? "Entrar"
    : "Inscrever-se";

  const handleMouseEnterLogic = () => {
    if (isLoggedin) {
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
    if (isLoggedin && isNavLogoutVisible) {
      handleLogoutClick();
    } else if (!isLoggedin) {
      location.pathname === "/signup"
        ? navigate("/signin")
        : navigate("/signup");
    }
  };

  const dynamicNavDisplayClass = `nav__user ${navDisplayClass}`;

  return (
    <header className="nav">
      <img src={logo} alt="Logotipo" className="nav__logo" />
      <p
        className={dynamicNavDisplayClass}
        onMouseEnter={handleMouseEnterLogic}
        onMouseLeave={handleMouseLeaveLogic}
        onClick={handleLogoutClickLogic}
      >
        {navDisplay}
      </p>
    </header>
  );
}
