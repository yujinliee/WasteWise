import React, { useState, useEffect } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { db } from "../Components/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const AdminBins = () => {
  const [bins, setBins] = useState([]);
  const [newBin, setNewBin] = useState({ name: "", location: "" });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [binToDelete, setBinToDelete] = useState(null);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [binToArchive, setBinToArchive] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [toastMessage, setToastMessage] = useState("");

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

  const handleAddBin = async (e) => {
  e.preventDefault();
  if (!newBin.name || !newBin.location) return;

  try {
    await addDoc(collection(db, "bins"), {
      name: newBin.name,
      location: newBin.location,
      isFull: false,
      isArchived: false,
    });

    setNewBin({ name: "", location: "" });
    setShowModal(false); // just close modal
    // NO page reload!
  } catch (err) {
    console.error("Error adding bin: ", err);
  }
};


  // ✅ Delete bin
  const handleDeleteClick = (bin) => {
    setBinToDelete(bin);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "bins", binToDelete.id));
    setShowDeleteConfirm(false);
    showToast("🗑️ Bin deleted permanently!");
  };

  // ✅ Archive / Restore bin
  const handleArchiveClick = (bin) => {
    setBinToArchive(bin);
    setShowArchiveConfirm(true);
  };

  const confirmArchive = async () => {
    const updatedStatus = !binToArchive.isArchived;
    await updateDoc(doc(db, "bins", binToArchive.id), {
      isArchived: updatedStatus,
    });
    setShowArchiveConfirm(false);
    showToast(
      updatedStatus ? "📦 Bin archived!" : "♻️ Bin restored successfully!"
    );
  };

  const filteredBins = bins.filter((bin) =>
    activeTab === "active" ? !bin.isArchived : bin.isArchived
  );

  // ✅ Temporary Toast Notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="d-flex vh-100 bg-light">
      <NavbarAdmin />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarAdmin />

        {/* Main */}
        <div
          className="flex-grow-1 p-4 overflow-auto"
          style={{ backgroundColor: "#f3f4f6" }}
        >
          <div className="container-fluid">
            {/* Header */}
            <div
              className="widget mb-4 rounded-3 shadow-sm p-4 animate__animated animate__fadeInDown text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 className="fw-bold mb-1">Bin Management 🗑️</h3>
                <p className="text-light mb-0">
                  Monitor, archive, and manage campus waste bins efficiently.
                </p>
              </div>
              <button
                className="btn btn-light text-primary fw-semibold shadow-sm"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>Add Bin
              </button>
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills mb-4">
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${
                    activeTab === "active"
                      ? "active bg-primary text-white"
                      : "text-primary border border-primary"
                  }`}
                  onClick={() => setActiveTab("active")}
                >
                  <i className="bi bi-list-check me-2"></i>
                  Active Bins ({bins.filter((b) => !b.isArchived).length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "archived"
                      ? "active bg-secondary text-white"
                      : "text-secondary border border-secondary"
                  }`}
                  onClick={() => setActiveTab("archived")}
                >
                  <i className="bi bi-archive me-2"></i>
                  Archived Bins ({bins.filter((b) => b.isArchived).length})
                </button>
              </li>
            </ul>

            {/* Table */}
            <div className="card border-0 shadow-sm rounded-3 animate__animated animate__fadeInUp">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBins.length > 0 ? (
                        filteredBins.map((bin) => (
                          <tr key={bin.id}>
                            <td className="fw-semibold">{bin.name}</td>
                            <td>{bin.location}</td>
                            <td>
                              <span
                                className={`badge ${
                                  bin.isFull
                                    ? "bg-warning text-dark"
                                    : "bg-success"
                                }`}
                              >
                                {bin.isFull ? "Full" : "Not Full"}
                              </span>
                            </td>
                            <td className="align-middle text-center">
                              <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                                {activeTab === "active" ? (
                                  <>
                                    <button
                                      className="btn btn-outline-warning btn-sm"
                                      onClick={() => handleArchiveClick(bin)}
                                    >
                                      <i className="bi bi-archive me-1"></i>
                                      Archive
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteClick(bin)}
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Delete
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="btn btn-outline-success btn-sm"
                                      onClick={() => handleArchiveClick(bin)}
                                    >
                                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                                      Restore
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteClick(bin)}
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-5">
                            <i className="bi bi-inbox display-5 text-muted d-block mb-2"></i>
                            <p className="text-muted mb-0">
                              No {activeTab === "active" ? "active" : "archived"} bins
                              found.
                            </p>
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

        {/* ✅ Add Bin Modal */}
        <div
          className={`modal fade ${showModal ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent",
            backdropFilter: showModal ? "blur(3px)" : "none",
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0 rounded-4 animate__animated animate__zoomIn">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-primary">
                  <i className="bi bi-plus-circle me-2"></i>Add New Bin
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddBin}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Bin Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        bins.some(
                          (b) =>
                            b.name.toLowerCase() ===
                            newBin.name.toLowerCase()
                        )
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter bin name"
                      value={newBin.name}
                      onChange={(e) =>
                        setNewBin({ ...newBin, name: e.target.value })
                      }
                      required
                    />
                    {bins.some(
                      (b) =>
                        b.name.toLowerCase() === newBin.name.toLowerCase()
                    ) && (
                      <div className="text-danger small mt-1">
                        A bin with this name already exists.
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Location</label>
                    <select
                      className="form-select"
                      value={newBin.location}
                      onChange={(e) =>
                        setNewBin({ ...newBin, location: e.target.value })
                      }
                      required
                    >
                      <option value="">Select location</option>
                      <option>4th Floor</option>
                      <option>5th Floor</option>
                      <option>4th Floor - Men’s CR</option>
                      <option>4th Floor - Women’s CR</option>
                      <option>5th Floor - Men’s CR</option>
                      <option>5th Floor - Women’s CR</option>
                      <option>Canteen 1</option>
                      <option>Canteen 2</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={bins.some(
                      (b) =>
                        b.name.toLowerCase() === newBin.name.toLowerCase()
                    )}
                  >
                    Save Bin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ✅ Delete Confirmation Modal */}
        <div
          className={`modal fade ${showDeleteConfirm ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: showDeleteConfirm
              ? "rgba(0,0,0,0.5)"
              : "transparent",
            backdropFilter: showDeleteConfirm ? "blur(3px)" : "none",
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0 rounded-4 animate__animated animate__zoomIn">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>Confirm Delete
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to permanently delete{" "}
                  <strong>{binToDelete?.name}</strong>? <br />
                  <span className="text-muted small">
                    This action cannot be undone.
                  </span>
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
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
        </div>

        {/* ✅ Archive / Restore Confirmation Modal */}
        <div
          className={`modal fade ${showArchiveConfirm ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: showArchiveConfirm
              ? "rgba(0,0,0,0.5)"
              : "transparent",
            backdropFilter: showArchiveConfirm ? "blur(3px)" : "none",
          }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0 rounded-4 animate__animated animate__zoomIn">
              <div className="modal-header border-0">
                <h5
                  className={`modal-title fw-bold ${
                    binToArchive?.isArchived ? "text-success" : "text-warning"
                  }`}
                >
                  <i
                    className={`bi ${
                      binToArchive?.isArchived
                        ? "bi-arrow-counterclockwise"
                        : "bi-archive"
                    } me-2`}
                  ></i>
                  {binToArchive?.isArchived ? "Restore Bin" : "Archive Bin"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowArchiveConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to{" "}
                  {binToArchive?.isArchived ? "restore" : "archive"}{" "}
                  <strong>{binToArchive?.name}</strong>?
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowArchiveConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn ${
                    binToArchive?.isArchived ? "btn-success" : "btn-warning"
                  }`}
                  onClick={confirmArchive}
                >
                  {binToArchive?.isArchived ? "Restore" : "Archive"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Success Toast */}
        {toastMessage && (
          <div
            className="toast-container position-fixed bottom-0 end-0 p-3"
            style={{ zIndex: 1055 }}
          >
            <div className="toast show bg-success text-white border-0 shadow-lg rounded-3 animate__animated animate__fadeInUp">
              <div className="toast-body fw-semibold">{toastMessage}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBins;
