import React, { useState, useEffect, useContext } from "react";
import { PopupWithForm } from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

export function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [currentUser]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAboutChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    }).then((res) => {
      if (res) {
        setName("");
        setDescription("");
        onClose();
      }
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Editar perfil"
      name="edit"
      submit="Salvar"
      onSubmit={handleSubmit}
    >
      <div className="form__input-container">
        <input
          type="text"
          placeholder="Nome"
          className="form__input"
          name="name"
          id="NameInput"
          value={name}
          onChange={handleNameChange}
          minLength="2"
          maxLength="40"
          required
        />
        <span className="form__input-error NameInput-error"></span>
      </div>
      <div className="form__input-container">
        <input
          type="text"
          name="about"
          placeholder="Sobre Mim"
          className="form__input"
          id="AboutInput"
          value={description}
          onChange={handleAboutChange}
          minLength="2"
          maxLength="200"
          required
        />
        <span className="form__input-error AboutInput-error"></span>
      </div>
    </PopupWithForm>
  );
}
