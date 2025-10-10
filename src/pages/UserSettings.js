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
import TopNavbarUser from "../Components/TopNavbarUser";
import "../styles/UserDashboard.css";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    setTimeout(() => setShowPopup(false), 3000);
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

  const tabConfig = [
    { key: "profile", label: "Profile", icon: "bi-person-circle", color: "success" },
    { key: "security", label: "Security", icon: "bi-shield-lock", color: "warning" },
    { key: "preferences", label: "Preferences", icon: "bi-sliders", color: "info" },
  ];

  return (
    <div className="d-flex vh-100 bg-light">
      <NavbarUser />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarUser />

        <div className="flex-grow-1 p-4 overflow-auto">
          <div className="container-fluid">
            {/* Welcome Header */}
            <div className="widget welcome-section mb-4 animate__animated animate__fadeInDown">
              <h2 className="mb-1">
                <i className="bi bi-gear me-2 text-success"></i>
                Account Settings
              </h2>
              <p className="text-muted mb-0">
                Manage your profile, security, and preferences for a personalized experience
              </p>
            </div>

            {/* KPI Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeInUp">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold"><i className="bi bi-person-check me-2 text-success"></i>Profile</h5>
                    <span className="text-success fs-4 fw-bold">100%</span>
                  </div>
                  <p className="text-muted mb-0">Complete profile setup</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeInUp">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold"><i className="bi bi-shield-check me-2 text-success"></i>Security</h5>
                    <span className="text-success fs-4 fw-bold">Strong</span>
                  </div>
                  <p className="text-muted mb-0">Account protection</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeInUp">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold"><i className="bi bi-bell me-2 text-warning"></i>Notifications</h5>
                    <span className="text-warning fs-4 fw-bold">Active</span>
                  </div>
                  <p className="text-muted mb-0">Email alerts enabled</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeInUp">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold"><i className="bi bi-clock me-2 text-info"></i>Last Updated</h5>
                    <span className="text-info fs-4 fw-bold">Today</span>
                  </div>
                  <p className="text-muted mb-0">Recently active</p>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid">
              {/* Left Column - Settings Content */}
              <div>
                {/* Settings Navigation */}
                <div className="widget shadow-sm rounded-3 p-3 bg-white mb-4 animate__animated animate__fadeIn">
                  <div className="widget-header mb-3">
                    <h5 className="fw-bold"><i className="bi bi-sliders me-2 text-primary"></i>Settings Navigation</h5>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {tabConfig.map((tab, index) => (
                      <button
                        key={tab.key}
                        className={`btn ${activeTab === tab.key ? 'btn-success' : 'btn-outline-success'} animate__animated animate__fadeIn`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        <i className={`${tab.icon} me-2`}></i>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings Content */}
                <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeIn">
                  <div className="widget-header mb-3">
                    <h5 className="fw-bold">
                      <i className={`bi ${
                        activeTab === 'profile' ? 'bi-person-circle text-success' :
                        activeTab === 'security' ? 'bi-shield-lock text-warning' :
                        'bi-sliders text-info'
                      } me-2`}></i>
                      {tabConfig.find(tab => tab.key === activeTab)?.label}
                    </h5>
                    <small className="text-muted">
                      {activeTab === 'profile' && 'Update your personal details and profile picture'}
                      {activeTab === 'security' && 'Manage your password and account security'}
                      {activeTab === 'preferences' && 'Customize your app experience'}
                    </small>
                  </div>
                  
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <div className="animate__animated animate__fadeIn">
                      <form onSubmit={handleProfileSubmit}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">First Name</label>
                            <input
                              type="text"
                              className="form-control border-0 bg-light py-3"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              placeholder="Enter your first name"
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Last Name</label>
                            <input
                              type="text"
                              className="form-control border-0 bg-light py-3"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              placeholder="Enter your last name"
                              required
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Email Address</label>
                            <input
                              type="email"
                              className="form-control border-0 bg-light py-3"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email address"
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Profile Picture</label>
                            <div className="border-dashed rounded-3 p-4 text-center bg-light">
                              <input
                                type="file"
                                className="d-none"
                                id="profilePicture"
                                name="profilePicture"
                                accept="image/*"
                                onChange={handleChange}
                              />
                              <label htmlFor="profilePicture" className="cursor-pointer">
                                <i className="bi bi-cloud-arrow-up fs-1 text-muted mb-2 d-block"></i>
                                <p className="text-muted mb-2">
                                  Click to upload or drag and drop
                                </p>
                                <small className="text-muted">SVG, PNG, JPG (max. 5MB)</small>
                              </label>
                            </div>
                            {formData.profilePicture && (
                              <div className="mt-3 text-center">
                                <img
                                  src={
                                    formData.profilePicture instanceof File
                                      ? URL.createObjectURL(formData.profilePicture)
                                      : formData.profilePicture
                                  }
                                  alt="Preview"
                                  className="img-thumbnail rounded-circle"
                                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary px-4"
                            onClick={resetProfileForm}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-success px-4"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="animate__animated animate__fadeIn">
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label fw-semibold">Current Password</label>
                            <div className="input-group">
                              <input
                                type={formData.showCurrent ? "text" : "password"}
                                className="form-control border-0 bg-light py-3"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary border-0 bg-light"
                                onClick={() => setFormData(prev => ({ ...prev, showCurrent: !prev.showCurrent }))}
                              >
                                <i className={`bi ${formData.showCurrent ? "bi-eye-slash" : "bi-eye"}`}></i>
                              </button>
                            </div>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">New Password</label>
                            <div className="input-group">
                              <input
                                type={formData.showNew ? "text" : "password"}
                                className="form-control border-0 bg-light py-3"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary border-0 bg-light"
                                onClick={() => setFormData(prev => ({ ...prev, showNew: !prev.showNew }))}
                              >
                                <i className={`bi ${formData.showNew ? "bi-eye-slash" : "bi-eye"}`}></i>
                              </button>
                            </div>
                            <small className="text-muted">Must be at least 8 characters long</small>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold">Confirm Password</label>
                            <div className="input-group">
                              <input
                                type={formData.showConfirm ? "text" : "password"}
                                className="form-control border-0 bg-light py-3"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary border-0 bg-light"
                                onClick={() => setFormData(prev => ({ ...prev, showConfirm: !prev.showConfirm }))}
                              >
                                <i className={`bi ${formData.showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary px-4"
                            onClick={resetPasswordForm}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-warning px-4"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Updating...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-shield-check me-2"></i>
                                Update Password
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === "preferences" && (
                    <div className="animate__animated animate__fadeIn">
                      <form onSubmit={handlePreferencesSubmit}>
                        <div className="row g-4">
                          <div className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body">
                                <div className="form-check form-switch d-flex align-items-center justify-content-between">
                                  <div>
                                    <label className="form-check-label fw-semibold" htmlFor="darkMode">
                                      Dark Mode
                                    </label>
                                    <p className="text-muted mb-0 small">Switch to dark theme for better visibility at night</p>
                                  </div>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="darkMode"
                                    name="darkMode"
                                    checked={formData.darkMode}
                                    onChange={handleChange}
                                    style={{ transform: "scale(1.5)" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="card border-0 bg-light">
                              <div className="card-body">
                                <div className="form-check form-switch d-flex align-items-center justify-content-between">
                                  <div>
                                    <label className="form-check-label fw-semibold" htmlFor="emailNotifications">
                                      Email Notifications
                                    </label>
                                    <p className="text-muted mb-0 small">Receive updates and alerts via email</p>
                                  </div>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="emailNotifications"
                                    name="emailNotifications"
                                    checked={formData.emailNotifications}
                                    onChange={handleChange}
                                    style={{ transform: "scale(1.5)" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                          <button type="submit" className="btn btn-info px-4">
                            <i className="bi bi-check-circle me-2"></i>
                            Save Preferences
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <aside className="right-column">
                {/* User Profile Card */}
                <div className="widget shadow-sm rounded-3 p-3 bg-white mb-4 animate__animated animate__fadeIn">
                  <div className="widget-header mb-3">
                    <h5 className="fw-bold"><i className="bi bi-person-badge me-2 text-info"></i>Your Profile</h5>
                  </div>
                  <div className="text-center">
                    <img
                      src={user?.photoURL || "/images/default-avatar.png"}
                      alt="User Avatar"
                      className="rounded-circle shadow mb-3"
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        objectFit: "cover",
                        border: "3px solid #10b981"
                      }}
                    />
                    <h6 className="fw-bold mb-1">{user?.displayName || "User"}</h6>
                    <p className="text-muted small mb-3">{user?.email}</p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-success btn-sm">
                        <i className="bi bi-pencil me-1"></i>
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeIn">
                  <div className="widget-header mb-3">
                    <h5 className="fw-bold"><i className="bi bi-lightning me-2 text-warning"></i>Quick Actions</h5>
                  </div>
                  <div className="actions-list">
                    <button className="btn btn-outline-primary w-100 mb-2 text-start">
                      <i className="bi bi-download me-2"></i>
                      Export Data
                    </button>
                    <button className="btn btn-outline-success w-100 mb-2 text-start">
                      <i className="bi bi-shield-check me-2"></i>
                      Privacy Settings
                    </button>
                    <button className="btn btn-outline-info w-100 text-start">
                      <i className="bi bi-question-circle me-2"></i>
                      Get Help
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {showPopup && (
          <div
            className="position-fixed top-0 start-50 translate-middle-x mt-5 animate__animated animate__fadeInDown"
            style={{ zIndex: 1050 }}
          >
            <div className="alert alert-success shadow-lg border-0 d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              {popupMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;