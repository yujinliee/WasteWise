import React, { useState } from 'react';
import Logo from '../assets/Logo.png';
import { Link } from "react-router-dom";
import LoginModal from '../pages/LoginModal';
import SignUpModal from '../pages/SignUp';  // <-- Import SignUp Modal
import "../styles/Navbar.css";

function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  return (
    <div className="navbar">
      <div className="leftSide">
        <img src={Logo} alt="WasteWise Logo" />
      </div>
      <div className="rightSide">
        <Link to="/"> Home </Link>
        <Link to="/about"> About </Link>
        <Link to="/services"> Services </Link>
        <Link to="/contact"> Contact </Link>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {/* Popup Login */}
          <button className="login-btn" onClick={() => setOpenLogin(true)}>
            Login
          </button>

          {/* Popup Sign Up */}
          <button className="signup-btn" onClick={() => setOpenSignUp(true)}>
            Sign Up
          </button>
        </div>
      </div>

      {/* Popups */}
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(false)} />
      <SignUpModal open={openSignUp} handleClose={() => setOpenSignUp(false)} />
    </div>
  );
}

export default Navbar;
