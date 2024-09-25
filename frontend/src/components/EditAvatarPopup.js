import React, { useRef, useState } from "react";
import { PopupWithForm } from "./PopupWithForm";

export function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const [avatar, setAvatar] = useState("");
  const avatarRef = useRef(null);

  function handleAvatarInputChange(e) {
    setAvatar(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    }).then((res) => {
      setAvatar("");
      onClose();
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Editar avatar"
      name="edit-avatar"
      submit="Salvar"
      onSubmit={handleSubmit}
    >
      <div className="form__input-container">
        <input
          type="url"
          placeholder="URL da imagem"
          className="form__input"
          name="profileUrl"
          id="ProfileLinkInput"
          ref={avatarRef}
          value={avatar}
          onChange={handleAvatarInputChange}
          required
        />
        <span className="form__input-error ProfileLinkInput-error"></span>
      </div>
    </PopupWithForm>
  );
}
