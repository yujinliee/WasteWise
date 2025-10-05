import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import "../styles/AdminBins.css";

const AdminBins = () => {
  const [bins, setBins] = useState([
    { id: 1, name: "Bin A", location: "Building 1", isFull: false },
    { id: 2, name: "Bin B", location: "Building 2", isFull: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBin, setNewBin] = useState({ name: "", location: "" });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [binToDelete, setBinToDelete] = useState(null);

  // Add bin
  const handleAddBin = (e) => {
    e.preventDefault();
    if (!newBin.name || !newBin.location) return;

    const newId = bins.length + 1;
    const bin = {
      id: newId,
      name: newBin.name,
      location: newBin.location,
      isFull: false,
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

  return (
    <div className="adminbins-container">
      <NavbarAdmin />

      <div className="adminbins-main">
        <div className="header-section">
          <h1>Bins Management</h1>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            ➕ Add Bin
          </button>
        </div>

        {/* Table */}
        <table className="bins-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Bin Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr key={bin.id}>
                <td>{bin.id}</td>
                <td>{bin.name}</td>
                <td>{bin.location}</td>
                <td>
                  <span
                    className={`status-badge ${bin.isFull ? "full" : "not-full"}`}
                  >
                    {bin.isFull ? "Full" : "Not Full"}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(bin)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Add Bin */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add New Bin</h2>
              <form onSubmit={handleAddBin} className="modal-form">
                <input
                  type="text"
                  placeholder="Bin Name"
                  value={newBin.name}
                  onChange={(e) =>
                    setNewBin({ ...newBin, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newBin.location}
                  onChange={(e) =>
                    setNewBin({ ...newBin, location: e.target.value })
                  }
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Delete */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirm Delete</h2>
              <p>
                Are you sure you want to delete{" "}
                <strong>{binToDelete?.name}</strong>?
              </p>
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button className="delete-btn" onClick={confirmDelete}>
                  Yes, Delete
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
