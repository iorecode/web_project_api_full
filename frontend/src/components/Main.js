import React, { useCallback, useContext, useState } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import Card from "./Card";
import edit from "../images/edit.png";

function Main({
  cards,
  onCardLike,
  onCardDelete,
  onEditProfileClick,
  onAddPlaceClick,
  onEditAvatarClick,
  onCardClick,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [isEditDisplayed, setIsEditDisplayed] = useState(false);
  const avatarClassName = `user__image-main ${
    isEditDisplayed ? "user__image-main_transparent" : ""
  }`;
  const avatarEditClassName = `user__image-edit ${
    isEditDisplayed ? "user__image-edit_visible" : ""
  }`;

  const handleMouseEnter = useCallback(() => {
    setIsEditDisplayed(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setIsEditDisplayed(false);
  }, []);

  return (
    <>
      <div className="user">
        <div
          className="user__image"
          onClick={onEditAvatarClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={currentUser.avatar}
            alt="Avatar do usuário"
            className={avatarClassName}
          />
          <img
            src={edit}
            alt="Editar avatar do usuário"
            className={avatarEditClassName}
          />
        </div>
        <div className="user__data">
          <div className="user__data-main">
            <h1 className="user__name">{currentUser.name}</h1>
            <button
              className="user__edit"
              onClick={onEditProfileClick}
            ></button>
          </div>
          <h2 className="user__role">{currentUser.about}</h2>
        </div>
        <button className="user__add" onClick={onAddPlaceClick}></button>
      </div>
      <div className="photo">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </>
  );
}

export default Main;
