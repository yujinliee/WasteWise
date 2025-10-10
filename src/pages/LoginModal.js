import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../Components/firebase";
import { useNavigate } from "react-router-dom";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { saveUserToFirestore } from "../Components/saveUserToFirestore";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginModal({ open, handleClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (user.email !== "admin@gmail.com" && !user.emailVerified) {
        await signOut(auth);
        setError("⚠️ Please verify your email first.");
        setIsLoading(false);
        return;
      }

      handleClose();
      navigate(user.email === "admin@gmail.com" ? "/admin" : "/dashboard");
    } catch (err) {
      setError("❌ Invalid credentials.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await saveUserToFirestore(user);

      handleClose();
      navigate(user.email === "admin@gmail.com" ? "/admin" : "/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setError("❌ Google login failed.");
      setIsLoading(false);
    }
  };

  if (!open && !showForgot) return null;

  return (
    <>
      {showForgot ? (
        <ForgotPasswordModal
          open={true}
          handleClose={() => setShowForgot(false)}
        />
      ) : (
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
                  <h5 className="modal-title fw-bold mb-0">Sign In</h5>
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
                <p className="text-muted mb-4">
                  Continue your journey with{" "}
                  <span className="fw-semibold text-success">TrashAlign</span>.
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
                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger w-100"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing In...
                      </>
                    ) : (
                      "Sign in with Google"
                    )}
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
                      handleClose();
                      navigate("/signup");
                    }}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginModal;
