import React, { useState, useEffect } from "react";
import NavbarUser from "../Components/NavbarUser";
import TopNavbarUser from "../Components/TopNavbarUser";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Components/firebase";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const UserBins = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Real-time Firestore listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bins"),
      (snapshot) => {
        const activeBins = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((b) => !b.isArchived);
        setBins(activeBins);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching bins:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ✅ Filter bins based on selected category
  const filteredBins = bins.filter((bin) => {
    switch (selectedCategory) {
      case "all":
        return true;
      case "available":
        return bin.status === "Available";
      case "half-full":
        return bin.status === "Half Full";
      case "full":
        return bin.status === "Full";
      default:
        return true;
    }
  });

  // ✅ Utility functions for status display
  const getStatusColor = (status) => {
    switch (status) {
      case "Full":
        return { bg: "bg-danger", text: "text-white", bar: "#dc3545", light: "#fee2e2" };
      case "Half Full":
        return { bg: "bg-warning", text: "text-dark", bar: "#f59e0b", light: "#fef3c7" };
      case "Available":
        return { bg: "bg-success", text: "text-white", bar: "#10b981", light: "#d1fae5" };
      default:
        return { bg: "bg-secondary", text: "text-white", bar: "#6b7280", light: "#f3f4f6" };
    }
  };

  const getBinTypeIcon = (type) => {
    switch (type) {
      case "Recycling":
        return "♻️";
      case "Compost":
        return "🌱";
      default:
        return "🗑️";
    }
  };

  const handleCardClick = (bin) => {
    console.log("Clicked bin:", bin);
  };

  const categoryCards = [
    { key: "all", icon: "bi-trash", label: "All Bins", color: "success" },
    { key: "available", icon: "bi-check-circle", label: "Available", color: "success" },
    { key: "half-full", icon: "bi-circle-half", label: "Half Full Bins", color: "warning" },
    { key: "full", icon: "bi-exclamation-triangle", label: "Full Bins", color: "danger" },
  ];

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-light">
      <div style={{ width: "280px", flexShrink: 0 }}>
        <NavbarUser />
      </div>

      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarUser />

        <div className="flex-grow-1 p-4 overflow-auto">
          <div className="container-fluid">
            {/* Header */}
            <div className="row mb-4 animate__animated animate__fadeInDown">
              <div className="col-12">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="bg-success bg-opacity-10 p-3 rounded-3 animate__animated animate__pulse animate__infinite"
                    style={{ animationDuration: "2s" }}
                  >
                    <i className="bi bi-trash3 fs-1 text-success"></i>
                  </div>
                  <div>
                    <h1 className="fw-bold mb-1 animate__animated animate__fadeIn">Waste Bins Management</h1>
                    <p className="text-muted mb-0 animate__animated animate__fadeIn animate__delay-1s">
                      Monitor bin statuses and find available disposal points across campus
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Cards */}
            <div className="row g-3 mb-4">
              {categoryCards.map((card, index) => (
                <div key={card.key} className="col-6 col-md-3">
                  <div
                    className={`eco-mini-card animate__animated animate__fadeInUp ${
                      selectedCategory === card.key ? "eco-mini-selected" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => setSelectedCategory(card.key)}
                  >
                    <div className="eco-mini-icon">
                      <i className={`${card.icon}`}></i>
                    </div>
                    <div className="eco-mini-info">
                      <h6 className="mb-0">{card.label}</h6>
                      <small className="fw-bold">
                        {card.key === "all"
                          ? bins.length
                          : bins.filter((b) =>
                              card.key === "available"
                                ? b.status === "Available"
                                : card.key === "half-full"
                                ? b.status === "Half Full"
                                : b.status === "Full"
                            ).length}{" "}
                        Bins
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bin Cards Grid */}
            <div className="row g-3">
              {filteredBins.map((bin, index) => {
                const statusColor = getStatusColor(bin.status);
                return (
                  <div key={bin.id} className="col-12 col-md-6 col-xl-4">
                    <div
                      className="card bin-card border-0 shadow-sm h-100 animate__animated animate__fadeInUp"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      }}
                      onClick={() => handleCardClick(bin)}
                    >
                      <div className="card-body p-3 eco-bin-card">
                        {/* Bin Header */}
                        <div className="d-flex align-items-center text-start mb-3">
                          <div
                            className="bin-icon rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              background: statusColor.light,
                              color: statusColor.bar,
                              fontSize: "1.2rem",
                              width: "45px",
                              height: "45px",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {getBinTypeIcon(bin.type)}
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0">{bin.name}</h6>
                            <small className="text-muted">{bin.location}</small>
                          </div>
                        </div>

                        {/* Fill Level */}
                        <div className="mb-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Fill Level</small>
                            <small className="fw-bold">{bin.fillLevel}%</small>
                          </div>
                          <div className="progress" style={{ height: "8px", borderRadius: "8px" }}>
                            <div
                              className="progress-bar"
                              style={{
                                width: `${bin.fillLevel}%`,
                                backgroundColor: statusColor.bar,
                                borderRadius: "8px",
                                transition: "width 1s ease-in-out, background-color 0.3s ease",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredBins.length === 0 && !loading && (
              <div className="row mt-5 animate__animated animate__fadeIn">
                <div className="col-12 text-center">
                  <i className="bi bi-inbox display-1 text-muted mb-3 animate__animated animate__bounce"></i>
                  <h5 className="text-muted mb-2">No bins found</h5>
                  <p className="text-muted mb-4">No bins match the selected category</p>
                  <button
                    className="btn btn-success animate__animated animate__pulse animate__infinite"
                    onClick={() => setSelectedCategory("all")}
                    style={{ animationDuration: "2s" }}
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

      {/* Enhanced CSS Styles */}
      <style jsx>{`
        .eco-mini-card {
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          padding: 14px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .eco-mini-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
          border-color: #a7f3d0;
          background: #f9fffb;
        }
        .eco-mini-selected {
          border-color: #10b981;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
        .eco-mini-icon {
          background: #ecfdf5;
          color: #047857;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        .eco-mini-card:hover .eco-mini-icon {
          background: #d1fae5;
          transform: scale(1.05);
        }
        .eco-mini-info h6 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #065f46;
        }
        .eco-mini-info small {
          color: #6b7280;
          font-size: 0.8rem;
        }
        .eco-bin-card {
          background: #f9fffb;
          border: 1px solid #d1fae5;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .eco-bin-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 15px rgba(16, 185, 129, 0.15);
        }
        .bin-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default UserBins;
