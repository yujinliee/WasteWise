import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'archived'

  // Filter bins based on active tab
  const filteredBins = bins.filter(bin => 
    activeTab === "active" ? !bin.isArchived : bin.isArchived
  );

  // Add bin
  const handleAddBin = (e) => {
    e.preventDefault();
    if (!newBin.name || !newBin.location) return;

    const newId = bins.length > 0 ? Math.max(...bins.map(bin => bin.id)) + 1 : 1;
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

  // Trigger delete confirmation
  const handleDeleteClick = (bin) => {
    setBinToDelete(bin);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    setBins(bins.filter((bin) => bin.id !== binToDelete.id));
    setShowDeleteConfirm(false);
    setBinToDelete(null);
  };

  // Trigger archive confirmation
  const handleArchiveClick = (bin) => {
    setBinToArchive(bin);
    setShowArchiveConfirm(true);
  };

  // Confirm archive
  const confirmArchive = () => {
    setBins(bins.map(bin => 
      bin.id === binToArchive.id 
        ? { ...bin, isArchived: !bin.isArchived }
        : bin
    ));
    setShowArchiveConfirm(false);
    setBinToArchive(null);
  };

  // Restore bin from archive
  const handleRestoreClick = (bin) => {
    setBins(bins.map(b => 
      b.id === bin.id ? { ...b, isArchived: false } : b
    ));
  };

  return (
    <div className="d-flex">
      <NavbarAdmin />

      {/* Main Content */}
      <div 
        className="flex-grow-1 p-4 bg-light" 
        style={{ 
          marginLeft: "250px",
          minHeight: "100vh",
          width: "calc(100% - 250px)"
        }}
      >
        <div className="container-fluid">
          {/* Header Section */}
          <div className="d-flex justify-content-between text-start mb-4">
            <div>
              <h1 className="h2 fw-bold text-dark">Bins Management</h1>
              <p className="text-muted mb-0">Manage and monitor all waste bins</p>
            </div>
            <button 
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Bin
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
                Active Bins ({bins.filter(bin => !bin.isArchived).length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "archived" ? "active" : ""}`}
                onClick={() => setActiveTab("archived")}
              >
                <i className="bi bi-archive me-2"></i>
                Archived Bins ({bins.filter(bin => bin.isArchived).length})
              </button>
            </li>
          </ul>

          {/* Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
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
                          <td className="fw-semibold">#{bin.id}</td>
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
                          <td className="text-center align-middle">
                            <div className="d-flex justify-content-center flex-wrap gap-2">
                              {activeTab === "active" ? (
                                <>
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={() => handleArchiveClick(bin)}
                                    title="Archive Bin"
                                  >
                                    <i className="bi bi-archive me-1"></i> Archive
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteClick(bin)}
                                    title="Delete Bin"
                                  >
                                    <i className="bi bi-trash me-1"></i> Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => handleRestoreClick(bin)}
                                    title="Restore Bin"
                                  >
                                    <i className="bi bi-arrow-counterclockwise me-1"></i> Restore
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteClick(bin)}
                                    title="Delete Bin"
                                  >
                                    <i className="bi bi-trash me-1"></i> Delete
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

        {/* Add Bin Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Bin</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleAddBin}>
                  <div className="modal-body">
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
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowModal(false)}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Save Bin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Confirm Delete
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDeleteConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete <strong>{binToDelete?.name}</strong>? 
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={confirmDelete}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Delete Bin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Modal */}
        {showArchiveConfirm && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-warning">
                    <i className="bi bi-archive me-2"></i>
                    {binToArchive?.isArchived ? 'Restore Bin' : 'Archive Bin'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowArchiveConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to {binToArchive?.isArchived ? 'restore' : 'archive'} 
                    <strong> {binToArchive?.name}</strong>?
                    {!binToArchive?.isArchived && ' Archived bins will be hidden from active view.'}
                  </p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowArchiveConfirm(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={confirmArchive}
                  >
                    <i className="bi bi-archive me-1"></i>
                    {binToArchive?.isArchived ? 'Restore' : 'Archive'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBins;