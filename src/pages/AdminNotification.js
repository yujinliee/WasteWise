import React, { useState, useEffect } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Components/firebase";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotif, setNewNotif] = useState({ title: "", message: "", category: "" });
  const [editMode, setEditMode] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [notifToArchive, setNotifToArchive] = useState(null);
  const [viewMessageNotif, setViewMessageNotif] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);

  const categories = ["System", "Policy", "Event", "Urgent", "General"];

  // Fetch notifications from Firebase on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const notifSnapshot = await getDocs(collection(db, "notifications"));
        const notifList = notifSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        notifList.sort((a, b) => b.pinned - a.pinned || new Date(b.date) - new Date(a.date));
        setNotifications(notifList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        alert("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const closeModal = (id) => {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      setTimeout(() => {
        document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }, 150);
    }
  };

  const handleSaveNotification = async (e) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message || !newNotif.category) return;
    setLoading(true);

    try {
      if (editMode && currentNotif) {
        const notifRef = doc(db, "notifications", currentNotif.id);
        await updateDoc(notifRef, { ...newNotif, date: new Date().toISOString() });
        setNotifications(notifications.map(n => n.id === currentNotif.id ? { ...n, ...newNotif, date: new Date().toLocaleString() } : n));
      } else {
        const docRef = await addDoc(collection(db, "notifications"), { ...newNotif, date: new Date().toISOString(), pinned: false, archived: false, read: false });
        setNotifications([{ id: docRef.id, ...newNotif, date: new Date().toLocaleString(), pinned: false, archived: false, read: false }, ...notifications]);
      }

      setNewNotif({ title: "", message: "", category: "" });
      setEditMode(false);
      setCurrentNotif(null);
      closeModal("notifModal");
    } catch (error) {
      console.error("Error saving notification:", error);
      alert("Error saving notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!notifToDelete) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "notifications", notifToDelete.id));
      setNotifications(notifications.filter(n => n.id !== notifToDelete.id));
      setNotifToDelete(null);
      closeModal("deleteConfirmModal");
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Error deleting notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmArchive = async () => {
    if (!notifToArchive) return;
    setLoading(true);
    try {
      const notifRef = doc(db, "notifications", notifToArchive.id);
      await updateDoc(notifRef, { archived: !notifToArchive.archived });
      setNotifications(notifications.map(n => n.id === notifToArchive.id ? { ...n, archived: !n.archived } : n));
      setNotifToArchive(null);
      closeModal("archiveConfirmModal");
    } catch (error) {
      console.error("Error archiving notification:", error);
      alert("Error archiving notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (id) => {
    setLoading(true);
    try {
      const notif = notifications.find(n => n.id === id);
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { pinned: !notif.pinned });
      setNotifications(notifications.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    } catch (error) {
      console.error("Error toggling pin:", error);
      alert("Error updating notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (notif) => {
    setEditMode(true);
    setCurrentNotif(notif);
    setNewNotif({ title: notif.title, message: notif.message, category: notif.category });
    closeModal("notifModal");
    setTimeout(() => new window.bootstrap.Modal(document.getElementById("notifModal")).show(), 200);
  };

  const handleDeleteClick = (notif) => {
    setNotifToDelete(notif);
    new window.bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
  };

  const handleArchiveClick = (notif) => {
    setNotifToArchive(notif);
    new window.bootstrap.Modal(document.getElementById("archiveConfirmModal")).show();
  };

  const openNewNotifModal = () => {
    setEditMode(false);
    setNewNotif({ title: "", message: "", category: "" });
    setCurrentNotif(null);
    closeModal("notifModal");
    setTimeout(() => new window.bootstrap.Modal(document.getElementById("notifModal")).show(), 200);
  };

  const getCategoryBadgeClass = (category) => {
    const classes = { System: "bg-primary", Policy: "bg-success", Event: "bg-info", Urgent: "bg-danger", General: "bg-secondary" };
    return classes[category] || "bg-secondary";
  };

  const filteredNotifications = notifications
    .filter(notif => (activeTab === "active" ? !notif.archived : notif.archived))
    .filter(notif => (notif.title + notif.message + notif.category).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned || new Date(b.date) - new Date(a.date));

  const truncateMessage = (msg, max = 60) => (msg.length > max ? msg.slice(0, max) + "..." : msg);

  return (
    <div className="d-flex vh-75 bg-light">
      <NavbarAdmin />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarAdmin />
        <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: "#f3f4f6" }}>
          <div className="container-fluid">
            {/* Header */}
            <div
              className="widget mb-4 rounded-3 shadow-sm p-4 text-white d-flex justify-content-between align-items-center"
              style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
            >
              <div>
                <h3 className="fw-bold mb-1">Notifications Management 📢</h3>
                <p className="text-light mb-0">Post and manage notifications for all users.</p>
              </div>
              {activeTab === "active" && (
                <button 
                  className="btn btn-light text-success fw-semibold shadow-sm" 
                  onClick={openNewNotifModal}
                  disabled={loading}
                >
                  <i className="bi bi-megaphone me-2"></i>
                  {loading ? "Processing..." : "Post Notification"}
                </button>
              )}
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills mb-4">
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${activeTab === "active" ? "active bg-success text-white" : "text-success border border-success"}`}
                  onClick={() => setActiveTab("active")}
                  disabled={loading}
                >
                  <i className="bi bi-bell me-2"></i>
                  Active ({notifications.filter((n) => !n.archived).length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "archived" ? "active bg-secondary text-white" : "text-secondary border border-secondary"}`}
                  onClick={() => setActiveTab("archived")}
                  disabled={loading}
                >
                  <i className="bi bi-archive me-2"></i>
                  Archived ({notifications.filter((n) => n.archived).length})
                </button>
              </li>
            </ul>

            {/* Search */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search notifications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center mb-4">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Processing...</p>
              </div>
            )}

            {/* Notifications Grid - FIXED: Smaller cards with consistent width */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
              {filteredNotifications.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i className="bi bi-bell-slash display-5 text-muted mb-3"></i>
                  <h5 className="text-muted">No {activeTab} notifications found</h5>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div className="col" key={notif.id}>
                    <div className={`card h-100 shadow-sm rounded-3 p-3 ${notif.archived ? "bg-light" : "bg-white"} compact-card`} style={{ minHeight: "180px" }}>
                      <div className="card-body d-flex flex-column h-100 p-0">
                        {/* Header with title and badge */}
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0 text-truncate me-2" style={{ fontSize: "0.9rem", maxWidth: "70%" }}>
                            {notif.title}
                          </h6>
                          <span className={`badge ${getCategoryBadgeClass(notif.category)}`} style={{ fontSize: "0.7rem" }}>
                            {notif.category}
                          </span>
                        </div>
                        
                        {/* Message */}
                        <p
                          className="text-muted small flex-grow-1 mb-2"
                          style={{ 
                            cursor: notif.message.length > 60 ? "pointer" : "default",
                            fontSize: "0.8rem",
                            lineHeight: "1.4",
                            minHeight: "40px"
                          }}
                          onClick={() => notif.message.length > 60 && setViewMessageNotif(notif)}
                        >
                          {truncateMessage(notif.message, 60)}
                        </p>

                        {/* Footer with time and buttons */}
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          {/* Time */}
                          <small className="text-secondary" style={{ fontSize: "0.75rem" }}>
                            <i className="bi bi-clock me-1"></i>
                            {new Date(notif.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </small>

                          {/* Action Buttons */}
                          <div className="d-flex gap-1">
                            {activeTab === "active" ? (
                              <>
                                <button
                                  className={`btn btn-sm ${notif.pinned ? "btn-warning" : "btn-outline-warning"}`}
                                  onClick={() => togglePin(notif.id)}
                                  disabled={loading}
                                  style={{ padding: "0.25rem 0.4rem" }}
                                >
                                  <i className={`bi ${notif.pinned ? "bi-pin-fill" : "bi-pin"}`} style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handleArchiveClick(notif)}
                                  disabled={loading}
                                  style={{ padding: "0.25rem 0.4rem" }}
                                >
                                  <i className="bi bi-archive" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEditClick(notif)}
                                  disabled={loading}
                                  style={{ padding: "0.25rem 0.4rem" }}
                                >
                                  <i className="bi bi-pencil" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteClick(notif)}
                                  disabled={loading}
                                  style={{ padding: "0.25rem 0.4rem" }}
                                >
                                  <i className="bi bi-trash" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleArchiveClick(notif)}
                                  disabled={loading}
                                  style={{ padding: "0.25rem 0.4rem" }}
                                >
                                  <i className="bi bi-arrow-counterclockwise" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteClick(notif)}
                                  disabled={loading}
                                  style={{ padding: "0.25rem 0.4rem" }}
                                >
                                  <i className="bi bi-trash" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Notification Modal */}
      <div className="modal fade" id="notifModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">{editMode ? "Edit Notification" : "Post New Notification"}</h5>
              <button type="button" className="btn-close" onClick={() => closeModal("notifModal")}></button>
            </div>
            <form onSubmit={handleSaveNotification}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter title" 
                    value={newNotif.title} 
                    onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })} 
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Enter message" 
                    rows="3" 
                    value={newNotif.message} 
                    onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })} 
                    required
                    disabled={loading}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select 
                    className="form-select" 
                    value={newNotif.category} 
                    onChange={(e) => setNewNotif({ ...newNotif, category: e.target.value })} 
                    required
                    disabled={loading}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-secondary" onClick={() => closeModal("notifModal")} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? "Processing..." : (editMode ? "Save Changes" : "Post Notification")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <div className="modal fade" id="deleteConfirmModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold text-danger">Confirm Delete</h5>
              <button type="button" className="btn-close" onClick={() => closeModal("deleteConfirmModal")}></button>
            </div>
            <div className="modal-body text-center">
              <i className="bi bi-exclamation-triangle-fill text-warning display-5 mb-3"></i>
              <h6>Are you sure you want to delete this notification?</h6>
              {notifToDelete && <p className="text-muted mt-2 mb-0"><strong>{notifToDelete.title}</strong></p>}
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <button type="button" className="btn btn-outline-secondary" onClick={() => closeModal("deleteConfirmModal")} disabled={loading}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Modal */}
      <div className="modal fade" id="archiveConfirmModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold text-secondary">Confirm Action</h5>
              <button type="button" className="btn-close" onClick={() => closeModal("archiveConfirmModal")}></button>
            </div>
            <div className="modal-body text-center">
              <i className="bi bi-archive-fill text-secondary display-5 mb-3"></i>
              <h6>{notifToArchive?.archived ? "Do you want to restore this notification?" : "Are you sure you want to archive this notification?"}</h6>
              {notifToArchive && <p className="text-muted mt-2 mb-0"><strong>{notifToArchive.title}</strong></p>}
            </div>
            <div className="modal-footer border-0 justify-content-center">
              <button type="button" className="btn btn-outline-secondary" onClick={() => closeModal("archiveConfirmModal")} disabled={loading}>
                Cancel
              </button>
              <button type="button" className="btn btn-secondary" onClick={confirmArchive} disabled={loading}>
                {loading ? "Processing..." : (notifToArchive?.archived ? "Restore" : "Archive")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Message Modal */}
      {viewMessageNotif && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{viewMessageNotif.title}</h5>
                <button type="button" className="btn-close" onClick={() => setViewMessageNotif(null)}></button>
              </div>
              <div className="modal-body">
                <p>{viewMessageNotif.message}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewMessageNotif(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style jsx>{`
        .compact-card {
          transition: all 0.3s ease;
        }
        .compact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;