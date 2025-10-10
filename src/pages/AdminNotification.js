import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "The system will be down at 10 PM tonight for scheduled maintenance.",
      category: "System",
      date: new Date().toLocaleString(),
      pinned: false,
      archived: false,
    },
    {
      id: 2,
      title: "New Policy",
      message: "Please review the updated waste segregation policy.",
      category: "Policy",
      date: new Date().toLocaleString(),
      pinned: true,
      archived: false,
    },
    {
      id: 3,
      title: "Old Event",
      message: "This is an archived notification from previous event.",
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
  const [activeTab, setActiveTab] = useState("active");

  // Filter notifications based on active tab
  const filteredNotifications = notifications
    .filter((notif) => (activeTab === "active" ? !notif.archived : notif.archived))
    .filter((notif) =>
      (notif.title + notif.message + notif.category).toLowerCase().includes(search.toLowerCase())
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
            overflow: "hidden",
          }}
        >
          {/* Scrollable White Section */}
          <div
            className="bg-white rounded shadow p-4"
            style={{
              height: "100%",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">Notifications Management 📢</h2>
                <p className="text-muted mb-0">
                  Create and manage system notifications for users
                </p>
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
                  Active Notifications ({activeCount})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "archived" ? "active" : ""}`}
                  onClick={() => setActiveTab("archived")}
                >
                  <i className="bi bi-archive me-2"></i>
                  Archived Notifications ({archivedCount})
                </button>
              </li>
            </ul>

            {/* Search Bar */}
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
                  <div className="text-center py-5">
                    <i className="bi bi-bell display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">No {activeTab} notifications found</h5>
                    <p className="text-muted">
                      {activeTab === "active" 
                        ? "No active notifications to display" 
                        : "No notifications have been archived yet"
                      }
                    </p>
                  </div>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div key={notif.id} className="col-md-6 col-lg-4">
                    <div className={`card h-100 shadow-sm ${notif.archived ? "border-secondary bg-light" : "border-success"}`}>
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0 me-2">
                            {notif.title}
                            {notif.pinned && !notif.archived && (
                              <span className="badge bg-warning ms-2">
                                <i className="bi bi-pin-angle me-1"></i>
                                Pinned
                              </span>
                            )}
                          </h6>
                          <span className={`badge ${getCategoryBadgeClass(notif.category)}`}>
                            {notif.category}
                          </span>
                        </div>
                        <p className="card-text flex-grow-1 text-truncate">
                          {notif.message}
                        </p>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          {notif.date}
                          {notif.archived && (
                            <span className="badge bg-secondary ms-2">Archived</span>
                          )}
                        </small>
                        <div className="mt-3 d-flex justify-content-end gap-2 flex-wrap">
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
                                className="btn btn-sm btn-outline-success"
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
        </div>

        {/* Add/Edit Notification Modal */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ width: "500px" }}>
              <h5 className="mb-3">
                {editMode ? "Edit Notification" : "Post New Notification"}
              </h5>
              <form onSubmit={handleSaveNotification}>
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
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editMode ? "Update Notification" : "Post Notification"}
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
                Are you sure you want to delete <strong>{notifToDelete?.title}</strong>?
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
                  Delete Notification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;