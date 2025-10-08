import React, { useState } from "react";
import NavbarUser from "../Components/NavbarUser";
import "bootstrap/dist/css/bootstrap.min.css";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Update",
      message: "The system will undergo maintenance tonight at 11 PM.",
      category: "system",
      date: "2025-09-23",
      read: false,
    },
    {
      id: 2,
      title: "Bin Reminder",
      message: "Your assigned bin is almost full. Please check.",
      category: "alert",
      date: "2025-09-22",
      read: true,
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState(null);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(notifications.filter((notif) => notif.id !== id));
    }
  };

  return (
    <div className="d-flex">
      <NavbarUser />

      <main className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold text-success">Notifications</h1>
            <span className="text-muted">{notifications.length} total</span>
          </div>

          {/* Empty State */}
          {notifications.length === 0 ? (
            <div className="alert alert-success text-center" role="alert">
              🎉 You have no notifications!
            </div>
          ) : (
            <div className="row g-3">
              {notifications.map((notif) => (
                <div className="col-12" key={notif.id}>
                  <div
                    className={`card shadow-sm border-0 ${
                      notif.read ? "bg-light" : "bg-white"
                    }`}
                    onClick={() => setSelectedNotification(notif)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span
                          className={`badge ${
                            notif.category === "system"
                              ? "bg-primary"
                              : notif.category === "alert"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {notif.category.toUpperCase()}
                        </span>
                        <small className="text-muted">{notif.date}</small>
                      </div>

                      <h5 className="fw-bold mb-1">{notif.title}</h5>
                      <p className="mb-3 text-muted">{notif.message}</p>

                      <div className="d-flex justify-content-end gap-2">
                        {!notif.read && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                        >
                          Delete
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification Detail Modal */}
        {selectedNotification && (
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{
              display: "block",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              role="document"
            >
              <div className="modal-content shadow-lg border-0">
                <div className="modal-header">
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
                  <p className="text-muted">{selectedNotification.message}</p>
                  <div className="d-flex justify-content-between">
                    <span
                      className={`badge ${
                        selectedNotification.category === "system"
                          ? "bg-primary"
                          : selectedNotification.category === "alert"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {selectedNotification.category.toUpperCase()}
                    </span>
                    <small className="text-muted">
                      {selectedNotification.date}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserNotifications;
