import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    systemName: "WasteWise",
    defaultLocation: "Citywide",
    timeZone: "(UTC+08:00) Singapore Standard Time",
    emailNotifications: true,
    pushNotifications: true,
    criticalAlerts: true,
    dailySummary: false,
    lowCapacityAlerts: true,
    maintenanceAlerts: true,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "30",
    maxUsers: "100",
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordPolicy: "medium",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleSystemAction = (action) => {
    if (window.confirm(`Are you sure you want to ${action}?`)) {
      alert(`System ${action} initiated successfully!`);
    }
  };

  const systemInfo = {
    version: "2.4.1",
    lastUpdated: "May 15, 2024",
    database: { status: "Connected", class: "success" },
    api: { status: "Operational", class: "success" },
    storage: { used: "2.3GB", total: "10GB", percent: 23 },
    activeUsers: "45",
    totalBins: "127",
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <NavbarAdmin />

      {/* Main Section */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Fixed Top Navbar */}
        <div className="bg-white shadow-sm sticky-top">
          <TopNavbarAdmin />
        </div>

        {/* Grayish Background Layer */}
        <div
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#f0f2f5",
            overflow: "hidden", // only the inside scrolls
          }}
        >
          {/* White Scrollable Layer */}
          <div
            className="bg-white rounded shadow p-4"
            style={{
              height: "100%",
              overflowY: "auto", // only this scrolls
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">System Settings ⚙️</h2>
                <p className="text-muted mb-0">
                  Manage system configuration and preferences
                </p>
              </div>
              <button className="btn btn-success" onClick={handleSaveSettings}>
                <i className="bi bi-check-circle me-2"></i>Save All Changes
              </button>
            </div>

            {/* Success Alert */}
            {showSaveSuccess && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                <i className="bi bi-check-circle me-2"></i>
                Settings saved successfully!
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSaveSuccess(false)}
                ></button>
              </div>
            )}

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              {[
                { key: "general", label: "General", icon: "bi-gear" },
                { key: "notifications", label: "Notifications", icon: "bi-bell" },
                { key: "security", label: "Security", icon: "bi-shield-lock" },
                { key: "maintenance", label: "Maintenance", icon: "bi-tools" },
              ].map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <button
                    className={`nav-link ${
                      activeTab === tab.key ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    <i className={`bi ${tab.icon} me-2`}></i>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Main Settings Content */}
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-lg-8">
  <div style={{ minHeight: "500px" }}>
    {/* Common container width for all tabs */}
    <div className="mx-auto" style={{ maxWidth: "800px" }}>
      {/* General Tab */}
      {activeTab === "general" && (
        <div className="card bg-light shadow-sm border-0">
          <div className="card-header bg-white border-0">
            <h5 className="card-title mb-0">
              <i className="bi bi-building me-2"></i>General Settings
            </h5>
          </div>
          <div className="card-body">
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
                <label className="form-label">Default Location</label>
                <select
                  className="form-select"
                  value={settings.defaultLocation}
                  onChange={(e) =>
                    handleInputChange("defaultLocation", e.target.value)
                  }
                >
                  <option value="Citywide">Citywide</option>
                  <option value="North District">North District</option>
                  <option value="South District">South District</option>
                  <option value="East District">East District</option>
                  <option value="West District">West District</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Time Zone</label>
                <select
                  className="form-select"
                  value={settings.timeZone}
                  onChange={(e) =>
                    handleInputChange("timeZone", e.target.value)
                  }
                >
                  <option value="(UTC+00:00) GMT">(UTC+00:00) GMT</option>
                  <option value="(UTC+08:00) Singapore Standard Time">
                    (UTC+08:00) Singapore Standard Time
                  </option>
                  <option value="(UTC-05:00) Eastern Time">
                    (UTC-05:00) Eastern Time
                  </option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Maximum Users</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.maxUsers}
                  onChange={(e) =>
                    handleInputChange("maxUsers", e.target.value)
                  }
                />
              </div>
              <div className="col-12">
                <label className="form-label">
                  Data Retention Period (days)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings.dataRetention}
                  onChange={(e) =>
                    handleInputChange("dataRetention", e.target.value)
                  }
                />
                <small className="text-muted">
                  How long to keep system logs and historical data.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="card bg-light shadow-sm border-0">
          <div className="card-header bg-white border-0">
            <h5 className="card-title mb-0">
              <i className="bi bi-bell me-2"></i>Notification Preferences
            </h5>
          </div>
          <div className="card-body">
            <div className="mx-auto" style={{ maxWidth: "600px" }}>
              {[
                "emailNotifications",
                "pushNotifications",
                "criticalAlerts",
                "lowCapacityAlerts",
                "maintenanceAlerts",
                "dailySummary",
              ].map((key) => (
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
            </div>
          </div>
        </div>
      )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="card bg-light shadow-sm border-0">
                      <div className="card-header bg-white border-0">
                        <h5 className="card-title mb-0">
                          <i className="bi bi-shield-lock me-2"></i>Security Settings
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) =>
                              handleInputChange("twoFactorAuth", e.target.checked)
                            }
                          />
                          <label className="form-check-label">
                            Two-Factor Authentication (2FA)
                          </label>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Session Timeout</label>
                            <select
                              className="form-select"
                              value={settings.sessionTimeout}
                              onChange={(e) =>
                                handleInputChange("sessionTimeout", e.target.value)
                              }
                            >
                              <option value="15">15 mins</option>
                              <option value="30">30 mins</option>
                              <option value="60">1 hour</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Password Policy</label>
                            <select
                              className="form-select"
                              value={settings.passwordPolicy}
                              onChange={(e) =>
                                handleInputChange("passwordPolicy", e.target.value)
                              }
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Maintenance Tab */}
                  {activeTab === "maintenance" && (
                    <div className="card bg-light shadow-sm border-0">
                      <div className="card-header bg-white border-0">
                        <h5 className="card-title mb-0">
                          <i className="bi bi-tools me-2"></i>System Maintenance
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="d-grid gap-2">
                          {[
                            { action: "clear cache", label: "Clear Cache", icon: "trash" },
                            { action: "backup database", label: "Backup Database", icon: "download" },
                            { action: "restart system", label: "Restart System", icon: "arrow-clockwise" },
                          ].map((item) => (
                            <button
                              key={item.action}
                              className="btn btn-outline-secondary"
                              onClick={() => handleSystemAction(item.action)}
                            >
                              <i className={`bi bi-${item.icon} me-2`}></i>
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                {/* System Info */}
                <div className="card bg-light shadow-sm border-0 mb-4">
                  <div className="card-header bg-white border-0">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-info-circle me-2"></i>System Info
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li><strong>Version:</strong> {systemInfo.version}</li>
                      <li><strong>Last Updated:</strong> {systemInfo.lastUpdated}</li>
                      <li>
                        <strong>Database:</strong>{" "}
                        <span className={`badge bg-${systemInfo.database.class}`}>
                          {systemInfo.database.status}
                        </span>
                      </li>
                      <li>
                        <strong>API:</strong>{" "}
                        <span className={`badge bg-${systemInfo.api.class}`}>
                          {systemInfo.api.status}
                        </span>
                      </li>
                      <li>
                        <strong>Storage:</strong> {systemInfo.storage.used} / {systemInfo.storage.total}
                        <div className="progress mt-1" style={{ height: "6px" }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${systemInfo.storage.percent}%` }}
                          ></div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card bg-light shadow-sm border-0">
                  <div className="card-header bg-white border-0">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-lightning me-2"></i>Quick Actions
                    </h5>
                  </div>
                  <div className="card-body d-grid gap-2">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-people me-2"></i>Manage Users
                    </button>
                    <button className="btn btn-outline-success">
                      <i className="bi bi-graph-up me-2"></i>View Analytics
                    </button>
                    <button className="btn btn-outline-info">
                      <i className="bi bi-question-circle me-2"></i>System Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminSettings;
