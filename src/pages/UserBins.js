import React, { useState } from "react";
import NavbarUser from "../Components/NavbarUser";
import TopNavbarUser from "../Components/TopNavbarUser";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const UserBins = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const bins = [
    { id: 1, name: "Bin 101", location: "4th Floor Men Comfort Room", status: "Full", lastEmptied: "2 days ago", fillLevel: 95, distance: "50m", type: "General Waste" },
    { id: 2, name: "Bin 102", location: "3rd Floor Lounge", status: "Available", lastEmptied: "5 hours ago", fillLevel: 25, distance: "120m", type: "Recycling" },
    { id: 3, name: "Bin 103", location: "2nd Floor Lounge", status: "Full", lastEmptied: "1 day ago", fillLevel: 88, distance: "200m", type: "General Waste" },
    { id: 4, name: "Bin 104", location: "1st Floor Cafeteria", status: "Available", lastEmptied: "3 hours ago", fillLevel: 40, distance: "80m", type: "Compost" },
    { id: 5, name: "Bin 105", location: "Library Entrance", status: "Half Full", lastEmptied: "8 hours ago", fillLevel: 65, distance: "150m", type: "Recycling" },
    { id: 6, name: "Bin 106", location: "Sports Complex", status: "Available", lastEmptied: "1 hour ago", fillLevel: 15, distance: "300m", type: "General Waste" },
  ];

  // Filter bins based on selected category
  const filteredBins = bins.filter(bin => {
    switch (selectedCategory) {
      case "all":
        return true;
      case "available":
        return bin.status === "Available";
      case "full":
        return bin.status === "Full";
      case "recycling":
        return bin.type === "Recycling";
      case "general":
        return bin.type === "General Waste";
      case "compost":
        return bin.type === "Compost";
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Full": return { bg: "bg-danger", text: "text-white", bar: "#dc3545", light: "#fee2e2" };
      case "Half Full": return { bg: "bg-warning", text: "text-dark", bar: "#f59e0b", light: "#fef3c7" };
      case "Available": return { bg: "bg-success", text: "text-white", bar: "#10b981", light: "#d1fae5" };
      default: return { bg: "bg-secondary", text: "text-white", bar: "#6b7280", light: "#f3f4f6" };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Full": return "🔴";
      case "Half Full": return "🟡";
      case "Available": return "🟢";
      default: return "⚪";
    }
  };

  const getBinTypeIcon = (type) => {
    switch (type) {
      case "Recycling": return "♻️";
      case "Compost": return "🌱";
      default: return "🗑️";
    }
  };

  const handleCardClick = (bin) => {
    console.log("Clicked bin:", bin);
    // 🔧 Later you can navigate or open a modal here
  };

  const categoryCards = [
    { key: "all", icon: "bi-trash", label: "All Bins", count: bins.length, color: "success" },
    { key: "available", icon: "bi-check-circle", label: "Available", count: bins.filter(b => b.status === "Available").length, color: "success" },
    { key: "full", icon: "bi-exclamation-triangle", label: "Full Bins", count: bins.filter(b => b.status === "Full").length, color: "danger" },
    { key: "recycling", icon: "bi-arrow-repeat", label: "Recycling", count: bins.filter(b => b.type === "Recycling").length, color: "info" },
    { key: "general", icon: "bi-trash", label: "General Waste", count: bins.filter(b => b.type === "General Waste").length, color: "secondary" },
    { key: "compost", icon: "bi-flower1", label: "Compost", count: bins.filter(b => b.type === "Compost").length, color: "warning" },
  ];

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Fixed width navbar - won't change size */}
      <div style={{ width: "280px", flexShrink: 0 }}>
        <NavbarUser />
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarUser />

        <div className="flex-grow-1 p-4 overflow-auto">
          <div className="container-fluid">
            {/* Header Section */}
            <div className="row mb-4 animate__animated animate__fadeInDown">
              <div className="col-12">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="position-relative">
                    <div className="bg-success bg-opacity-10 p-3 rounded-3">
                      <i className="bi bi-trash3 fs-1 text-success"></i>
                    </div>
                  </div>
                  <div>
                    <h1 className="fw-bold mb-1">Waste Bins Management</h1>
                    <p className="text-muted mb-0">
                      Monitor bin statuses and find available disposal points across campus
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Cards - Clickable Filters */}
            <div className="row g-3 mb-4">
              {categoryCards.map((card, index) => (
                <div key={card.key} className="col-md-4 col-lg-2">
                  <div 
                    className={`card border-0 shadow-sm h-100 animate__animated animate__fadeInUp clickable-card ${
                      selectedCategory === card.key ? 'border-3 border-' + card.color : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s`, cursor: "pointer" }}
                    onClick={() => setSelectedCategory(card.key)}
                  >
                    <div className="card-body text-center p-3">
                      <div className={`bg-${card.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-2`}
                           style={{ width: "60px", height: "60px" }}>
                        <i className={`${card.icon} fs-4 text-${card.color}`}></i>
                      </div>
                      <h6 className="fw-bold mb-1">{card.label}</h6>
                      <div className={`text-${card.color} fw-bold fs-5`}>{card.count}</div>
                      <small className="text-muted">Bins</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bins Grid Header */}
            <div className="row mb-3">
              <div className="col-12">
                <h5 className="fw-bold text-muted">
                  <i className="bi bi-list-ul me-2"></i>
                  Showing {filteredBins.length} bins
                  {selectedCategory !== "all" && (
                    <span className="text-success"> • {categoryCards.find(c => c.key === selectedCategory)?.label}</span>
                  )}
                </h5>
              </div>
            </div>

            {/* Bins Grid */}
            <div className="row g-3">
              {filteredBins.map((bin, index) => {
                const statusColor = getStatusColor(bin.status);
                return (
                  <div key={bin.id} className="col-12 col-md-6 col-xl-4">
                    <div
                      className="card border-0 shadow-sm h-100 animate__animated animate__fadeInUp clickable-card"
                      style={{ animationDelay: `${index * 0.1}s`, cursor: "pointer" }}
                      onClick={() => handleCardClick(bin)}
                    >
                      <div className="card-body p-3">
                        {/* Bin Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm"
                              style={{
                                width: "50px",
                                height: "50px",
                                background: statusColor.light,
                                color: statusColor.bar,
                                fontSize: "1.1rem",
                              }}
                            >
                              {getBinTypeIcon(bin.type)}
                            </div>
                            <div>
                              <h6 className="fw-bold mb-1">{bin.name}</h6>
                              <small className="text-muted">
                                <i className="bi bi-geo-alt me-1"></i>
                                {bin.location}
                              </small>
                            </div>
                          </div>
                          <span className={`badge ${statusColor.bg} ${statusColor.text} px-2 py-1`}>
                            {getStatusIcon(bin.status)}
                          </span>
                        </div>

                        {/* Fill Level */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Fill Level</small>
                            <small className="fw-bold">{bin.fillLevel}%</small>
                          </div>
                          <div className="progress" style={{ height: "6px" }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${bin.fillLevel}%`,
                                backgroundColor: statusColor.bar,
                                transition: "width 0.6s ease-in-out",
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                          <div>
                            <i className="bi bi-clock me-1"></i>
                            {bin.lastEmptied}
                          </div>
                          <div>
                            <i className="bi bi-geo me-1"></i>
                            {bin.distance}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredBins.length === 0 && (
              <div className="row mt-5">
                <div className="col-12 text-center">
                  <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No bins found</h5>
                  <p className="text-muted mb-4">No bins match the selected category</p>
                  <button 
                    className="btn btn-success"
                    onClick={() => setSelectedCategory("all")}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Show All Bins
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .clickable-card {
          transition: all 0.2s ease-in-out;
        }
        
        .clickable-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.75rem 1.25rem rgba(0, 0, 0, 0.15) !important;
        }
        
        .navibar-fixed {
          width: 280px;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default UserBins;