import React, { useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser._id;

  const cardDeleteButtonClassName = `photo__delete ${
    isOwn ? "" : "photo__delete_hidden"
  }`;

  const isLiked = card.likes.some(
    (like) => like === currentUser._id || like._id === currentUser._id
  );
  const cardLikeButtonClassName = `photo__like ${
    isLiked ? "photo__like_active" : ""
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <div className="photo__card">
      <button
        type="button"
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
      ></button>
      <img
        src={card.link}
        alt={card.name}
        className="photo__card-image"
        onClick={handleClick}
      />
      <div className="photo__card-title">
        <h2 className="photo__text">{card.name}</h2>
        <button
          type="button"
          className={cardLikeButtonClassName}
          onClick={handleLikeClick}
        ></button>
        <p className="photo__like-count">
          {Array.isArray(card.likes) ? card.likes.length : 0}
        </p>
      </div>
    </div>
  );
}

export default Card;
