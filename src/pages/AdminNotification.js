import React, { useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import "../styles/AdminNotification.css";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "The system will be down at 10 PM tonight.",
      category: "System",
      date: new Date().toLocaleString(),
      pinned: false,
    },
    {
      id: 2,
      title: "New Policy",
      message: "Please review the updated waste segregation policy.",
      category: "Policy",
      date: new Date().toLocaleString(),
      pinned: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false); // ✅ for update mode
  const [currentNotif, setCurrentNotif] = useState(null);
  const [newNotif, setNewNotif] = useState({ title: "", message: "", category: "" });

  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifToDelete, setNotifToDelete] = useState(null);

  // Add or Update Notification
  const handleSaveNotification = (e) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message || !newNotif.category) return;

    if (editMode && currentNotif) {
      // ✅ Update existing notification
      setNotifications(
        notifications.map((n) =>
          n.id === currentNotif.id ? { ...n, ...newNotif, date: new Date().toLocaleString() } : n
        )
      );
    } else {
      // ✅ Add new notification
      const newId = notifications.length + 1;
      const notif = {
        id: newId,
        ...newNotif,
        date: new Date().toLocaleString(),
        pinned: false,
      };
      setNotifications([notif, ...notifications]); // latest on top
    }

    // Reset state
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

  // Filter notifications
  const filteredNotifications = notifications
    .filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.pinned - a.pinned || new Date(b.date) - new Date(a.date));

  return (
    <div className="adminnotifications-container">
      <NavbarAdmin />

      <div className="adminnotifications-main">
        <div className="header-section">
          <h1>📢 Notifications Management</h1>
          <button className="add-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
            ➕ Post Notification
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Notification List */}
        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <p className="empty-state">No notifications found.</p>
          ) : (
            filteredNotifications.map((notif) => (
              <div key={notif.id} className="notif-card">
                <div className="notif-details">
                  <h3>
                    {notif.title} {notif.pinned && <span className="pinned">📌</span>}
                    <span className={`category-badge ${notif.category.toLowerCase()}`}>
                      {notif.category}
                    </span>
                  </h3>
                  <p>{notif.message}</p>
                  <small className="notif-date">Posted on {notif.date}</small>
                </div>
                <div className="notif-actions">
                  <button className="pin-btn" onClick={() => togglePin(notif.id)}>
                    {notif.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button className="edit-btn" onClick={() => handleEditClick(notif)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(notif)}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Notification Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{editMode ? "Edit Notification" : "Post New Notification"}</h2>
              <form onSubmit={handleSaveNotification} className="modal-form">
                <input
                  type="text"
                  placeholder="Notification Title"
                  value={newNotif.title}
                  onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                />
                <textarea
                  placeholder="Notification Message"
                  value={newNotif.message}
                  onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                ></textarea>
                <select
                  value={newNotif.category}
                  onChange={(e) => setNewNotif({ ...newNotif, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="System">System</option>
                  <option value="Policy">Policy</option>
                  <option value="Event">Event</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editMode ? "Update" : "Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirm Delete</h2>
              <p>
                Are you sure you want to delete{" "}
                <strong>{notifToDelete?.title}</strong>?
              </p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
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

export default AdminNotifications;
