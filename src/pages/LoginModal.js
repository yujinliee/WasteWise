import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../Components/firebase";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SuccessPopup from "../Components/SuccessPopup";
import { saveUserToFirestore } from "../Components/saveUserToFirestore";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginModal({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
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

    console.log("User logged in via Google:");
    console.log("Display Name:", user.displayName);
    console.log("Email:", user.email);
    console.log("Photo URL:", user.photoURL);
    console.log("UID:", user.uid);
    console.log("Provider:", user.providerData[0]?.providerId);

    await saveUserToFirestore(user); // sync to Firestore if needed

    setSuccessOpen(true);
    setTimeout(() => {
      setSuccessOpen(false);
      handleClose();
      navigate(user.email === "admin@gmail.com" ? "/admin" : "/dashboard");
    }, 2000);
  } catch (error) {
    console.error("Google login error:", error);
    setError("❌ Google login failed.");
  }
};


  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow-lg">
      
      {/* Header */}
      <div className="modal-header d-flex justify-content-between align-items-center bg-white">
  <div className="flex-grow-1 text-center">
    <h5 className="modal-title fw-bold mb-0">Log In</h5>
  </div>
  <button type="button" className="btn-close" onClick={handleClose}></button>
</div>


      {/* Body */}
      <div className="modal-body px-4">
        <p className="text-muted mb-4">
          Continue your journey with <span className="fw-semibold text-success">WasteWise</span>.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
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
          <div className="mb-3 text-start">
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
          <button
            type="button"
            className="btn btn-link text-success fw-semibold p-0"
            onClick={() => {
              handleClose(); // close login modal
              navigate("/signup"); // go to signup page
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Modals */}
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
