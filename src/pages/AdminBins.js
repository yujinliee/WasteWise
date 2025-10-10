import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AdminBins = () => {
  const [bins, setBins] = useState([
    { id: 1, name: "Bin A", location: "Building 1", isFull: false, isArchived: false },
    { id: 2, name: "Bin B", location: "Building 2", isFull: true, isArchived: false },
    { id: 3, name: "Bin C", location: "Building 3", isFull: false, isArchived: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBin, setNewBin] = useState({ name: "", location: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [binToDelete, setBinToDelete] = useState(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [binToArchive, setBinToArchive] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  // Filter bins based on active tab
  const filteredBins = bins.filter((bin) =>
    activeTab === "active" ? !bin.isArchived : bin.isArchived
  );

  // Add Bin
  const handleAddBin = (e) => {
    e.preventDefault();
    if (!newBin.name || !newBin.location) return;
    const newId = bins.length > 0 ? Math.max(...bins.map((b) => b.id)) + 1 : 1;
    const bin = {
      id: newId,
      name: newBin.name,
      location: newBin.location,
      isFull: false,
      isArchived: false,
    };
    setBins([...bins, bin]);
    setNewBin({ name: "", location: "" });
    setShowModal(false);
  };

  // Delete Bin
  const handleDeleteClick = (bin) => {
    setBinToDelete(bin);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setBins(bins.filter((b) => b.id !== binToDelete.id));
    setShowDeleteConfirm(false);
    setBinToDelete(null);
  };

  // Archive Bin
  const handleArchiveClick = (bin) => {
    setBinToArchive(bin);
    setShowArchiveConfirm(true);
  };

  const confirmArchive = () => {
    setBins(
      bins.map((b) =>
        b.id === binToArchive.id ? { ...b, isArchived: !b.isArchived } : b
      )
    );
    setShowArchiveConfirm(false);
    setBinToArchive(null);
  };

  const handleRestoreClick = (bin) => {
    setBins(bins.map((b) => (b.id === bin.id ? { ...b, isArchived: false } : b)));
  };

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

        {/* Grayish Layer */}
        <div
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#f0f2f5",
            overflow: "hidden", // prevents background scroll
          }}
        >
          {/* Scrollable White Section */}
          <div
            className="bg-white rounded shadow p-4"
            style={{
              height: "100%",
              overflowY: "auto", // only this part scrolls
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">Bins Management 🗑️</h2>
                <p className="text-muted mb-0">
                  Manage and monitor all waste bins across all buildings.
                </p>
              </div>
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Add New Bin
              </button>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "active" ? "active" : ""}`}
                  onClick={() => setActiveTab("active")}
                >
                  <i className="bi bi-list-check me-2"></i>
                  Active Bins ({bins.filter((b) => !b.isArchived).length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "archived" ? "active" : ""}`}
                  onClick={() => setActiveTab("archived")}
                >
                  <i className="bi bi-archive me-2"></i>
                  Archived Bins ({bins.filter((b) => b.isArchived).length})
                </button>
              </li>
            </ul>

            {/* Table */}
            <div className="card bg-light shadow-sm border-0">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Bin Name</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBins.length > 0 ? (
                        filteredBins.map((bin) => (
                          <tr key={bin.id}>
                            <td>#{bin.id}</td>
                            <td>{bin.name}</td>
                            <td>{bin.location}</td>
                            <td>
                              <span
                                className={`badge ${
                                  bin.isFull ? "bg-warning" : "bg-success"
                                }`}
                              >
                                {bin.isFull ? "Full" : "Not Full"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                {activeTab === "active" ? (
                                  <>
                                    <button
                                      className="btn btn-outline-warning btn-sm"
                                      onClick={() => handleArchiveClick(bin)}
                                    >
                                      <i className="bi bi-archive me-1"></i>Archive
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteClick(bin)}
                                    >
                                      <i className="bi bi-trash me-1"></i>Delete
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="btn btn-outline-success btn-sm"
                                      onClick={() => handleRestoreClick(bin)}
                                    >
                                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                                      Restore
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteClick(bin)}
                                    >
                                      <i className="bi bi-trash me-1"></i>Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <div className="text-muted">
                              <i className="bi bi-inbox display-4 d-block mb-2"></i>
                              No {activeTab === "active" ? "active" : "archived"} bins found
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Bin Modal */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
              <h5 className="mb-3">Add New Bin</h5>
              <form onSubmit={handleAddBin}>
                <div className="mb-3">
                  <label className="form-label">Bin Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter bin name"
                    value={newBin.name}
                    onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter location"
                    value={newBin.location}
                    onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
                    required
                  />
                </div>
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save Bin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
              <h5 className="text-danger mb-3">Confirm Delete</h5>
              <p>
                Are you sure you want to delete <strong>{binToDelete?.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Modal */}
        {showArchiveConfirm && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
              <h5 className="text-warning mb-3">
                {binToArchive?.isArchived ? "Restore Bin" : "Archive Bin"}
              </h5>
              <p>
                Are you sure you want to{" "}
                {binToArchive?.isArchived ? "restore" : "archive"}{" "}
                <strong>{binToArchive?.name}</strong>?
              </p>
              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowArchiveConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-warning" onClick={confirmArchive}>
                  {binToArchive?.isArchived ? "Restore" : "Archive"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBins;
