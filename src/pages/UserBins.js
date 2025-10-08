import React, { useState } from "react";
import NavbarUser from "../Components/NavbarUser";

const UserBins = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const bins = [
    { id: 1, name: "Bin 101", location: "Main Street", status: "Full", lastEmptied: "2 days ago" },
    { id: 2, name: "Bin 102", location: "North District", status: "Available", lastEmptied: "5 hours ago" },
    { id: 3, name: "Bin 103", location: "South Park", status: "Full", lastEmptied: "1 day ago" },
  ];

  const filteredBins = bins.filter(
    (bin) =>
      bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusFilter = (status) => {
    setSearchTerm(status === "All" ? "" : status);
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <NavbarUser />

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light overflow-auto">
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Nearby Bins</h2>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-center border-success">
                <div className="card-body">
                  <h6 className="text-muted">Total Bins</h6>
                  <h4 className="fw-bold">{bins.length}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center border-danger">
                <div className="card-body">
                  <h6 className="text-muted">Full Bins</h6>
                  <h4 className="fw-bold">{bins.filter(b => b.status === "Full").length}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center border-success">
                <div className="card-body">
                  <h6 className="text-muted">Available Bins</h6>
                  <h4 className="fw-bold">{bins.filter(b => b.status === "Available").length}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="btn-group mb-4" role="group">
            <button className="btn btn-outline-secondary" onClick={() => handleStatusFilter("All")}>
              All
            </button>
            <button className="btn btn-outline-danger" onClick={() => handleStatusFilter("Full")}>
              Full
            </button>
            <button className="btn btn-outline-success" onClick={() => handleStatusFilter("Available")}>
              Available
            </button>
          </div>

          {/* Bins List */}
          <div className="row g-3">
            {filteredBins.length > 0 ? (
              filteredBins.map((bin) => (
                <div key={bin.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{bin.name}</h5>
                      <p className="card-text mb-1">
                        <strong>Location:</strong> {bin.location}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Status:</strong>{" "}
                        <span className={`badge ${bin.status === "Full" ? "bg-danger" : "bg-success"}`}>
                          {bin.status}
                        </span>
                      </p>
                      <p className="card-text">
                        <span className="badge bg-light text-muted">
                          Last emptied: {bin.lastEmptied}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-warning text-center">
                  No bins found.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBins;
