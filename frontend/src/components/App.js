import React, { useEffect, useState } from "react";
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
  const [isAnyPopupOpen, setIsAnyPopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navText, setNavText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      verifyUser()
        .then((res) => {
          if (res && res.data) {
            setCurrentUser(res.data);
            setNavText(res.data.email);
            setIsLoggedIn(true);
          }
        })
        .catch((err) => {
          console.error("Erro ao verificar o token:", err);
          setIsLoggedIn(false);
          if (location.pathname !== "/signup") {
            navigate("/signin");
          }
        });
    } else {
      setIsLoggedIn(false);
      if (location.pathname !== "/signup") {
        navigate("/signin");
      }
    }
  }, [navigate, isLoggedIn, location.pathname]);

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
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error("Erro ao adicionar novo cartão:", err);
      });
  }

  function handleUpdateUser({ name, about }) {
    api
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
    api
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
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.error("Erro ao alterar status do like:", err);
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
    setNavText("Entrar");
    navigate("/signin");
  }

  useEffect(() => {
    const isOpen =
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isEditAvatarPopupOpen ||
      selectedCard !== null ||
      isSubmitCheckPopupOpen ||
      isTooltipOpen;
    setIsAnyPopupOpen(isOpen);
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
        .getUserData()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => {
          console.log("Erro ao pegar dados de usuario: ", err);
        });

      api
        .getCardList()
        .then((cardList) => {
          setCards(cardList);
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
                setIsLoggedIn={setIsLoggedIn}
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
