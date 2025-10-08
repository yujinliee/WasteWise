import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "WasteWise",
    defaultLocation: "Citywide",
    timeZone: "(UTC+08:00) Singapore Standard Time",
    
    // Notification Preferences
    emailNotifications: true,
    pushNotifications: true,
    criticalAlerts: true,
    dailySummary: false,
    lowCapacityAlerts: true,
    maintenanceAlerts: true,
    
    // System Preferences
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "30",
    maxUsers: "100",
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordPolicy: "medium"
  });

  const [activeTab, setActiveTab] = useState("general");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = () => {
    // Simulate API call to save settings
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
    totalBins: "127"
  };

  return (
    <div className="d-flex">
      <NavbarAdmin />

      {/* Main Content */}
      <div 
        className="flex-grow-1 p-4 bg-light" 
        style={{ 
          marginLeft: "250px",
          minHeight: "100vh",
          width: "calc(100% - 250px)"
        }}
      >
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex justify-content-between text-start mb-4">
            <div>
              <h1 className="h2 fw-bold text-dark">⚙️ System Settings</h1>
              <p className="text-muted mb-0">Manage system configuration and preferences</p>
            </div>
            <button 
              className="btn btn-success"
              onClick={handleSaveSettings}
            >
              <i className="bi bi-check-circle me-2"></i>
              Save All Changes
            </button>
          </div>

          {/* Success Alert */}
          {showSaveSuccess && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
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
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                <i className="bi bi-gear me-2"></i>
                General
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <i className="bi bi-bell me-2"></i>
                Notifications
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <i className="bi bi-shield-lock me-2"></i>
                Security
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "maintenance" ? "active" : ""}`}
                onClick={() => setActiveTab("maintenance")}
              >
                <i className="bi bi-tools me-2"></i>
                Maintenance
              </button>
            </li>
          </ul>

          <div className="row g-4">
            {/* Left Column */}
            <div className="col-lg-8">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-building me-2"></i>
                      General Settings
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
                          onChange={(e) => handleInputChange("systemName", e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Default Location Scope</label>
                        <select
                          className="form-select"
                          value={settings.defaultLocation}
                          onChange={(e) => handleInputChange("defaultLocation", e.target.value)}
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
                          onChange={(e) => handleInputChange("timeZone", e.target.value)}
                        >
                          <option value="(UTC+00:00) GMT">(UTC+00:00) GMT</option>
                          <option value="(UTC+08:00) Singapore Standard Time">(UTC+08:00) Singapore Standard Time</option>
                          <option value="(UTC-05:00) Eastern Time">(UTC-05:00) Eastern Time</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Maximum Users</label>
                        <input
                          type="number"
                          className="form-control"
                          value={settings.maxUsers}
                          onChange={(e) => handleInputChange("maxUsers", e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Data Retention Period (days)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={settings.dataRetention}
                          onChange={(e) => handleInputChange("dataRetention", e.target.value)}
                        />
                        <small className="text-muted">How long to keep system logs and historical data</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-bell me-2"></i>
                      Notification Preferences
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                          />
                          <label className="form-check-label">Email Notifications</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={(e) => handleInputChange("pushNotifications", e.target.checked)}
                          />
                          <label className="form-check-label">Push Notifications</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.criticalAlerts}
                            onChange={(e) => handleInputChange("criticalAlerts", e.target.checked)}
                          />
                          <label className="form-check-label">Critical Alerts (Bin Full, System Errors)</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.lowCapacityAlerts}
                            onChange={(e) => handleInputChange("lowCapacityAlerts", e.target.checked)}
                          />
                          <label className="form-check-label">Low Capacity Warnings</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.maintenanceAlerts}
                            onChange={(e) => handleInputChange("maintenanceAlerts", e.target.checked)}
                          />
                          <label className="form-check-label">Maintenance Schedule Alerts</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.dailySummary}
                            onChange={(e) => handleInputChange("dailySummary", e.target.checked)}
                          />
                          <label className="form-check-label">Daily Summary Report</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-shield-lock me-2"></i>
                      Security Settings
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleInputChange("twoFactorAuth", e.target.checked)}
                          />
                          <label className="form-check-label">Two-Factor Authentication (2FA)</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Session Timeout (minutes)</label>
                        <select
                          className="form-select"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Password Policy</label>
                        <select
                          className="form-select"
                          value={settings.passwordPolicy}
                          onChange={(e) => handleInputChange("passwordPolicy", e.target.value)}
                        >
                          <option value="low">Low (6+ characters)</option>
                          <option value="medium">Medium (8+ characters, mixed case)</option>
                          <option value="high">High (10+ characters, mixed case + numbers + symbols)</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={settings.autoBackup}
                            onChange={(e) => handleInputChange("autoBackup", e.target.checked)}
                          />
                          <label className="form-check-label">Automatic Backup</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Backup Frequency</label>
                        <select
                          className="form-select"
                          value={settings.backupFrequency}
                          onChange={(e) => handleInputChange("backupFrequency", e.target.value)}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Maintenance Settings */}
              {activeTab === "maintenance" && (
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-tools me-2"></i>
                      System Maintenance
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <button 
                          className="btn btn-outline-secondary w-100"
                          onClick={() => handleSystemAction("clear cache")}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Clear Cache
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button 
                          className="btn btn-outline-primary w-100"
                          onClick={() => handleSystemAction("backup database")}
                        >
                          <i className="bi bi-download me-2"></i>
                          Backup Database
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button 
                          className="btn btn-outline-warning w-100"
                          onClick={() => handleSystemAction("schedule maintenance")}
                        >
                          <i className="bi bi-calendar me-2"></i>
                          Schedule Maintenance
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button 
                          className="btn btn-outline-danger w-100"
                          onClick={() => handleSystemAction("restart system")}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Restart System
                        </button>
                      </div>
                      <div className="col-12">
                        <div className="mt-4">
                          <h6>System Logs</h6>
                          <button className="btn btn-outline-info me-2">
                            <i className="bi bi-download me-2"></i>
                            Export Logs
                          </button>
                          <button className="btn btn-outline-dark">
                            <i className="bi bi-eye me-2"></i>
                            View Logs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - System Info */}
            <div className="col-lg-4">
              {/* System Information */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    System Information
                  </h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                      <strong>Version:</strong> {systemInfo.version}
                    </li>
                    <li className="mb-2">
                      <strong>Last Updated:</strong> {systemInfo.lastUpdated}
                    </li>
                    <li className="mb-2">
                      <strong>Database:</strong>{" "}
                      <span className={`badge bg-${systemInfo.database.class}`}>
                        {systemInfo.database.status}
                      </span>
                    </li>
                    <li className="mb-2">
                      <strong>API Status:</strong>{" "}
                      <span className={`badge bg-${systemInfo.api.class}`}>
                        {systemInfo.api.status}
                      </span>
                    </li>
                    <li className="mb-2">
                      <strong>Storage:</strong> {systemInfo.storage.used} / {systemInfo.storage.total}
                      <div className="progress mt-1" style={{ height: "6px" }}>
                        <div 
                          className="progress-bar" 
                          style={{ width: `${systemInfo.storage.percent}%` }}
                        ></div>
                      </div>
                    </li>
                    <li className="mb-2">
                      <strong>Active Users:</strong> {systemInfo.activeUsers}
                    </li>
                    <li>
                      <strong>Total Bins:</strong> {systemInfo.totalBins}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-lightning me-2"></i>
                    Quick Actions
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-people me-2"></i>
                      Manage Users
                    </button>
                    <button className="btn btn-outline-success">
                      <i className="bi bi-graph-up me-2"></i>
                      View Analytics
                    </button>
                    <button className="btn btn-outline-info">
                      <i className="bi bi-question-circle me-2"></i>
                      System Help
                    </button>
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