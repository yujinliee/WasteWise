import React, { useState } from "react";
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
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1050,
      }}
      onMouseDown={(e) => {
        // Only close if clicking directly on the backdrop
        if (e.target.classList.contains("modal")) {
          handleClose();
        }
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg">
          {/* Header */}
          <div className="modal-header bg-white position-relative">
            <div className="flex-grow-1 text-center">
              <h5 className="modal-title fw-bold mb-0">Forgot Password?</h5>
            </div>
            <button
              type="button"
              className="btn-close position-absolute"
              style={{ right: "1rem", top: "1rem" }}
              onClick={handleClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body px-4">
            <p className="text-muted mb-4 text-center">
              Enter your email to reset your password.
            </p>

            <form onSubmit={handleReset}>
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

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

              <button type="submit" className="btn btn-success w-100">
                Send Reset Link
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer justify-content-center">
            <p className="text-muted mb-0 small">
              Remember your password?{" "}
              <button
                type="button"
                className="btn btn-link text-success fw-semibold p-0"
                onClick={handleClose}
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
