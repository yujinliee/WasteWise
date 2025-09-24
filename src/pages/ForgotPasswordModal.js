// src/pages/ForgotPasswordModal.js
import React, { useState } from "react";
import "../styles/ForgotPasswordModal.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Components/firebase";

function ForgotPasswordModal({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button className="close-btn" onClick={handleClose}>✖</button>

        <div className="modal-main">
          <h2>Forgot Password?</h2>
          <p>Enter your email to reset your password.</p>

          <form className="forgot-form" onSubmit={handleReset}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}

            <button type="submit" className="reset-btn">Send Reset Link</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
