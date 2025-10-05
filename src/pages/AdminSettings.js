import React from "react";
import "../styles/AdminSettings.css";
import NavbarAdmin from "../Components/NavbarAdmin"; 

const AdminSettings = () => {
  return (
    <div className="admin-settings">
      {/* Sidebar */}
      <NavbarAdmin />

      {/* Main Content */}
      <main className="settings-content">
        <header className="settings-header">
          <h2>⚙️ System Settings</h2>
          <input
            type="text"
            placeholder="Search settings..."
            className="search-bar"
          />
        </header>

        <div className="settings-grid">
          {/* General Settings */}
          <section className="card wide">
            <h3>General Settings</h3>
            <div className="form-group">
              <label>System Name</label>
              <input type="text" defaultValue="WasteWise" />
            </div>
            <div className="form-group">
              <label>Default Location</label>
              <select>
                <option>Citywide</option>
                <option>North District</option>
                <option>South District</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select defaultValue="(UTC+08:00) Singapore Standard Time">
                <option>(UTC+00:00) GMT</option>
                <option>(UTC+08:00) Singapore Standard Time</option>
                <option>(UTC-05:00) Eastern Time</option>
              </select>
            </div>
            <button className="primary-btn">💾 Save Changes</button>
          </section>

          {/* System Info */}
          <section className="card">
            <h3>System Information</h3>
            <ul>
              <li><strong>Version:</strong> 2.4.1</li>
              <li><strong>Last Updated:</strong> May 15, 2023</li>
              <li><strong>Database:</strong> <span className="status ok">Connected</span></li>
              <li><strong>API:</strong> <span className="status ok">Operational</span></li>
            </ul>
            <button className="secondary-btn">📤 Export Logs</button>
          </section>

          {/* Notifications */}
          <section className="card wide">
            <h3>Notification Preferences</h3>
            <div className="toggle">
              <label>Email Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="toggle">
              <label>Push Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="toggle">
              <label>Critical Alerts</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="toggle">
              <label>Daily Summary</label>
              <input type="checkbox" />
            </div>
          </section>

          {/* Maintenance */}
          <section className="card">
            <h3>System Maintenance</h3>
            <div className="actions">
              <button className="action-btn">🗑 Clear Cache</button>
              <button className="action-btn blue">💾 Backup Database</button>
              <button className="action-btn yellow">🛠 Schedule Maintenance</button>
              <button className="action-btn red">🔄 Restart System</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
