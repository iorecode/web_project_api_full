import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup ${card ? "form_opened" : "popup_hidden"}`}
      id="FormImage"
    >
      <div className="popup__image-container">
        <button
          type="button"
          className="form__btn-close"
          onClick={onClose}
        ></button>
        <img
          src={card ? card.link : "#"}
          alt={card ? card.name : ""}
          className="popup__image"
          style={{ display: card ? "inline-block" : "none" }}
        />
        <p className="popup__image-subtitle">{card ? card.name : ""}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
