// src/Components/ConfirmDeletePopup.js
import React from "react";
import "../styles/ConfirmDeletePopup.css";

const ConfirmDeletePopup = ({ open, onClose, onConfirm, user }) => {
  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>⚠️ Confirm Delete</h3>
        <p>
          Are you sure you want to delete <strong>{user?.displayName || "this user"}</strong>?
        </p>
        <div className="popup-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
