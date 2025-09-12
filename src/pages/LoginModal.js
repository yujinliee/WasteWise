// src/pages/LoginModal.js
import React from "react";
import "../styles/LoginModal.css";
import Logo from "../assets/Logo.png";
import Image from "../assets/login_image.png";

function LoginModal({ open, handleClose }) {
  if (!open) return null; // don’t render if modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Close Button */}
        <button className="close-btn" onClick={handleClose}>✖</button>

        {/* Left Section (Form) */}
        <div className="modal-left">
          <div className="modal-header">
            <img src={Logo} alt="WasteWise Logo" className="logo" />
            <h2>Welcome Back 👋</h2>
            <p>Login to continue your journey with WasteWise.</p>
          </div>

          <form className="login-form">
            <label>Email</label>
            <input type="email" placeholder="Your email" required />

            <label>Password</label>
            <input type="password" placeholder="Your password" required />

            <button type="submit" className="login-btn">Log In</button>
          </form>

          <div className="extra-links">
            <a href="/forgot" className="forgot">Forgot your password?</a>
            <p className="signup-text">
              Don’t have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="modal-right">
          <img src={Image} alt="Waste collection illustration" />
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
