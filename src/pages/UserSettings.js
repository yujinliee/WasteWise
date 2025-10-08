import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarUser from "../Components/NavbarUser";
import { auth } from "../Components/firebase";
import {
  updateProfile,
  updateEmail,
  reload,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useUser } from "../Components/UserContext";

function UserSettings() {
  const { user, refreshUser } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: null,
    darkMode: false,
    emailNotifications: true,
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  useEffect(() => {
    if (user) {
      const names = auth.currentUser?.displayName?.split(" ") || ["", ""];
      setFormData((prev) => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names[1] || "",
        email: auth.currentUser?.email || "",
        phone: auth.currentUser?.phoneNumber || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        profilePicture: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const showNotification = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  const resetProfileForm = () => {
    if (user) {
      const names = auth.currentUser?.displayName?.split(" ") || ["", ""];
      setFormData((prev) => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names[1] || "",
        email: auth.currentUser?.email || "",
        profilePicture: null,
      }));
    }
    const fileInput = document.querySelector('input[name="profilePicture"]');
    if (fileInput) fileInput.value = "";
  };

  const resetPasswordForm = () => {
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      showCurrent: false,
      showNew: false,
      showConfirm: false,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (!fullName) {
        alert("⚠️ Please enter both first and last name.");
        return;
      }

      const updates = {};
      if (fullName !== user.displayName) updates.displayName = fullName;

      if (formData.profilePicture instanceof File) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            updates.photoURL = reader.result;
            await updateProfile(user, updates);
            if (formData.email && formData.email !== user.email)
              await updateEmail(user, formData.email);
            await reload(user);
            await refreshUser();
            showNotification("✅ Profile updated successfully!");
            resetProfileForm();
          } catch (error) {
            alert("⚠️ Failed to update profile. Try again later.");
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(formData.profilePicture);
      } else {
        if (Object.keys(updates).length > 0) await updateProfile(user, updates);
        if (formData.email && formData.email !== user.email)
          await updateEmail(user, formData.email);
        await reload(user);
        await refreshUser();
        showNotification("✅ Profile updated successfully!");
        resetProfileForm();
        setIsLoading(false);
      }
    } catch {
      alert("⚠️ Failed to update profile. Try again later.");
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("⚠️ Please fill out all password fields.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("⚠️ Passwords do not match!");
      return;
    }
    if (formData.newPassword.length < 8) {
      alert("⚠️ Password should be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, formData.newPassword);
      resetPasswordForm();
      showNotification("✅ Password updated successfully!");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("❌ Incorrect current password.");
      } else if (error.code === "auth/requires-recent-login") {
        alert("⚠️ Please log in again to change your password.");
      } else {
        alert("⚠️ Failed to update password. Try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    showNotification("✅ Preferences saved successfully!");
  };

  return (
    <div className="d-flex">
      <NavbarUser />
      <div className="flex-grow-1 p-4 bg-light position-relative" style={{ minHeight: "100vh" }}>
        <div className="container">
          <div className="mb-4 text-center">
            <h2 className="fw-bold text-success">
              <i className="bi bi-gear-fill me-2"></i>Account Settings
            </h2>
            <p className="text-muted">Manage your profile, security, and preferences</p>
          </div>

          <ul className="nav nav-tabs mb-4 justify-content-center">
            {["profile", "security", "preferences"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="card border-0 shadow-sm p-4 bg-white">
              <h4 className="mb-3 text-success">
                <i className="bi bi-person-circle me-2"></i>Profile Information
              </h4>
              <form onSubmit={handleProfileSubmit}>
                <div className="row mb-3 text-start">
                  <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    className="form-control"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {formData.profilePicture && (
                    <div className="mt-2">
                      <img
                        src={
                          formData.profilePicture instanceof File
                            ? URL.createObjectURL(formData.profilePicture)
                            : formData.profilePicture
                        }
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "150px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={resetProfileForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="card border-0 shadow-sm p-4 bg-white">
              <h4 className="mb-3 text-success">
                <i className="bi bi-lock-fill me-2"></i>Change Password
              </h4>
              <form onSubmit={handlePasswordSubmit}>
                {/* Current Password */}
                <div className="mb-3 text-start">
                  <label className="form-label">Current Password</label>
                  <div className="input-group input-group-sm">
                    <input
                      type={formData.showCurrent ? "text" : "password"}
                      className="form-control"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          showCurrent: !prev.showCurrent,
                        }))
                      }
                    >
                      <i className={`bi ${formData.showCurrent ? "bi-eye-slash" : "bi-eye"}`}></i>
                      {formData.showCurrent ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3 text-start">
                  <label className="form-label">New Password</label>
                  <div className="input-group input-group-sm">
                    <input
                      type={formData.showNew ? "text" : "password"}
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          showNew: !prev.showNew,
                        }))
                      }
                    >
                      <i className={`bi ${formData.showNew ? "bi-eye-slash" : "bi-eye"}`}></i>
                      {formData.showNew ? "Hide" : "Show"}
                    </button>
                  </div>
                  <small className="text-muted">Must be at least 8 characters long.</small>
                </div>

                {/* Confirm Password */}
                <div className="mb-4 text-start">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group input-group-sm">
                    <input
                      type={formData.showConfirm ? "text" : "password"}
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary d-flex align-items-center gap-1"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          showConfirm: !prev.showConfirm,
                        }))
                      }
                    >
                      <i className={`bi ${formData.showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                      {formData.showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetPasswordForm}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="card border-0 shadow-sm p-4 bg-white">
              <h4 className="mb-3 text-success">
                <i className="bi bi-sliders me-2"></i>Preferences
              </h4>
              <form onSubmit={handlePreferencesSubmit}>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="darkMode">
                    Enable Dark Mode
                  </label>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Receive Email Notifications
                  </label>
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <button type="submit" className="btn btn-success">
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {showPopup && (
          <div
            className="position-fixed top-0 start-50 translate-middle-x mt-5 bg-success text-white px-4 py-3 rounded shadow"
            style={{ zIndex: 1050 }}
          >
            {popupMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;
