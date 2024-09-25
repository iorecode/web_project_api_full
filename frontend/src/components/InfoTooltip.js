import React from "react";

export default function InfoTooltip({
  onClose,
  activeClass,
  tooltipImage,
  tooltipMessage,
}) {
  const tooltipClass = `tooltip ${activeClass}`;
  return (
    <div className={tooltipClass}>
      <button
        type="button"
        onClick={onClose}
        className="popup__close tooltip__close"
        aria-label="Close tooltip"
      ></button>
      <img src={tooltipImage} alt="" className="tooltip__image"></img>
      <p className="tooltip__text">{tooltipMessage}</p>
    </div>
  );
}
