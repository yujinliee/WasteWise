// src/pages/LoginModal.js
import React, { useState } from "react";
import "../styles/LoginModal.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { auth, googleProvider } from "../Components/firebase";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";

function LoginModal({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  // ✅ Email/Password login with verification check
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (!user.emailVerified) {
        await signOut(auth); // force logout
        setError("⚠️ Please verify your email before logging in.");
        setShowResend(true);
        return;
      }

      handleClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Resend verification email
  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        alert("📩 Verification email sent! Check your inbox.");
        await signOut(auth);
        setShowResend(false);
      } catch (err) {
        setError("❌ Failed to send verification email: " + err.message);
      }
    }
  };

  // ✅ Google login with linking
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Google accounts are auto-verified, but check linking
      const methods = await fetchSignInMethodsForEmail(auth, user.email);
      if (methods.includes("password")) {
        const password = prompt(
          "This email is registered with a password. Enter it to link with Google:"
        );
        if (password) {
          const credential = EmailAuthProvider.credential(user.email, password);
          await linkWithCredential(user, credential);
          console.log("✅ Google linked with Email/Password!");
        }
      }

      handleClose();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={handleClose}>
              ✖
            </button>

            <div className="modal-main">
              <div className="modal-header">
                <h2>Welcome Back 👋</h2>
                <p>Login to continue your journey with WasteWise.</p>
              </div>

              <form className="login-form" onSubmit={handleLogin}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && <p className="error-text">{error}</p>}

                {showResend && (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleResendVerification}
                  >
                    Resend Verification Email
                  </button>
                )}

                <button
                  type="button"
                  className="forgot"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot your password?
                </button>

                <button type="submit" className="login-btn">
                  Log In
                </button>

                <button onClick={handleGoogleLogin} className="google-btn">
                  Sign in with Google
                </button>

              </form>

              <div className="extra-links">
                <p className="signup-text">
                  Don't have an account? <a href="/signup">Sign up</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ForgotPasswordModal
        open={showForgot}
        handleClose={() => setShowForgot(false)}
      />
    </>
  );
}

export default LoginModal;
