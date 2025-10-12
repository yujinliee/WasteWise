import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import { auth } from "../Components/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    systemName: "Smart Waste Management",
    cityName: "Quezon City",
    collectionSchedule: "06:00 AM - 06:00 PM",
    sensorInterval: "30",
    dataRetention: "90",
    enableRecyclable: true,
    enableBiodegradable: true,
    enableHazardous: false,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [activeTab, setActiveTab] = useState("general");
  const [showPopup, setShowPopup] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleSavePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("⚠️ Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("❌ New password and confirm password do not match!");
      return;
    }
    console.log("Password updated successfully!");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const tabConfig = [
    { key: "general", label: "General", icon: "bi-gear", color: "success" },
    { key: "notifications", label: "Notifications", icon: "bi-bell", color: "info" },
    { key: "security", label: "Security", icon: "bi-shield-lock", color: "warning" },
  ];

  const getActiveIcon = () => {
    const active = tabConfig.find((t) => t.key === activeTab);
    return `${active.icon} text-${active.color}`;
  };

  return (
    <div className="d-flex bg-light" style={{ height: "100vh", overflow: "hidden" }}>
      <NavbarAdmin />

      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarAdmin />

        {/* Main Section */}
        <div className="flex-grow-1 p-4" style={{ overflow: "hidden" }}>
          <div className="container-fluid h-100 d-flex flex-column">
            {/* Header */}
            <div className="row mb-3 animate__animated animate__fadeInDown">
              <div className="col-12">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-3">
                    <i className="bi bi-gear-wide-connected fs-1 text-success"></i>
                  </div>
                  <div>
                    <h1 className="fw-bold mb-1">Administrator Settings</h1>
                    <p className="text-muted mb-0">
                      Configure system preferences and controls
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="row flex-grow-1">
              {/* Sidebar */}
              <div className="col-lg-3 d-flex flex-column">
                <div
                  className="card border-0 shadow-sm rounded-3 animate__animated animate__fadeInLeft"
                  style={{ flex: 1 }}
                >
                  <div className="card-body d-flex flex-column p-3">
                    <h6 className="fw-bold text-muted mb-3">SYSTEM TABS</h6>

                    <div className="nav flex-column">
                      {tabConfig.map((tab, index) => (
                        <button
                          key={tab.key}
                          className={`nav-link text-start d-flex align-items-center gap-3 p-3 mb-2 rounded-3 border-0 ${
                            activeTab === tab.key
                              ? `bg-${tab.color} bg-opacity-10 text-${tab.color} border-start border-3 border-${tab.color}`
                              : "text-muted"
                          } animate__animated animate__fadeIn`}
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            transition: "all 0.3s ease",
                          }}
                          onClick={() => setActiveTab(tab.key)}
                        >
                          <i className={`bi ${tab.icon} fs-5`}></i>
                          <span className="fw-semibold">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="col-lg-9 d-flex align-items-stretch">
                <div className="card border-0 shadow-sm rounded-3 w-100 animate__animated animate__fadeInRight">
                  <div className="card-body p-4">
                    {/* Tab Header */}
                    <div className="mb-4 animate__animated animate__fadeInDown">
                      <h4 className="fw-bold mb-2">
                        <i className={`bi ${getActiveIcon()} me-2`}></i>
                        {tabConfig.find((tab) => tab.key === activeTab)?.label}
                      </h4>
                      <p className="text-muted mb-0">
                        {activeTab === "general" &&
                          "Manage core settings for your Smart Waste Management system."}
                        {activeTab === "notifications" &&
                          "Adjust system alerts and notification preferences."}
                        {activeTab === "security" &&
                          "Update your admin password to keep your account secure."}
                      </p>
                    </div>

                    {/* 🧩 General Tab */}
                    {activeTab === "general" && (
                      <div className="animate__animated animate__fadeIn">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">System Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={settings.systemName}
                              onChange={(e) =>
                                handleInputChange("systemName", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">University Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={settings.cityName}
                              onChange={(e) =>
                                handleInputChange("cityName", e.target.value)
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Collection Schedule</label>
                            <input
                              type="text"
                              className="form-control"
                              value={settings.collectionSchedule}
                              onChange={(e) =>
                                handleInputChange("collectionSchedule", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-4 text-end">
                          <button
                            className="btn btn-success px-4"
                            onClick={handleSaveSettings}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 🔔 Notifications Tab */}
                    {activeTab === "notifications" && (
                      <div className="animate__animated animate__fadeIn">
                        {["emailNotifications", "pushNotifications"].map((key) => (
                          <div className="form-check form-switch mb-2" key={key}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={settings[key]}
                              onChange={(e) =>
                                handleInputChange(key, e.target.checked)
                              }
                            />
                            <label className="form-check-label text-capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </label>
                          </div>
                        ))}
                        <div className="mt-4 text-end">
                          <button
                            className="btn btn-info text-white px-4"
                            onClick={handleSaveSettings}
                          >
                            Save Preferences
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 🔐 Security Tab */}
{activeTab === "security" && (
  <div className="animate__animated animate__fadeIn">
    <div className="row g-3">
      <div className="col-md-12">
        <label className="form-label">Current Password</label>
        <input
          type="password"
          className="form-control"
          value={passwords.currentPassword}
          onChange={(e) =>
            handlePasswordChange("currentPassword", e.target.value)
          }
          placeholder="Enter current password"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">New Password</label>
        <input
          type="password"
          className="form-control"
          value={passwords.newPassword}
          onChange={(e) =>
            handlePasswordChange("newPassword", e.target.value)
          }
          placeholder="Enter new password"
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          value={passwords.confirmPassword}
          onChange={(e) =>
            handlePasswordChange("confirmPassword", e.target.value)
          }
          placeholder="Confirm new password"
        />
      </div>
    </div>

    <div className="mt-4 text-end">
      <button
        className="btn btn-warning px-4"
        onClick={async () => {
          const { currentPassword, newPassword, confirmPassword } = passwords;
          const user = auth.currentUser;

          if (!currentPassword || !newPassword || !confirmPassword) {
            alert("⚠️ Please fill out all fields.");
            return;
          }
          if (newPassword !== confirmPassword) {
            alert("❌ New password and confirm password do not match!");
            return;
          }

          try {
            // Reauthenticate before password change
            const cred = EmailAuthProvider.credential(
              user.email,
              currentPassword
            );
            await reauthenticateWithCredential(user, cred);

            // Update the password
            await updatePassword(user, newPassword);

            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
          } catch (error) {
            console.error(error);
            if (error.code === "auth/wrong-password") {
              alert("❌ Incorrect current password.");
            } else if (error.code === "auth/weak-password") {
              alert("⚠️ Password should be at least 6 characters.");
            } else {
              alert(`⚠️ ${error.message}`);
            }
          }
        }}
      >
        Update Password
      </button>
    </div>
  </div>
)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Popup Notification */}
        {showPopup && (
          <div
            className="position-fixed top-0 start-50 translate-middle-x mt-5 animate__animated animate__fadeInDown"
            style={{ zIndex: 1050 }}
          >
            <div className="alert alert-success shadow-lg border-0 d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              Action completed successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
