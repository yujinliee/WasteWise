import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth, db } from "../Components/firebase"; // ✅ make sure db is exported from your firebase.js
import { doc, setDoc } from "firebase/firestore";
import SuccessPopup from "../Components/SuccessPopup";
import "bootstrap/dist/css/bootstrap.min.css";

function SignUpModal({ open, handleClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'terms' or 'privacy'

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
      // ✅ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      const displayName = `${formData.firstName} ${formData.lastName}`;

      // ✅ Update display name in Firebase Auth
      await updateProfile(user, { displayName });

      // ✅ Add user to Firestore (so it shows up in Admin Dashboard)
      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email: formData.email,
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0], // format: YYYY-MM-DD
        archived: false,
      });

      console.log("User added to Firestore successfully!");

      // ✅ Send verification email
      await sendEmailVerification(user);

      // ✅ Log out after signup to force email verification
      await signOut(auth);

      setFormData(initialForm);
      setSuccessOpen(true);
    } catch (error) {
      alert("❌ " + error.message);
      console.error("Error during sign-up:", error);
    }
  };

  const openModal = (modalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  if (!open) return null;

  return (
    <>
      {/* Sign Up Modal */}
      <div
        className="modal show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-white">
              <h5 className="modal-title fw-bold text-center flex-grow-1">
                Create Account
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body px-4">
              <form onSubmit={handleSubmit}>
                {/* Name fields */}
                <div className="row g-2 mb-2 text-start">
                  <div className="col">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
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
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
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
                <div className="mb-2 text-start">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
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
                <div className="mb-2 text-start">
                  <label className="form-label fw-semibold">Password</label>
                  <div className="input-group input-group-sm">
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
                <div className="mb-2 text-start">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <div className="input-group input-group-sm">
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
                <div className="form-check mb-2 text-start">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="agreeToTerms"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      className="btn btn-link text-primary p-0 border-0"
                      onClick={() => openModal("terms")}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="btn btn-link text-primary p-0 border-0"
                      onClick={() => openModal("privacy")}
                    >
                      Privacy Policy
                    </button>
                  </label>
                  {errors.agreeToTerms && (
                    <div className="text-danger small">
                      {errors.agreeToTerms}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-success w-100 mb-2">
                  Sign Up
                </button>
              </form>
            </div>

            <div className="modal-footer justify-content-center">
              <p className="mb-0 small">
                Already have an account?{" "}
                <button
                  type="button"
                  className="btn btn-link text-primary fw-semibold p-0 border-0"
                  onClick={handleClose}
                >
                  Sign In
                </button>
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
