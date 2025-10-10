import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import { useUser } from "../Components/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const AdminDashboard = () => {
  const { user } = useUser();
  const [showReportModal, setShowReportModal] = useState(false);

  const binOverview = [
    { id: 1, location: "Main Building A", status: "Available", fill: 20 },
    { id: 2, location: "Library Entrance", status: "Half Full", fill: 65 },
    { id: 3, location: "Cafeteria", status: "Nearly Full", fill: 85 },
  ];

  const reports = [
    { id: 1, issue: "Bin overflow detected", reporter: "User123", time: "1h ago" },
    { id: 2, issue: "Sensor malfunction - Cafeteria", reporter: "System", time: "3h ago" },
    { id: 3, issue: "Late waste pickup", reporter: "User567", time: "1d ago" },
  ];

  const activityLogs = [
    { date: "Oct 8", action: "Added new bin", details: "Near Science Building" },
    { date: "Oct 7", action: "Resolved report", details: "Bin overflow - Cafeteria" },
    { date: "Oct 6", action: "Viewed analytics dashboard", details: "Monthly overview" },
  ];

  const getFillWidth = (fill) => `${Math.min(Math.max(fill, 0), 100)}%`;

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

        {/* Grayish Background (Static Layer) */}
        <div
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#f0f2f5",
            overflow: "hidden", // prevents background scroll
          }}
        >
          {/* Scrollable White Content */}
          <div
            className="bg-white rounded shadow p-4"
            style={{
              height: "100%",
              overflowY: "auto", // only this part scrolls
            }}
          >
            {/* Welcome Section */}
            <div className="mb-4">
              <h2 className="mb-1">
                Welcome back, Admin 👋
              </h2>
              <p className="text-muted mb-0">
                Here's the latest overview of your waste management system.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="bg-light rounded p-3 shadow-sm">
                  <h6 className="text-uppercase text-muted mb-1">Total Bins</h6>
                  <h3 className="fw-bold text-success">{binOverview.length}</h3>
                  <p className="mb-0 text-muted small">Monitored across all zones</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-light rounded p-3 shadow-sm">
                  <h6 className="text-uppercase text-muted mb-1">Active Reports</h6>
                  <h3 className="fw-bold text-danger">{reports.length}</h3>
                  <p className="mb-0 text-muted small">Issues needing attention</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-light rounded p-3 shadow-sm">
                  <h6 className="text-uppercase text-muted mb-1">Collections Today</h6>
                  <h3 className="fw-bold text-primary">5</h3>
                  <p className="mb-0 text-muted small">Scheduled collections</p>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-lg-8">
                {/* Bin Overview */}
                <div className="bg-light rounded p-3 shadow-sm mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Bin Overview</h5>
                    <small className="text-muted">Updated 5 mins ago</small>
                  </div>

                  {binOverview.map((bin) => (
                    <div
                      key={bin.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-2"
                    >
                      <div>
                        <strong>{bin.location}</strong>
                        <div className="text-muted small">{bin.status}</div>
                      </div>
                      <div className="flex-grow-1 mx-3">
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar ${
                              bin.fill >= 85
                                ? "bg-danger"
                                : bin.fill >= 50
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                            style={{ width: getFillWidth(bin.fill) }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-muted small">{bin.fill}%</div>
                    </div>
                  ))}
                </div>

                {/* Reports */}
                <div className="bg-light rounded p-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Reports</h5>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => setShowReportModal(true)}
                    >
                      View All
                    </button>
                  </div>
                  {reports.map((rep) => (
                    <div
                      key={rep.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-2"
                    >
                      <div>
                        <strong>{rep.issue}</strong>
                        <div className="text-muted small">
                          Reported by {rep.reporter}
                        </div>
                      </div>
                      <div className="text-muted small">{rep.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                <div className="bg-light rounded p-3 shadow-sm mb-4">
                  <h5 className="mb-3">Activity Logs</h5>
                  {activityLogs.map((log, i) => (
                    <div key={i} className="border-bottom pb-2 mb-2">
                      <div className="fw-bold">{log.action}</div>
                      <div className="text-muted small">{log.details}</div>
                      <div className="text-muted small">{log.date}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-light rounded p-3 shadow-sm">
                  <h5 className="mb-3">Admin Notes</h5>
                  <p className="text-muted small mb-0">
                    - Monitor bin fill levels daily. <br />
                    - Check pending reports before 5 PM. <br />
                    - Coordinate with collectors for overflow issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
              <h5>All Reports</h5>
              <ul className="list-group mt-3">
                {reports.map((r) => (
                  <li key={r.id} className="list-group-item">
                    <strong>{r.issue}</strong>
                    <div className="text-muted small">{r.reporter}</div>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setShowReportModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
