import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../Components/firebase";
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

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (!open) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg">
            {/* Header */}
            <div className="modal-header d-flex justify-content-between align-items-center bg-white">
              <div className="flex-grow-1 text-center">
                <h5 className="modal-title fw-bold mb-0">Create Account</h5>
              </div>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>

            {/* Body */}
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
                  <label className="form-label fw-semibold">Confirm Password</label>
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger small">{errors.confirmPassword}</div>
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
                  <label className="form-check-label small" htmlFor="agreeToTerms">
                    I agree to the{" "}
                    <button 
                      type="button" 
                      className="btn btn-link text-primary p-0 border-0 align-baseline"
                      onClick={() => openModal('terms')}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button 
                      type="button" 
                      className="btn btn-link text-primary p-0 border-0 align-baseline"
                      onClick={() => openModal('privacy')}
                    >
                      Privacy Policy
                    </button>
                  </label>
                  {errors.agreeToTerms && (
                    <div className="text-danger small">{errors.agreeToTerms}</div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-success w-100 mb-2">
                  Sign Up
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="modal-footer justify-content-center">
              <p className="mb-0 small">
                Already have an account?{" "}
                <button 
                  type="button" 
                  className="btn btn-link text-primary fw-semibold p-0 border-0 align-baseline"
                  onClick={handleClose}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Terms of Service</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body text-start" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <h6>Welcome to WasteWise!</h6>
                <p>By creating an account, you agree to the following terms:</p>
                
                <h6>1. Account Responsibilities</h6>
                <ul>
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                </ul>

                <h6>2. Acceptable Use</h6>
                <ul>
                  <li>Use the platform only for lawful purposes</li>
                  <li>Do not engage in any activity that disrupts or interferes with the service</li>
                  <li>Respect other users and maintain appropriate conduct</li>
                </ul>

                <h6>3. Data Usage</h6>
                <ul>
                  <li>We collect and process data as described in our Privacy Policy</li>
                  <li>You grant us permission to use your data to provide and improve our services</li>
                </ul>

                <h6>4. Service Modifications</h6>
                <p>We reserve the right to modify or discontinue services at any time. Continued use after changes constitutes acceptance of modified terms.</p>

                <h6>5. Termination</h6>
                <p>We may suspend or terminate accounts that violate these terms or engage in harmful activities.</p>

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={closeModal}>
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Privacy Policy</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body text-start" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <h6>Your Privacy Matters</h6>
                <p>We are committed to protecting your personal information. Here's how we handle your data:</p>
                
                <h6>1. Information We Collect</h6>
                <ul>
                  <li><strong>Personal Information:</strong> Name, email address, and contact details</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform</li>
                  <li><strong>Device Information:</strong> Browser type, IP address, and operating system</li>
                </ul>

                <h6>2. How We Use Your Information</h6>
                <ul>
                  <li>To provide and maintain our waste management services</li>
                  <li>To send important notifications about your account</li>
                  <li>To improve our platform and user experience</li>
                  <li>To comply with legal obligations</li>
                </ul>

                <h6>3. Data Protection</h6>
                <ul>
                  <li>We implement industry-standard security measures</li>
                  <li>Your data is encrypted during transmission</li>
                  <li>Access to personal information is restricted to authorized personnel</li>
                </ul>

                <h6>4. Data Sharing</h6>
                <p>We do not sell your personal information. We may share data with:</p>
                <ul>
                  <li>Service providers who assist in platform operations</li>
                  <li>Legal authorities when required by law</li>
                </ul>

                <h6>5. Your Rights</h6>
                <ul>
                  <li>Access and review your personal data</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={closeModal}>
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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