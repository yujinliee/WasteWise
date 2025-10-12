import React, { useState, useEffect } from "react";
import NavbarUser from "../Components/NavbarUser";
import TopNavbarUser from "../Components/TopNavbarUser";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../Components/firebase";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // ✅ Real-time Firebase listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort by date (newest first) and filter for user-relevant notifications
      const sortedNotifs = notifs
        .filter(notif => !notif.archived) // Only show non-archived
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setNotifications(sortedNotifs);
      setLoading(false);
    });

    return () => unsub(); // Clean up listener
  }, []);

  // ✅ Mark as read in Firebase
  const markAsRead = async (id) => {
    try {
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, {
        read: true
      });
    } catch (error) {
      console.error("Error marking as read:", error);
      alert("Error updating notification. Please try again.");
    }
  };

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.read);
      const updatePromises = unreadNotifications.map(notif => 
        updateDoc(doc(db, "notifications", notif.id), { read: true })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error marking all as read:", error);
      alert("Error updating notifications. Please try again.");
    }
  };

  // ✅ Delete notification from Firebase
  const deleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteDoc(doc(db, "notifications", id));
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert("Error deleting notification. Please try again.");
      }
    }
  };

  // ✅ Filter notifications based on search and category
  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || notif.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ Get unread count
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // ✅ Get category badge class
  const getCategoryBadgeClass = (category) => {
    const classes = {
      System: "bg-primary",
      Policy: "bg-success",
      Event: "bg-info",
      Urgent: "bg-danger",
      General: "bg-secondary",
    };
    return classes[category] || "bg-secondary";
  };

  if (loading) {
    return (
      <div className="d-flex vh-100 bg-light">
        <NavbarUser />
        <div className="flex-grow-1 d-flex flex-column">
          <TopNavbarUser />
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border text-success mb-3" role="status"></div>
              <p className="text-muted">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-light">
      <NavbarUser />
      
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarUser />
        
        <div className="flex-grow-1 p-4 overflow-auto">
          <div className="container-fluid">
            {/* Header */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                      <i className="bi bi-bell fs-1 text-primary"></i>
                    </div>
                    <div>
                      <h1 className="fw-bold mb-1">Notifications</h1>
                      <p className="text-muted mb-0">
                        Stay updated with system alerts and announcements
                      </p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      className="btn btn-outline-success"
                      onClick={markAllAsRead}
                    >
                      <i className="bi bi-check-all me-2"></i>
                      Mark All as Read
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats and Filters */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="d-flex gap-3 align-items-center">
                  <div className="bg-white p-3 rounded-3 shadow-sm">
                    <small className="text-muted d-block">Total</small>
                    <span className="fw-bold fs-5">{notifications.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-3 shadow-sm">
                    <small className="text-muted d-block">Unread</small>
                    <span className="fw-bold fs-5 text-warning">{unreadCount}</span>
                  </div>
                  <div className="bg-white p-3 rounded-3 shadow-sm">
                    <small className="text-muted d-block">Categories</small>
                    <span className="fw-bold fs-5 text-info">
                      {[...new Set(notifications.map(n => n.category))].length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="System">System</option>
                  <option value="Policy">Policy</option>
                  <option value="Event">Event</option>
                  <option value="Urgent">Urgent</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="row g-3">
              {filteredNotifications.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <div className="bg-white rounded-4 p-5 shadow-sm">
                    <i className="bi bi-bell-slash display-1 text-muted mb-3"></i>
                    <h4 className="text-muted mb-3">No notifications found</h4>
                    <p className="text-muted mb-4">
                      {searchTerm || filterCategory !== "all" 
                        ? "Try adjusting your search or filter criteria" 
                        : "You're all caught up! No notifications at the moment."
                      }
                    </p>
                    {(searchTerm || filterCategory !== "all") && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterCategory("all");
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div className="col-12" key={notif.id}>
                    <div
                      className={`card border-0 shadow-sm h-100 notification-card ${
                        notif.read ? "bg-light" : "bg-white border-start border-3 border-warning"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedNotification(notif)}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center gap-3">
                            {!notif.read && (
                              <span className="badge bg-warning">New</span>
                            )}
                            <h5 className="fw-bold mb-0">{notif.title}</h5>
                          </div>
                          <span className={`badge ${getCategoryBadgeClass(notif.category)}`}>
                            {notif.category}
                          </span>
                        </div>

                        <p className="text-muted mb-3">{notif.message}</p>

                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {new Date(notif.date).toLocaleString()}
                          </small>
                          
                          <div className="d-flex gap-2">
                            {!notif.read && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notif.id);
                                }}
                              >
                                <i className="bi bi-check-lg me-1"></i>
                                Mark Read
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notif.id);
                              }}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
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

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 shadow-lg border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {selectedNotification.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedNotification(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <span className={`badge ${getCategoryBadgeClass(selectedNotification.category)} me-2`}>
                    {selectedNotification.category}
                  </span>
                  {!selectedNotification.read && (
                    <span className="badge bg-warning">Unread</span>
                  )}
                </div>
                
                <p className="mb-4">{selectedNotification.message}</p>
                
                <div className="d-flex justify-content-between align-items-center text-muted">
                  <small>
                    <i className="bi bi-clock me-1"></i>
                    {new Date(selectedNotification.date).toLocaleString()}
                  </small>
                  {!selectedNotification.read && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        markAsRead(selectedNotification.id);
                        setSelectedNotification(null);
                      }}
                    >
                      <i className="bi bi-check-lg me-1"></i>
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .notification-card {
          transition: all 0.3s ease;
        }
        
        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default UserNotifications;