import React from "react";

export function PopupWithForm({
  title,
  name,
  isOpen,
  onClose,
  submit,
  children,
  onSubmit,
}) {
  return (
    <div className={`form ${isOpen ? "form_opened" : ""}`} id={`Form${name}`}>
      <button
        type="button"
        className="form__btn-close"
        aria-label="Close form"
        onClick={onClose}
      ></button>
      <h2 className="form__title">{title}</h2>
      <form className="form__fieldset" name={name} onSubmit={onSubmit}>
        {children}
        <button type="submit" className="form__button">
          {submit}
        </button>
      </form>
    </div>
  );
}
