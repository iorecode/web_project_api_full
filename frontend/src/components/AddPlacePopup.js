import React, { useState } from "react";
import { PopupWithForm } from "./PopupWithForm";

export function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: title,
      link: link,
    });
    setTitle(""); // Limpa o título
    setLink(""); // Limpa o link
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar lugar"
      name="add-place"
      submit="Criar"
      onSubmit={handleSubmit}
    >
      <div className="form__input-container">
        <input
          type="text"
          placeholder="Título"
          className="form__input"
          name="title"
          id="TitleInput"
          value={title}
          onChange={handleTitleChange}
          required
          minLength="2"
          maxLength="30"
        />
        <span className="form__input-error TitleInput-error"></span>
      </div>
      <div className="form__input-container">
        <input
          type="url"
          name="url"
          placeholder="Link da imagem"
          className="form__input"
          id="LinkInput"
          value={link}
          onChange={handleLinkChange}
          required
        />
        <span className="form__input-error LinkInput-error"></span>
      </div>
    </PopupWithForm>
  );
}
