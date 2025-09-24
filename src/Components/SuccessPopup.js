// src/Components/SuccessPopup.js
import React from "react";
import "../styles/SuccessPopup.css";

export default function SuccessPopup({ open, message, handleClose }) {
  if (!open) return null;
  return (
    <div className="success-overlay" role="dialog" aria-modal="true">
      <div className="success-box">
        <button className="success-close" onClick={handleClose}>✖</button>
        <div className="success-icon">✅</div>
        <p className="success-message">{message}</p>
        <button className="success-ok" onClick={handleClose}>OK</button>
      </div>
    </div>
  );
}
