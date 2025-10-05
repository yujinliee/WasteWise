import React, { useEffect, useState } from 'react';
import "../styles/UserDashboard.css"; // you can reuse or create AdminDashboard.css
import NavbarAdmin from "../Components/NavbarAdmin";
import { auth } from "../Components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Example: Admin-focused data
  const binReports = [
    { id: 1, location: "Main Building A", status: "Full", lastEmptied: "2025-09-20" },
    { id: 2, location: "Library Entrance", status: "Half Full", lastEmptied: "2025-09-19" },
    { id: 3, location: "Cafeteria", status: "Nearly Full", lastEmptied: "2025-09-22" }
  ];

  const userReports = [
    { id: 1, name: "Eugene", action: "Reported full bin", date: "2025-09-21" },
    { id: 2, name: "Liza", action: "Requested new recycling bin", date: "2025-09-20" },
    { id: 3, name: "Marco", action: "Flagged overflowing waste", date: "2025-09-18" }
  ];

  return (
    <div className="dashboard-container">
      <NavbarAdmin />

      {/* Main Content */}
      <div className="main-content">
        <div className="welcome-section">
          <h1>Admin Dashboard 👑</h1>
          <p>Welcome, {user?.email || "Admin"}!</p>
        </div>

        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Bin Reports */}
            <div className="widget">
              <div className="widget-header">
                <h2>Bin Reports</h2> 🗑️
              </div>
              <div className="bin-list">
                {binReports.map((bin) => (
                  <div key={bin.id} className="bin-item">
                    <div className="bin-info">
                      <div className="bin-location">{bin.location}</div>
                      <div className="bin-status">Status: {bin.status}</div>
                      <div className="bin-last">Last Emptied: {bin.lastEmptied}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Reports */}
            <div className="widget">
              <div className="widget-header">
                <h2>User Reports</h2> 📋
              </div>
              <div className="report-list">
                {userReports.map((report) => (
                  <div key={report.id} className="report-item">
                    <p><strong>{report.name}</strong> - {report.action}</p>
                    <span>{report.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Admin Actions */}
            <div className="widget">
              <div className="widget-header">
                <h2>Admin Actions</h2> ⚙️
              </div>
              <div className="actions-list">
                <button className="action-btn">➕ Add New Bin</button>
                <button className="action-btn">🗑️ Remove Bin</button>
                <button className="action-btn">📢 Send Notification</button>
                <button className="action-btn">👥 Manage Users</button>
              </div>
            </div>

            {/* System Overview */}
            <div className="widget">
              <div className="widget-header">
                <h2>System Overview</h2> 📊
              </div>
              <ul>
                <li>Total Users: 120</li>
                <li>Total Bins: 45</li>
                <li>Active Alerts: 3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
