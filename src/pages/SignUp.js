// src/pages/SignUpModal.js
import React, { useState, useEffect } from "react";
import "../styles/Signup.css";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../Components/firebase";
import SuccessPopup from "../Components/SuccessPopup"; // new component

function SignUpModal({ open, handleClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  };
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // If you want: auto-close success popup then close modal after X sec
  useEffect(() => {
    let t;
    if (successOpen) {
      // optional: auto-close after 6 seconds (comment out if you prefer manual close)
      t = setTimeout(() => {
        setSuccessOpen(false);
        handleClose(); // now close the signup modal
      }, 6000);
    }
    return () => clearTimeout(t);
  }, [successOpen, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      // send verification email
      await sendEmailVerification(userCredential.user);

      // sign them out so they must verify first
      await signOut(auth);

      // clear form (optional)
      setFormData(initialForm);

      // SHOW success popup (do NOT call handleClose here)
      setSuccessOpen(true);
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  // If parent closed modal, don't render
  if (!open) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <span className="close-btn" onClick={handleClose}>
            &times;
          </span>

          <h2>Create Account</h2>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="name-fields">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}

              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.password && <p className="error-message">{errors.password}</p>}

            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </span>
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

            <div className="terms-container">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeToTerms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="error-message">{errors.agreeToTerms}</p>}

            <button type="submit" className="signup-btn">
              Sign up
            </button>

            <p className="login-link">
              Already have an account?{" "}
              <a href="#" onClick={handleClose}>
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>

      <SuccessPopup
        open={successOpen}
        message="✅ Account created successfully! Please check your email for verification."
        handleClose={() => {
          setSuccessOpen(false);
          // then close the signup modal
          handleClose();
        }}
      />
    </>
  );
}

export default SignUpModal;
