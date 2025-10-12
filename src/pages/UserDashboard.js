import React, { useState, useEffect } from "react";
import NavbarUser from "../Components/NavbarUser";
import TopNavbarUser from "../Components/TopNavbarUser";
import { useUser } from "../Components/UserContext";
import { db } from "../Components/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const { user } = useUser();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // 🔥 Fetch bins (real-time)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "bins"), (snapshot) => {
      const binData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBins(binData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 🔥 Fetch notifications (real-time)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const notifData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      notifData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(notifData);
    });
    return unsubscribe;
  }, []);

  // 💡 Utility functions
  const getFillWidth = (fill) => `${Math.min(Math.max(fill, 0), 100)}%`;
  const getFillColor = (fill) => {
    if (fill >= 85) return "#dc3545";
    if (fill >= 50) return "#ffc107";
    return "#198754";
  };

  const getBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case "system": return "secondary";
      case "policy": return "info";
      case "event": return "success";
      case "urgent": return "danger";
      case "general": return "warning";
      default: return "dark";
    }
  };

  // 🌱 Data Samples
  const ecoTips = [
    "Reduce paper waste by going digital whenever possible.",
    "Bring your own reusable water bottle to campus.",
    "Properly sort recyclables to improve processing efficiency.",
    "Compost organic waste in designated compost bins.",
  ];

  const recentHistory = [
    { date: "Oct 8", action: "Checked bin status", location: "Library Entrance" },
    { date: "Oct 7", action: "Reported full bin", location: "Cafeteria" },
    { date: "Oct 6", action: "Viewed eco tips", location: "Dashboard" },
  ];

  // 🧮 Calculations
  const totalBins = bins.length;
  const binsNearlyFull = bins.filter(bin => (bin.fill ?? (bin.isFull ? 100 : 0)) >= 75).length;
  const availableBins = bins.filter(bin => (bin.fill ?? (bin.isFull ? 100 : 0)) < 50).length;

  return (
    <div className="d-flex vh-100 dashboard-root bg-light">
      <NavbarUser />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarUser />

        <div className="flex-grow-1 p-4 overflow-auto dashboard-content">
          <div className="container-fluid">

            {/* ========================= WELCOME SECTION ========================= */}
            <div
              className="widget welcome-section shadow mb-4 animate__animated animate__fadeInDown text-white rounded-3 shadow-sm p-0 d-flex align-items-center justify-content-between floating-card"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                height: "200px",
              }}
            >
              <div className="text-start px-4 d-flex flex-column justify-content-center h-100">
                <h2 className="fw-bold mb-1 text-white">
                  Welcome, {user?.displayName || "User"} 👋
                </h2>
                <p className="mb-0 text-light">
                  Monitor campus bins and contribute to a cleaner environment.
                </p>
              </div>

              <div
                className="h-100 d-flex align-items-center justify-content-center"
                style={{ flex: "0 0 40%" }}
              >
                <img
                  src={require("../assets/welcome widget1 (1).png")}
                  alt="Welcome illustration"
                  style={{ height: "100%", width: "auto", objectFit: "contain" }}
                />
              </div>
            </div>

            {/* ========================= KPI CARDS ========================= */}
            <div className="row g-3 mb-4">
              <div className="col-md-4 ">
                <KpiCard
                  color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  icon="bi-hdd-network"
                  title="Total Bins"
                  value={totalBins}
                  description="Bins monitored across campus."
                />
              </div>

              <div className="col-md-4">
                <KpiCard
                  color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  icon="bi-exclamation-triangle"
                  title="Bins Nearly Full"
                  value={binsNearlyFull}
                  description="Bins that need attention soon."
                />
              </div>

              <div className="col-md-4">
                <KpiCard
                  color="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                  icon="bi-check-circle"
                  title="Available Bins"
                  value={availableBins}
                  description="Bins with plenty of space."
                />
              </div>
            </div>

            {/* ========================= MAIN GRID ========================= */}
            <div className="dashboard-grid shadow">
              {/* LEFT COLUMN */}
              <div>
                {/* Bin Overview */}
                <BinOverview bins={bins} loading={loading} getFillColor={getFillColor} getFillWidth={getFillWidth} />

                {/* Notifications */}
                <Notifications notifications={notifications} getBadgeColor={getBadgeColor} />
              </div>

              {/* RIGHT COLUMN */}
              <aside className="right-column">
                <RecentActivity recentHistory={recentHistory} />
                <EcoTips ecoTips={ecoTips} />
              </aside>
            </div>

            {/* ========================= STYLES ========================= */}
            <style jsx>{`
              .floating-card {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                cursor: pointer;
                position: relative;
                overflow: hidden;
              }
              .floating-card::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1));
                transform: translateY(100%);
                transition: transform 0.6s ease;
              }
              .floating-card:hover::before {
                transform: translateY(0);
              }
              .floating-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
              }
              .hover-border-line {
                position: relative;
                transition: all 0.3s ease;
              }
              .hover-border-line::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 0;
                background: linear-gradient(180deg, #10b981, #059669);
                transition: height 0.3s ease;
              }
              .hover-border-line:hover::before {
                height: 100%;
              }
              .hover-border-line:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================= SUB COMPONENTS =========================

const KpiCard = ({ color, icon, title, value, description }) => (
  <div
    className="widget floating-card shadow rounded-3 p-3 text-white animate__animated animate__fadeInUp"
    style={{ background: color }}
  >
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h5 className="fw-bold">
        <i className={`bi ${icon} me-2 text-white`}></i>
        {title}
      </h5>
      <span className="text-white fs-4 fw-bold">{value}</span>
    </div>
    <p className="text-light mb-0">{description}</p>
  </div>
);

const BinOverview = ({ bins, loading, getFillColor, getFillWidth }) => (
  <div className="widget shadow rounded-3 p-3 bg-white mb-4 animate__animated animate__fadeIn hover-border-line">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold text-primary mb-0">
        <i className="bi bi-trash me-2"></i>Bin Overview
      </h5>
      <small className="text-muted">Real-time updates</small>
    </div>

    {loading ? (
      <div className="text-center py-4">
        <div className="spinner-border text-success" role="status"></div>
        <p className="text-muted mt-2 mb-0">Loading bins...</p>
      </div>
    ) : bins.length > 0 ? (
      bins.slice(0, 5).map((bin, i) => (
        <div
          key={bin.id}
          className={`d-flex align-items-center py-3 ${i !== Math.min(bins.length, 5) - 1 ? "border-bottom" : ""}`}
        >
          <div style={{ flex: 1 }}>
            <strong>{bin.name || "Unnamed Bin"}</strong>
            <div className="text-muted small">{bin.location || "No location"}</div>
          </div>

          <div className="flex-grow-1 mx-3" style={{ minWidth: "150px" }}>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                style={{
                  width: getFillWidth(bin.fill ?? (bin.isFull ? 100 : 0)),
                  backgroundColor: getFillColor(bin.fill ?? (bin.isFull ? 100 : 0)),
                }}
              ></div>
            </div>
          </div>

          <span className="small fw-semibold text-muted" style={{ width: "40px", textAlign: "right" }}>
            {bin.fill ?? (bin.isFull ? 100 : 0)}%
          </span>
        </div>
      ))
    ) : (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-inbox display-5 mb-2"></i>
        <p>No bins found in the system.</p>
      </div>
    )}
  </div>
);

const Notifications = ({ notifications, getBadgeColor }) => (
  <div className="widget shadow rounded-4 p-4 bg-white animate__animated animate__fadeIn hover-border-line">
    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <h5 className="fw-bold mb-0 text-primary">
        <i className="bi bi-bell-fill me-2 text-warning"></i>Notifications
      </h5>
      <small className="text-muted">{notifications.length} new</small>
    </div>

    <div className="notification-list">
      {notifications.length > 0 ? (
        notifications.slice(0, 5).map((notif) => (
          <div
            key={notif.id}
            className="notification-item p-3 mb-3 rounded-3 shadow-sm bg-light position-relative"
            style={{
              borderLeft: `5px solid ${
                notif.category?.toLowerCase() === "urgent"
                  ? "#dc3545"
                  : notif.category?.toLowerCase() === "policy"
                  ? "#0dcaf0"
                  : notif.category?.toLowerCase() === "event"
                  ? "#198754"
                  : notif.category?.toLowerCase() === "system"
                  ? "#6c757d"
                  : "#f59e0b"
              }`,
            }}
          >
            <div className="d-flex justify-content-between align-items-start text-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1 flex-wrap">
                  <h6 className="fw-semibold mb-0 text-dark me-2">{notif.title}</h6>
                  <span
                    className={`badge rounded-pill bg-${getBadgeColor(notif.category)} text-uppercase`}
                    style={{ fontSize: "0.7rem", letterSpacing: "0.3px" }}
                  >
                    {notif.category}
                  </span>
                </div>
                <p className="mb-2 text-muted small">{notif.message}</p>
              </div>

              <small className="text-secondary text-nowrap ms-3">
                {new Date(notif.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </small>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted text-center py-4 mb-0">
          <i className="bi bi-inbox text-secondary fs-4 d-block mb-2"></i>
          No notifications available.
        </p>
      )}
    </div>
  </div>
);

const RecentActivity = ({ recentHistory }) => (
  <div className="widget shadow rounded-3 p-3 bg-white mb-4 animate__animated animate__fadeIn hover-border-line">
    <div className="widget-header mb-3">
      <h5 className="fw-bold">
        <i className="bi bi-clock-history me-2 text-secondary"></i>Recent Activity
      </h5>
    </div>
    <div className="history-list">
      {recentHistory.map((item, i) => (
        <div key={i} className="history-item mb-3">
          <div className="d-flex justify-content-between">
            <div>
              <div className="fw-semibold">{item.action}</div>
              <small className="text-muted">{item.location}</small>
            </div>
            <div className="text-muted">{item.date}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EcoTips = ({ ecoTips }) => (
  <div className="widget shadow rounded-3 p-3 bg-white animate__animated animate__fadeIn hover-border-line">
    <div className="widget-header mb-3">
      <h5 className="fw-bold">
        <i className="bi bi-lightbulb me-2 text-info"></i>Eco Tips
      </h5>
    </div>
    <div className="tips-list">
      {ecoTips.map((tip, idx) => (
        <div key={idx} className="tip-item d-flex align-items-start gap-2 mb-3">
          <div className="text-info fs-4">💡</div>
          <p className="mb-0 text-muted">{tip}</p>
        </div>
      ))}
    </div>
  </div>
);

export default UserDashboard;
