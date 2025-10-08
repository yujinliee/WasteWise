import React, { useEffect, useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import { auth } from "../Components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const binReports = [
    { id: 1, location: "Main Building A", status: "Full", lastEmptied: "2025-09-20" },
    { id: 2, location: "Library Entrance", status: "Half Full", lastEmptied: "2025-09-19" },
    { id: 3, location: "Cafeteria", status: "Nearly Full", lastEmptied: "2025-09-22" },
  ];

  const userReports = [
    { id: 1, name: "Eugene", action: "Reported full bin", date: "2025-09-21" },
    { id: 2, name: "Liza", action: "Requested new recycling bin", date: "2025-09-20" },
    { id: 3, name: "Marco", action: "Flagged overflowing waste", date: "2025-09-18" },
  ];

  return (
    <div className="d-flex">
      <NavbarAdmin />

      {/* Main content with left margin */}
      <div 
        className="flex-grow-1 p-4 bg-light" 
        style={{ 
          minHeight: "100vh",
          marginLeft: "250px", 
          width: "calc(100% - 250px)" 
        }}
      >
        <div className="container-fluid"> {/* Changed to container-fluid for better width management */}
          {/* Welcome Section */}
          <div className="mb-4 text-start">
            <h2 className="fw-bold">Admin Dashboard 👑</h2>
            <p className="text-muted">Welcome, {user?.email || "Admin"}!</p>
          </div>

          <div className="row g-4">
            {/* Left Column */}
            <div className="col-md-6">
              {/* Bin Reports */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">
                  🗑️ Bin Reports
                </div>
                <div className="card-body">
                  {binReports.map((bin) => (
                    <div key={bin.id} className="mb-3 border-bottom pb-2">
                      <h6 className="mb-1">{bin.location}</h6>
                      <p className="mb-0 text-muted">Status: {bin.status}</p>
                      <small className="text-muted">Last Emptied: {bin.lastEmptied}</small>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Reports */}
              <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold">
                  📋 User Reports
                </div>
                <div className="card-body">
                  {userReports.map((report) => (
                    <div key={report.id} className="mb-3 border-bottom pb-2">
                      <p className="mb-1">
                        <strong>{report.name}</strong> - {report.action}
                      </p>
                      <small className="text-muted">{report.date}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              {/* Admin Actions */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white fw-bold">
                  ⚙️ Admin Actions
                </div>
                <div className="card-body d-grid gap-2">
                  <button className="btn btn-outline-success">➕ Add New Bin</button>
                  <button className="btn btn-outline-danger">🗑️ Remove Bin</button>
                  <button className="btn btn-outline-primary">📢 Send Notification</button>
                  <button className="btn btn-outline-dark">👥 Manage Users</button>
                </div>
              </div>

              {/* System Overview */}
              <div className="card shadow-sm">
                <div className="card-header bg-white fw-bold">
                  📊 System Overview
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li><strong>Total Users:</strong> 120</li>
                    <li><strong>Total Bins:</strong> 45</li>
                    <li><strong>Active Alerts:</strong> 3</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;