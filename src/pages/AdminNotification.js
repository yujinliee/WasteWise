import React, { useState, useEffect } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
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

  // Modal states
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const categories = ["System", "Policy", "Event", "Urgent", "General"];

  // Fetch notifications with real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "notifications"), 
      (snapshot) => {
        const notifList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        notifList.sort((a, b) => b.pinned - a.pinned || new Date(b.date) - new Date(a.date));
        setNotifications(notifList);
        console.log("📢 Notifications updated:", notifList.length, "items");
      }, 
      (error) => {
        console.error("❌ Error in notifications listener:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save notification
  const handleSaveNotification = async (e) => {
    e.preventDefault();
    console.log("🔄 Starting to save notification...", newNotif);

    if (!newNotif.title || !newNotif.message || !newNotif.category) {
      alert("❌ All fields are required!");
      return;
    }

    setLoading(true);

    try {
      if (editMode && currentNotif) {
        console.log("📝 Editing notification:", currentNotif.id);
        const notifRef = doc(db, "notifications", currentNotif.id);
        await updateDoc(notifRef, { 
          ...newNotif, 
          date: new Date().toISOString() 
        });
        console.log("✅ Notification updated");
      } else {
        console.log("🆕 Creating new notification...");
        const notificationData = {
          title: newNotif.title,
          message: newNotif.message,
          category: newNotif.category,
          date: new Date().toISOString(),
          pinned: false,
          archived: false,
          read: false,
        };
        
        const docRef = await addDoc(collection(db, "notifications"), notificationData);
        console.log("✅ Notification created with ID:", docRef.id);
      }

      // Reset form and close modal
      setNewNotif({ title: "", message: "", category: "" });
      setEditMode(false);
      setCurrentNotif(null);
      setShowNotifModal(false);
      
      alert("✅ Notification saved successfully!");
      
    } catch (error) {
      console.error("❌ Error saving notification:", error);
      alert("Error saving notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const confirmDelete = async () => {
    if (!notifToDelete) return;
    setLoading(true);
    try {
      console.log("🗑️ Deleting notification:", notifToDelete.id);
      await deleteDoc(doc(db, "notifications", notifToDelete.id));
      console.log("✅ Notification deleted");
      setNotifToDelete(null);
      setShowDeleteModal(false);
      alert("🗑️ Notification deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
      alert("Error deleting notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Archive/Restore notification
  const confirmArchive = async () => {
    if (!notifToArchive) return;
    setLoading(true);
    try {
      console.log("📦 Archiving/Restoring notification:", notifToArchive.id);
      const notifRef = doc(db, "notifications", notifToArchive.id);
      await updateDoc(notifRef, { archived: !notifToArchive.archived });
      console.log("✅ Notification archive status toggled");
      setNotifToArchive(null);
      setShowArchiveModal(false);
      alert(notifToArchive.archived ? "♻️ Notification restored!" : "📦 Notification archived!");
    } catch (error) {
      console.error("❌ Error archiving notification:", error);
      alert("Error archiving notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle pin
  const togglePin = async (id) => {
    setLoading(true);
    try {
      const notif = notifications.find((n) => n.id === id);
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { pinned: !notif.pinned });
      console.log("📌 Pin toggled for notification:", id);
    } catch (error) {
      console.error("❌ Error toggling pin:", error);
      alert("Error updating notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const openNewNotifModal = () => {
    setEditMode(false);
    setNewNotif({ title: "", message: "", category: "" });
    setCurrentNotif(null);
    setShowNotifModal(true);
  };

  const handleEditClick = (notif) => {
    setEditMode(true);
    setCurrentNotif(notif);
    setNewNotif({ title: notif.title, message: notif.message, category: notif.category });
    setShowNotifModal(true);
  };

  const handleDeleteClick = (notif) => {
    setNotifToDelete(notif);
    setShowDeleteModal(true);
  };

  const handleArchiveClick = (notif) => {
    setNotifToArchive(notif);
    setShowArchiveModal(true);
  };

  const handleViewMessage = (notif) => {
    setViewMessageNotif(notif);
    setShowMessageModal(true);
  };

  const getCategoryBadgeClass = (category) => {
    const classes = { 
      System: "bg-primary", 
      Policy: "bg-success", 
      Event: "bg-info", 
      Urgent: "bg-danger", 
      General: "bg-secondary" 
    };
    return classes[category] || "bg-secondary";
  };

  const filteredNotifications = notifications
    .filter((notif) => (activeTab === "active" ? !notif.archived : notif.archived))
    .filter((notif) => (notif.title + notif.message + notif.category).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned || new Date(b.date) - new Date(a.date));

  const truncateMessage = (msg, max = 60) => (msg.length > max ? msg.slice(0, max) + "..." : msg);

  return (
    <div className="d-flex vh-100 bg-light">
      <NavbarAdmin />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarAdmin />
        <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: "#f3f4f6" }}>
          <div className="container-fluid">
            {/* Header */}
            <div className="card border-0 rounded-4 text-start shadow-sm text-white d-flex flex-row justify-content-between align-items-center p-4 mb-4 animate__animated animate__fadeInDown" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
              <div>
                <h3 className="fw-bold mb-1">
                  Notifications Management 
                  <i className="bi bi-megaphone me-2"></i>
                </h3>
                <p className="text-light mb-0">Post and manage notifications for all users.</p>
                <small className="text-light opacity-75">
                  Total Notifications: {notifications.length} | 
                  Active: {notifications.filter(n => !n.archived).length} | 
                  Archived: {notifications.filter(n => n.archived).length}
                </small>
              </div>
              {activeTab === "active" && (
                <button className="btn btn-light text-success fw-semibold shadow-sm" onClick={openNewNotifModal} disabled={loading}>
                  <i className="bi bi-plus-circle me-2"></i>{loading ? "Processing..." : "Post Notification"}
                </button>
              )}
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills mb-4 animate__animated animate__fadeIn">
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${activeTab === "active" ? "active bg-success text-white" : "text-success border border-success"}`}
                  onClick={() => setActiveTab("active")}
                  disabled={loading}
                >
                  <i className="bi bi-bell me-2"></i>Active ({notifications.filter((n) => !n.archived).length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "archived" ? "active bg-secondary text-white" : "text-secondary border border-secondary"}`}
                  onClick={() => setActiveTab("archived")}
                  disabled={loading}
                >
                  <i className="bi bi-archive me-2"></i>Archived ({notifications.filter((n) => n.archived).length})
                </button>
              </li>
            </ul>

            {/* Search */}
            <div className="row mb-4 animate__animated animate__fadeIn">
              <div className="col-md-6">
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0" 
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
              <div className="text-center mb-4 animate__animated animate__fadeIn">
                <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
                <p className="text-muted mt-2">Processing...</p>
              </div>
            )}

            {/* Notifications Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
              {filteredNotifications.length === 0 ? (
                <div className="col-12 text-center py-5 animate__animated animate__fadeIn">
                  <i className="bi bi-bell-slash display-5 text-muted mb-3"></i>
                  <h5 className="text-muted">No {activeTab} notifications found</h5>
                </div>
              ) : (
                filteredNotifications.map((notif, index) => (
                  <div className="col animate__animated animate__fadeInUp" key={notif.id} style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className={`card h-100 shadow-sm rounded-3 p-3 ${notif.archived ? "bg-light" : "bg-white"} hover-border-line`}>
                      <div className="card-body d-flex flex-column h-100 p-0">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0 text-truncate me-2" style={{ fontSize: "0.9rem", maxWidth: "70%" }}>
                            {notif.pinned && <i className="bi bi-pin-angle-fill text-warning me-1"></i>}
                            {notif.title}
                          </h6>
                          <span className={`badge ${getCategoryBadgeClass(notif.category)}`} style={{ fontSize: "0.7rem" }}>{notif.category}</span>
                        </div>
                        <p
                          className="text-muted small flex-grow-1 mb-2"
                          style={{ cursor: notif.message.length > 60 ? "pointer" : "default", fontSize: "0.8rem", lineHeight: "1.4", minHeight: "40px" }}
                          onClick={() => notif.message.length > 60 && handleViewMessage(notif)}
                        >
                          {truncateMessage(notif.message, 60)}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <small className="text-secondary" style={{ fontSize: "0.75rem" }}>
                            <i className="bi bi-clock me-1"></i>
                            {new Date(notif.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </small>
                          <div className="d-flex gap-1">
                            {activeTab === "active" ? (
                              <>
                                <button className={`btn btn-sm ${notif.pinned ? "btn-warning" : "btn-outline-warning"}`} onClick={() => togglePin(notif.id)} disabled={loading}>
                                  <i className={`bi ${notif.pinned ? "bi-pin-fill" : "bi-pin"}`} style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleArchiveClick(notif)} disabled={loading}>
                                  <i className="bi bi-archive" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(notif)} disabled={loading}>
                                  <i className="bi bi-pencil" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(notif)} disabled={loading}>
                                  <i className="bi bi-trash" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                              </>
                            ) : (
                              <>
                                <button className="btn btn-sm btn-outline-success" onClick={() => handleArchiveClick(notif)} disabled={loading}>
                                  <i className="bi bi-arrow-counterclockwise" style={{ fontSize: "0.7rem" }}></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(notif)} disabled={loading}>
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
      {showNotifModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className={`bi ${editMode ? "bi-pencil-square" : "bi-megaphone"} me-2`}></i>
                  {editMode ? "Edit Notification" : "Post New Notification"}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowNotifModal(false)}
                  disabled={loading}
                ></button>
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
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => setShowNotifModal(false)} 
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success" 
                    disabled={loading}
                  >
                    {loading ? "Processing..." : (editMode ? "Save Changes" : "Post Notification")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && notifToDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Confirm Delete
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body text-center">
                <i className="bi bi-exclamation-triangle-fill text-warning display-5 mb-3"></i>
                <h6>Are you sure you want to delete this notification?</h6>
                <p className="text-muted mt-2 mb-0"><strong>{notifToDelete.title}</strong></p>
                <small className="text-muted">This action cannot be undone.</small>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowDeleteModal(false)} 
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmDelete} 
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive/Restore Confirmation Modal */}
      {showArchiveModal && notifToArchive && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-secondary">
                  <i className="bi bi-archive me-2"></i>
                  {notifToArchive.archived ? "Restore Notification" : "Archive Notification"}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowArchiveModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body text-center">
                <i className="bi bi-archive-fill text-secondary display-5 mb-3"></i>
                <h6>{notifToArchive.archived ? "Do you want to restore this notification?" : "Are you sure you want to archive this notification?"}</h6>
                <p className="text-muted mt-2 mb-0"><strong>{notifToArchive.title}</strong></p>
                <small className="text-muted">
                  {notifToArchive.archived 
                    ? "This notification will become active again." 
                    : "You can restore this notification anytime."}
                </small>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowArchiveModal(false)} 
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={confirmArchive} 
                  disabled={loading}
                >
                  {loading ? "Processing..." : (notifToArchive.archived ? "Restore" : "Archive")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Message View Modal */}
      {showMessageModal && viewMessageNotif && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-envelope-open me-2"></i>
                  {viewMessageNotif.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowMessageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <span className={`badge ${getCategoryBadgeClass(viewMessageNotif.category)}`}>
                    {viewMessageNotif.category}
                  </span>
                  <small className="text-muted ms-2">
                    <i className="bi bi-clock me-1"></i>
                    {new Date(viewMessageNotif.date).toLocaleString()}
                  </small>
                </div>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {viewMessageNotif.message}
                </p>
              </div>
              <div className="modal-footer border-0">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowMessageModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        .hover-border-line {
          position: relative;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .hover-border-line:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
          border-color: #10b981;
        }
        .btn {
          transition: all 0.3s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
        .nav-link {
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;