// src/Components/EditProfileModal.js
import React, { useState } from "react";
import "../styles/EditProfileModal.css"; 

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [campus, setCampus] = useState(user?.campus || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ displayName, campus });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Floor</label>
            <input
              type="text"
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
