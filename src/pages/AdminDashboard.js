import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import { useUser } from "../Components/UserContext";
import { db } from "../Components/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [bins, setBins] = useState([]);

  // 🔥 Fetch bins in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bins"), (snapshot) => {
      const binData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBins(binData);
    });
    return unsubscribe;
  }, []);

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
  const getFillColor = (fill) => {
    if (fill >= 85) return "bg-danger";
    if (fill >= 50) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <NavbarAdmin />

      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarAdmin />

        <div className="flex-grow-1 p-4 overflow-auto">
          <div className="container-fluid">
            {/* WELCOME SECTION */}
            <div
              className="d-flex align-items-center justify-content-between rounded-4 shadow-sm text-white text-start p-4 mb-4 animate__animated animate__fadeInDown"
              style={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                minHeight: "180px",
              }}
            >
              <div>
                <h2 className="fw-bold mb-1">Welcome back, Administrator 👋</h2>
                <p className="text-light mb-0">
                  Oversee bins, manage reports, and keep the campus running smoothly.
                </p>
              </div>
              <img
                src={require("../assets/welcome widget1 (1).png")}
                alt="Admin Illustration"
                className="img-fluid"
                style={{ height: "160px" }}
              />
            </div>

            {/* KPI CARDS */}
            <div className="row g-4 mb-4 text-start">
              {[
                {
                  title: "Total Bins",
                  value: bins.length,
                  desc: "Bins currently monitored across campus.",
                  icon: "bi-hdd-network",
                  gradient: "linear-gradient(135deg, #10b981, #059669)",
                },
                {
                  title: "Active Reports",
                  value: reports.length,
                  desc: "Issues reported by users or system alerts.",
                  icon: "bi-flag",
                  gradient: "linear-gradient(135deg, #ef4444, #b91c1c)",
                },
                {
                  title: "Collections Today",
                  value: 5,
                  desc: "Scheduled waste collections today.",
                  icon: "bi-truck",
                  gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                },
              ].map((card, i) => (
                <div key={i} className="col-md-4">
                  <div
                    className="p-4 rounded-4 shadow-sm text-white animate__animated animate__fadeInUp floating-card"
                    style={{
                      background: card.gradient,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0">
                        <i className={`bi ${card.icon} me-2`}></i>
                        {card.title}
                      </h5>
                      <span className="fs-3 fw-bold">{card.value}</span>
                    </div>
                    <p className="text-light small mb-0">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* DASHBOARD GRID */}
            <div className="row g-4">
              {/* LEFT COLUMN */}
              <div className="col-lg-8">
                {/* BIN OVERVIEW */}
<div className="card border-0 shadow-sm rounded-4 p-4 animate__animated animate__fadeIn hover-border-line mb-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="fw-bold text-primary mb-0">
      <i className="bi bi-trash me-2"></i>Bin Overview
    </h5>
    <button
      className="btn btn-sm btn-outline-primary"
      onClick={() => navigate("/admin/bins")}
    >
      View All
    </button>
  </div>

  {bins.length > 0 ? (
    bins.slice(0, 5).map((bin, i) => ( // ← Show only first 5 bins
      <div
        key={bin.id}
        className={`d-flex align-items-center py-3 ${
          i !== Math.min(bins.length, 5) - 1 ? "border-bottom" : ""
        }`}
      >
        <div style={{ flex: 1 }}>
          <strong>{bin.name}</strong>
          <div className="text-muted small">{bin.location}</div>
        </div>

        <div className="flex-grow-1 mx-3" style={{ minWidth: "150px" }}>
          <div className="progress" style={{ height: "8px" }}>
            <div
              className={`progress-bar ${getFillColor(
                bin.fill ?? (bin.isFull ? 100 : 0)
              )}`}
              style={{
                width: getFillWidth(bin.fill ?? (bin.isFull ? 100 : 0)),
              }}
            ></div>
          </div>
        </div>

        <span
          className="small fw-semibold text-muted"
          style={{ width: "40px", textAlign: "right" }}
        >
          {bin.fill ?? (bin.isFull ? 100 : 0)}%
        </span>
      </div>
    ))
  ) : (
    <div className="text-center py-5 text-muted">
      <i className="bi bi-inbox display-5 mb-2"></i>
      <p>No bins found.</p>
    </div>
  )}
</div>

                {/* REPORTS */}
                <div className="card border-0 shadow-sm rounded-4 p-4 animate__animated animate__fadeIn hover-border-line">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-danger mb-0">
                      <i className="bi bi-exclamation-circle me-2"></i>Recent Reports
                    </h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowReportModal(true)}
                    >
                      View All
                    </button>
                  </div>
                  {reports.map((rep, i) => (
                    <div
                      key={rep.id}
                      className={`d-flex justify-content-between align-items-center text-start py-3 ${
                        i !== reports.length - 1 ? "border-bottom" : ""
                      }`}
                    >
                      <div>
                        <strong>{rep.issue}</strong>
                        <div className="text-muted small">Reported by {rep.reporter}</div>
                      </div>
                      <div className="text-muted small">{rep.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 animate__animated animate__fadeIn hover-border-line">
                  <h5 className="fw-bold text-secondary mb-3">
                    <i className="bi bi-clock-history me-2"></i>Activity Logs
                  </h5>
                  {activityLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`pb-3 ${
                        i !== activityLogs.length - 1 ? "border-bottom mb-3" : ""
                      }`}
                    >
                      <div className="fw-semibold">{log.action}</div>
                      <div className="text-muted small">{log.details}</div>
                      <div className="text-muted small">{log.date}</div>
                    </div>
                  ))}
                </div>

                <div className="card border-0 shadow-sm rounded-4 p-4 animate__animated animate__fadeIn hover-border-line">
                  <h5 className="fw-bold text-info mb-3">
                    <i className="bi bi-journal-check me-2"></i>Administrator Notes
                  </h5>
                  <p className="text-muted small mb-0">
                    - Check daily bin reports <br />
                    - Review system alerts <br />
                    - Coordinate with collectors for overflow issues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REPORT MODAL */}
        {showReportModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
            <div className="bg-white p-4 rounded-4 shadow" style={{ width: "420px" }}>
              <h5 className="fw-bold mb-3">All Reports</h5>
              <ul className="list-group mb-3">
                {reports.map((r) => (
                  <li key={r.id} className="list-group-item">
                    <strong>{r.issue}</strong>
                    <div className="text-muted small">{r.reporter}</div>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-outline-secondary w-100"
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
