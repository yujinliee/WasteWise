import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../Components/firebase";
import SuccessPopup from "../Components/SuccessPopup";

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

  useEffect(() => {
    let t;
    if (successOpen) {
      t = setTimeout(() => {
        setSuccessOpen(false);
        handleClose();
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
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

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

      await sendEmailVerification(userCredential.user);
      await signOut(auth);

      setFormData(initialForm);
      setSuccessOpen(true);
    } catch (error) {
      alert("❌ " + error.message);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">
            {/* Header */}
            <div className="modal-header text-white">
              <h5 className="modal-title">Create Account</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="text-start">
                {/* Name fields */}
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                    {errors.firstName && (
                      <div className="text-danger small">{errors.firstName}</div>
                    )}
                  </div>
                  <div className="col">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    {errors.lastName && (
                      <div className="text-danger small">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <div className="text-danger small">{errors.email}</div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                  {errors.password && (
                    <div className="text-danger small">{errors.password}</div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger small">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="agreeToTerms">
                    I agree to the{" "}
                    <a href="#" className="text-primary">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary">
                      Privacy Policy
                    </a>
                  </label>
                  {errors.agreeToTerms && (
                    <div className="text-danger small">
                      {errors.agreeToTerms}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-100 mb-2">
                  Sign Up
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="modal-footer justify-content-center">
              <p className="mb-0">
                Already have an account?{" "}
                <a href="#" className="text-primary fw-semibold" onClick={handleClose}>
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <SuccessPopup
        open={successOpen}
        message="✅ Account created successfully! Please check your email for verification."
        handleClose={() => {
          setSuccessOpen(false);
          handleClose();
        }}
      />
    </>
  );
}

export default SignUpModal;
