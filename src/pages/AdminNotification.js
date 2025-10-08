import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "The system will be down at 10 PM tonight for scheduled maintenance. All services will be temporarily unavailable during this period. We expect the maintenance to last approximately 2 hours. Please save your work and log out before the maintenance window begins.",
      category: "System",
      date: new Date().toLocaleString(),
      pinned: false,
      archived: false,
    },
    {
      id: 2,
      title: "New Policy",
      message: "Please review the updated waste segregation policy. The new guidelines include improved recycling procedures and updated bin color codes. All staff must complete the mandatory training by the end of the month.",
      category: "Policy",
      date: new Date().toLocaleString(),
      pinned: true,
      archived: false,
    },
    {
      id: 3,
      title: "Old Event",
      message: "This is an archived notification from previous event. The annual waste management conference was successfully completed last month with record attendance from industry professionals.",
      category: "Event",
      date: new Date().toLocaleString(),
      pinned: false,
      archived: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);
  const [newNotif, setNewNotif] = useState({ title: "", message: "", category: "" });
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifToDelete, setNotifToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'archived'
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  // Filter notifications based on active tab
  const filteredNotifications = notifications
    .filter(notif => 
      activeTab === "active" ? !notif.archived : notif.archived
    )
    .filter((n) =>
      (n.title + n.message + n.category).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.pinned - a.pinned || new Date(b.date) - new Date(a.date));

  // Save Notification
  const handleSaveNotification = (e) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message || !newNotif.category) return;

    if (editMode && currentNotif) {
      setNotifications(
        notifications.map((n) =>
          n.id === currentNotif.id
            ? { ...n, ...newNotif, date: new Date().toLocaleString() }
            : n
        )
      );
    } else {
      const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
      const notif = {
        id: newId,
        ...newNotif,
        date: new Date().toLocaleString(),
        pinned: false,
        archived: false,
      };
      setNotifications([notif, ...notifications]);
    }

    setNewNotif({ title: "", message: "", category: "" });
    setCurrentNotif(null);
    setEditMode(false);
    setShowModal(false);
  };

  // Delete Notification
  const handleDeleteClick = (notif) => {
    setNotifToDelete(notif);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    setNotifications(notifications.filter((n) => n.id !== notifToDelete.id));
    setShowDeleteConfirm(false);
    setNotifToDelete(null);
  };

  // Edit Notification
  const handleEditClick = (notif) => {
    setCurrentNotif(notif);
    setNewNotif({
      title: notif.title,
      message: notif.message,
      category: notif.category,
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Toggle Pin
  const togglePin = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );
  };

  // Archive/Restore Notification
  const toggleArchive = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, archived: !n.archived } : n
      )
    );
  };

  // Show notification details
  const handleCardClick = (notif) => {
    setSelectedNotif(notif);
    setShowDetailsModal(true);
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

  // Get counts for tabs
  const activeCount = notifications.filter(n => !n.archived).length;
  const archivedCount = notifications.filter(n => n.archived).length;

  return (
    <div className="d-flex">
      <NavbarAdmin />

      {/* Main Content with proper margin */}
      <div 
        className="flex-grow-1 p-4 bg-light" 
        style={{ 
          marginLeft: "250px",
          minHeight: "100vh",
          width: "calc(100% - 250px)"
        }}
      >
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex justify-content-between text-start mb-4">
            <div>
              <h2 className="fw-bold text-dark">📢 Notifications Management</h2>
              <p className="text-muted mb-0">Create and manage system notifications</p>
            </div>
            {activeTab === "active" && (
              <button 
                className="btn btn-success"
                onClick={() => { setShowModal(true); setEditMode(false); }}
              >
                <i className="bi bi-megaphone me-2"></i>
                Post Notification
              </button>
            )}
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "active" ? "active" : ""}`}
                onClick={() => setActiveTab("active")}
              >
                <i className="bi bi-bell me-2"></i>
                Active Notifications
                {activeCount > 0 && (
                  <span className="badge bg-primary ms-2">{activeCount}</span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "archived" ? "active" : ""}`}
                onClick={() => setActiveTab("archived")}
              >
                <i className="bi bi-archive me-2"></i>
                Archived Notifications
                {archivedCount > 0 && (
                  <span className="badge bg-secondary ms-2">{archivedCount}</span>
                )}
              </button>
            </li>
          </ul>

          {/* Search */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Search ${activeTab} notifications...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notification Cards */}
          <div className="row g-3">
            {filteredNotifications.length === 0 ? (
              <div className="col-12">
                <div className="card text-center py-5">
                  <div className="card-body">
                    <i className={`bi ${activeTab === "active" ? "bi-bell" : "bi-archive"} display-4 text-muted mb-3`}></i>
                    <h5 className="text-muted">
                      No {activeTab} notifications found
                    </h5>
                    <p className="text-muted">
                      {activeTab === "active" 
                        ? "Create your first notification to get started" 
                        : "No notifications have been archived yet"
                      }
                    </p>
                    {activeTab === "active" && (
                      <button 
                        className="btn btn-success mt-2"
                        onClick={() => setShowModal(true)}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Notification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div key={notif.id} className="col-md-6 col-lg-4">
                  <div 
                    className={`card h-100 shadow-sm ${notif.archived ? "border-secondary bg-light" : "border-success"} cursor-pointer`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCardClick(notif)}
                  >
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0 me-2">
                          {notif.title}
                          {notif.pinned && !notif.archived && (
                            <span className="badge bg-warning ms-2">
                              <i className="bi bi-pin-angle me-1"></i>
                              Pinned
                            </span>
                          )}
                        </h5>
                        <span className={`badge ${getCategoryBadgeClass(notif.category)}`}>
                          {notif.category}
                        </span>
                      </div>
                      <p className="card-text flex-grow-1 text-truncate">
                        {notif.message}
                      </p>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        Posted on {notif.date}
                        {notif.archived && (
                          <span className="badge bg-secondary ms-2">Archived</span>
                        )}
                      </small>
                      <div className="mt-3 d-flex justify-content-end gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        {activeTab === "active" ? (
                          <>
                            <button 
                              className={`btn btn-sm ${notif.pinned ? 'btn-warning' : 'btn-outline-warning'}`}
                              onClick={() => togglePin(notif.id)}
                            >
                              <i className={`bi ${notif.pinned ? 'bi-pin-fill' : 'bi-pin'} me-1`}></i>
                              {notif.pinned ? "Unpin" : "Pin"}
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => toggleArchive(notif.id)}
                            >
                              <i className="bi bi-archive me-1"></i>
                              Archive
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditClick(notif)}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(notif)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => toggleArchive(notif.id)}
                            >
                              <i className="bi bi-arrow-counterclockwise me-1"></i>
                              Restore
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteClick(notif)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details Modal - Fixed Centering */}
        {showDetailsModal && selectedNotif && (
          <div 
            className="modal show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <div className="w-100">
                    <h5 className="modal-title fw-bold mb-2">{selectedNotif.title}</h5>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className={`badge ${getCategoryBadgeClass(selectedNotif.category)}`}>
                        {selectedNotif.category}
                      </span>
                      {selectedNotif.pinned && !selectedNotif.archived && (
                        <span className="badge bg-warning">
                          <i className="bi bi-pin-angle me-1"></i>
                          Pinned
                        </span>
                      )}
                      {selectedNotif.archived && (
                        <span className="badge bg-secondary">Archived</span>
                      )}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDetailsModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <h6 className="text-muted">Message:</h6>
                    <p className="mb-0" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                      {selectedNotif.message}
                    </p>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <h6 className="text-muted">Posted Date:</h6>
                      <p className="mb-0">
                        <i className="bi bi-clock me-2"></i>
                        {selectedNotif.date}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-muted">Status:</h6>
                      <div className="d-flex align-items-center gap-2">
                        {selectedNotif.archived ? (
                          <span className="badge bg-secondary">Archived</span>
                        ) : (
                          <span className="badge bg-success">Active</span>
                        )}
                        {selectedNotif.pinned && !selectedNotif.archived && (
                          <span className="badge bg-warning">Pinned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Close
                  </button>
                  {!selectedNotif.archived && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleEditClick(selectedNotif);
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit Notification
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add/Edit Notification */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editMode ? "Edit Notification" : "Post New Notification"}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSaveNotification}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Notification Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter notification title"
                        value={newNotif.title}
                        onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter notification message"
                        value={newNotif.message}
                        onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={newNotif.category}
                        onChange={(e) => setNewNotif({ ...newNotif, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="System">System</option>
                        <option value="Policy">Policy</option>
                        <option value="Event">Event</option>
                        <option value="Urgent">Urgent</option>
                        <option value="General">General</option>
                      </select>
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
                      {editMode ? "Update Notification" : "Post Notification"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow">
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
                    Are you sure you want to delete <strong>{notifToDelete?.title}</strong>?
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={confirmDelete}>
                    <i className="bi bi-trash me-1"></i>
                    Delete Notification
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

export default AdminNotifications;