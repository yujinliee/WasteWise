import React, { useState } from "react";
import "../styles/UserSettings.css";
import NavbarUser from "../Components/NavbarUser"; // Adjust path as needed

function UserSettings() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState("profile");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
    // Add your profile update logic here
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password updated");
    // Add your password update logic here
  };

  return (
    <div className="usersettings-container">
      <NavbarUser />
      
      <div className="usersettings-content">
        <div className="settings-header">
          <h1>Account Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="settings-section">
            <form onSubmit={handleProfileSubmit} className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="settings-section">
            <form onSubmit={handlePasswordSubmit} className="settings-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
                <small className="form-hint">
                  Password must be at least 8 characters long
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;