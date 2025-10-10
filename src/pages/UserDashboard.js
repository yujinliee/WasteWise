import React, { useState } from "react";
import NavbarUser from "../Components/NavbarUser";
import TopNavbarUser from "../Components/TopNavbarUser";
import { useUser } from "../Components/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/UserDashboard.css";

const UserDashboard = () => {
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveProfile = () => {
    console.log("Profile saved!");
    setShowEditModal(false);
  };

  const getFillWidth = (fill) => `${Math.min(Math.max(fill, 0), 100)}%`;

  const binStatus = [
    { id: 1, location: "Main Building A", status: "Available", fill: 20, distance: "50m" },
    { id: 2, location: "Library Entrance", status: "Half Full", fill: 65, distance: "120m" },
    { id: 3, location: "Cafeteria", status: "Nearly Full", fill: 85, distance: "200m" },
  ];

  const notifications = [
    { id: 1, message: "Waste collection scheduled for tomorrow at 8:00 AM", time: "2 hours ago" },
    { id: 2, message: "Remember to separate recyclables from general waste", time: "1 day ago" },
    { id: 3, message: "Bin near Library is almost full", time: "2 days ago" },
  ];

  const ecoTips = [
    "Reduce paper waste by going digital whenever possible",
    "Bring your own reusable water bottle to campus",
    "Properly sort recyclables to improve processing efficiency",
    "Compost organic waste in designated compost bins",
  ];

  const recentHistory = [
    { date: "Oct 8", action: "Checked bin status", location: "Library Entrance" },
    { date: "Oct 7", action: "Reported full bin", location: "Cafeteria" },
    { date: "Oct 6", action: "Viewed eco tips", location: "Dashboard" },
  ];

  return (
    <div className="d-flex vh-100 dashboard-root bg-light">
      <NavbarUser />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarUser />

        <div className="flex-grow-1 p-4 overflow-auto dashboard-content">
          <div className="container-fluid">
            {/* Welcome Section */}
<div
  className="widget welcome-section mb-4 animate__animated animate__fadeInDown text-white rounded-3 shadow-sm p-0 d-flex align-items-center justify-content-between"
  style={{
    background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    height: "200px",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Left side — text content */}
  <div className="position-relative text-start px-4 d-flex flex-column justify-content-center h-100">
    <h2 className="fw-bold mb-1 text-white">
      Welcome back, {user?.displayName || "User"} 👋
    </h2>
    <p className="mb-0 text-light">
      Here’s your latest activity and updates below.
    </p>
  </div>

  {/* Right side — image */}
  <div
    className="h-100 position-relative"
    style={{
      flex: "0 0 40%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <img
      src={require("../assets/welcome widget1 (1).png")}
      alt="Welcome illustration"
      style={{
        height: "100%",
        width: "auto",
        objectFit: "contain",
      }}
    />
  </div>
</div>



            {/* KPI Cards */}
            <div className="row g-3 mb-4">
  <div className="col-md-4">
    <div className="widget floating-card shadow-sm rounded-3 p-3 text-white animate__animated animate__fadeInUp position-relative overflow-hidden"
         style={{
           background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
         }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold"><i className="bi bi-hdd-network me-2 text-white"></i>Total Bins</h5>
        <span className="text-white fs-4 fw-bold">{binStatus.length}</span>
      </div>
      <p className="text-light mb-0">Bins monitored in your vicinity.</p>
    </div>
  </div>
  
  <div className="col-md-4">
    <div className="widget floating-card shadow-sm rounded-3 p-3 text-white animate__animated animate__fadeInUp position-relative overflow-hidden"
         style={{
           background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
         }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold"><i className="bi bi-exclamation-triangle me-2 text-white"></i>Bins Nearly Full</h5>
        <span className="text-white fs-4 fw-bold">
          {binStatus.filter((b) => b.fill >= 75).length}
        </span>
      </div>
      <p className="text-light mb-0">Bins that need attention soon.</p>
    </div>
  </div>
  
  <div className="col-md-4">
    <div className="widget floating-card shadow-sm rounded-3 p-3 text-white animate__animated animate__fadeInUp position-relative overflow-hidden"
         style={{
           background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
         }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold"><i className="bi bi-truck me-2 text-white"></i>Collections Today</h5>
        <span className="text-white fs-4 fw-bold">2</span>
      </div>
      <p className="text-light mb-0">Scheduled collections in your area.</p>
    </div>
  </div>
</div>

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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(255,255,255,0.1) 0%, 
      rgba(255,255,255,0.2) 50%, 
      rgba(255,255,255,0.1) 100%
    );
    transform: translateY(100%);
    transition: transform 0.6s ease;
    z-index: 1;
  }

  .floating-card:hover::before {
    transform: translateY(0);
  }

  .floating-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.15),
      0 0 0 1px rgba(255,255,255,0.1) !important;
  }

  .floating-card > * {
    position: relative;
    z-index: 2;
  }

  /* Subtle pulse animation on numbers */
  .floating-card:hover .fs-4 {
    animation: numberPulse 0.6s ease;
  }

  @keyframes numberPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  /* Icon bounce */
  .floating-card:hover .bi {
    animation: iconBounce 0.6s ease;
  }

  @keyframes iconBounce {
    0%, 20%, 60%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    80% { transform: translateY(-2px); }
  }
`}</style>

            {/* Main Grid */}
            <div className="dashboard-grid">
              <div>
                {/* Nearest Bins */}
                <div className="widget shadow-sm rounded-3 p-3 bg-white mb-4 animate__animated animate__fadeIn">
                  <div className="widget-header mb-3">
                    <h5 className="fw-bold"><i className="bi bi-geo-alt me-2 text-success"></i>Nearest Bins</h5>
                    <small className="text-muted">Updated now</small>
                  </div>
                  <div className="bin-list">
                    {binStatus.map((bin) => (
                      <div key={bin.id} className="bin-item mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-semibold">{bin.location}</div>
                            <small className="text-muted">{bin.distance} away</small>
                          </div>
                          <div className="text-end">
                            <span className={`badge rounded-pill ${
                              bin.fill >= 85 ? "bg-danger" :
                              bin.fill >= 50 ? "bg-warning text-dark" :
                              "bg-success"
                            }`}>
                              {bin.status}
                            </span>
                            <div className="progress mt-2" style={{ height: "6px" }}>
                              <div
                                className="progress-bar"
                                style={{
                                  width: getFillWidth(bin.fill),
                                  backgroundColor:
                                    bin.fill >= 85 ? "#dc3545" :
                                    bin.fill >= 50 ? "#ffc107" :
                                    "#198754",
                                  transition: "width 0.6s ease-in-out"
                                }}
                              ></div>
                            </div>
                            <small>{bin.fill}% full</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeIn">
                  <div className="widget-header mb-3">
                    <h5 className="fw-bold"><i className="bi bi-bell me-2 text-warning"></i>Notifications</h5>
                    <small className="text-muted">{notifications.length} new</small>
                  </div>
                  <div className="notification-list">
                    {notifications.map((note) => (
                      <div key={note.id} className="notification-item mb-3">
                        <div className="d-flex justify-content-between">
                          <p className="mb-1">{note.message}</p>
                          <small className="text-muted">{note.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <aside className="right-column">
                <div className="widget shadow-sm rounded-3 p-3 bg-white mb-4 animate__animated animate__fadeIn">
                  <div className="widget-header mb-3">
                                      <h5 className="fw-bold"><i className="bi bi-clock-history me-2 text-secondary"></i>Recent Activity</h5>
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

              {/* Eco Tips */}
              <div className="widget shadow-sm rounded-3 p-3 bg-white animate__animated animate__fadeIn">
                <div className="widget-header mb-3">
                  <h5 className="fw-bold"><i className="bi bi-lightbulb me-2 text-info"></i>Eco Tips</h5>
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
              </aside>
            </div>
          </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1050,
            }}
            onMouseDown={(e) => {
              if (e.target.classList.contains("modal")) {
                setShowEditModal(false);
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg animate__animated animate__fadeInDown">
                <div className="modal-header bg-white">
                  <h5 className="modal-title fw-bold">Edit Profile</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-muted">This is a placeholder modal. You can wire it to your profile form later.</p>
                  <button className="btn btn-primary" onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default UserDashboard;
