import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { auth, googleProvider } from "../Components/firebase";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SuccessPopup from "../Components/SuccessPopup";

function LoginModal({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (user.email !== "admin@gmail.com" && !user.emailVerified) {
        await signOut(auth);
        setError("⚠️ Please verify your email first.");
        setShowResend(true);
        return;
      }

      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        handleClose();
        navigate(user.email === "admin@gmail.com" ? "/admin" : "/dashboard");
      }, 2000);
    } catch (err) {
      setError("❌ Invalid credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        handleClose();
        navigate(user.email === "admin@gmail.com" ? "/admin" : "/dashboard");
      }, 2000);
    } catch (err) {
      setError("❌ Google login failed.");
    }
  };

  return (
    <>
      {open && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg">
              {/* Header */}
              <div className="modal-header text-white">
                <h5 className="modal-title text-center">Welcome Back 👋</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>

              {/* Body */}
              <div className="modal-body">
                <p className="text-muted">Login to continue your journey with WasteWise.</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin} className="text-start">
                  {/* Email */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      onClick={() => setShowForgot(true)}
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Buttons */}
                  <button type="submit" className="btn btn-success w-100 mb-2">
                    Log In
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={handleGoogleLogin}
                  >
                    Sign in with Google
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className="modal-footer justify-content-center">
                <p className="mb-0">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-success fw-semibold">
                    Sign Up
                  </a>
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

      <SuccessPopup
        open={successOpen}
        message="✅ Logged in successfully!"
        handleClose={() => setSuccessOpen(false)}
      />
    </>
  );
}

export default LoginModal;
