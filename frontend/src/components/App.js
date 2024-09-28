import React, { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import Main from "./Main";
import { PopupWithForm } from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import { useNavigate, Route, Routes, useLocation } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import InfoTooltip from "./InfoTooltip";
import { verifyUser } from "../utils/auth";

function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isSubmitCheckPopupOpen, setIsSubmitCheckPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({
    message: "",
    image: "",
    isSuccess: false,
  });
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navText, setNavText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Verificação do token e login automático
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token && !isLoggedIn) {
      // Verifica se já não esta logado
      verifyUser()
        .then((res) => {
          if (res && res.data) {
            setCurrentUser(res.data);
            setNavText(res.data.email);
            setIsLoggedIn(true);
            navigate("/"); // Redireciona para a página principal se o login for bem sucedido
          }
        })
        .catch((err) => {
          console.error("Token inválido ou expirado, redirecionando:", err);
          setIsLoggedIn(false);
          localStorage.removeItem("jwt"); // Remove o token inválido
          if (location.pathname !== "/signup") {
            navigate("/signin");
          }
        });
    } else if (!token && location.pathname !== "/signup") {
      // Redireciona para o login apenas se não houver token e o usuário não estiver na página de cadastro
      setIsLoggedIn(false);
      navigate("/signin");
    }
  }, [isLoggedIn, location.pathname, navigate, currentUser]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsSubmitCheckPopupOpen(false);
    setSelectedCard(null);
    setIsTooltipOpen(false);
  }

  function handleRegisterResult(isSuccess, message, image) {
    setTooltipData({ isSuccess, message, image });
    setIsTooltipOpen(true);
  }

  function handleAddPlaceFormSubmit({ name, link }) {
    api
      .addNewCard({ name, link })
      .then((newCard) => {
        setCards((prevCards) => {
          const updatedCards = [newCard, ...prevCards];
          return updatedCards;
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.error("Erro ao adicionar novo cartão:", err);
      });
  }

  function handleUpdateUser({ name, about }) {
    return api
      .saveProfileChanges({ name, about })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.error("Erro ao salvar alterações do perfil:", err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    return api
      .updateAvatar({ avatar })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.error("Erro ao atualizar avatar:", err);
      });
  }
  function handleCardLike(card) {
    const isLiked = card.likes.some(
      (like) => like === currentUser._id || like._id === currentUser._id
    );
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((response) => {
        const newCard = response;
        if (newCard) {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        } else {
          console.error("API não retornou um card válido.", newCard);
        }
      })
      .catch((err) => {
        console.error("Erro ao alterar o status de like:", err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.error("Erro ao deletar o cartão:", err);
      });
  }

  function handleLogout() {
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
    setCurrentUser({}); // Reset currentUser on logout
    setNavText("Entrar");
    navigate("/signin");
  }

  const isAnyPopupOpen = useMemo(() => {
    return (
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isEditAvatarPopupOpen ||
      selectedCard !== null ||
      isSubmitCheckPopupOpen ||
      isTooltipOpen
    );
  }, [
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    selectedCard,
    isSubmitCheckPopupOpen,
    isTooltipOpen,
  ]);

  useEffect(() => {
    if (isLoggedIn) {
      api
        .getCardList()
        .then((cardList) => {
          const reversedCardList = cardList.reverse();
          setCards(Array.isArray(reversedCardList) ? reversedCardList : []);
        })
        .catch((err) => {
          console.log("Erro ao buscar cartões: ", err);
        });
    }
  }, [isLoggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div
        className={`page ${isAnyPopupOpen ? "page__opacity-toggled" : ""}`}
        onClick={isAnyPopupOpen ? closeAllPopups : undefined}
      >
        <Header
          navText={navText}
          isLoggedIn={isLoggedIn}
          handleLogoutClick={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={Main}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onEditAvatarClick={handleEditAvatarClick}
                onCardClick={handleCardClick}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="/signin"
            element={
              <Login
                onLogin={handleRegisterResult}
                onLoginSuccess={setNavText}
                setIsLoggedIn={setIsLoggedIn}
                setCurrentUser={setCurrentUser}
                verifyUser={verifyUser}
              />
            }
          />
          <Route
            path="/signup"
            element={<Register onRegister={handleRegisterResult} />}
          />
        </Routes>
        <Footer />
      </div>

      {isTooltipOpen && (
        <InfoTooltip
          onClose={closeAllPopups}
          tooltipImage={tooltipData.image}
          tooltipMessage={tooltipData.message}
          activeClass="tooltip_opened"
        />
      )}

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceFormSubmit}
      />
      <PopupWithForm
        isOpen={isSubmitCheckPopupOpen}
        onClose={closeAllPopups}
        title=""
        id="SubmitCheck"
        submit="Sim"
      >
        <p className="form__title form__title_start">Tem certeza?</p>
      </PopupWithForm>
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default App;
