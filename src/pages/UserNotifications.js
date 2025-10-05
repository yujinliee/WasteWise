import React, { useState } from "react";
import NavbarUser from "../Components/NavbarUser";
import "../styles/UserNotifications.css";

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
    <div className="usernotifications-container">
      <NavbarUser />
      <main className="usernotifications-main">
        <header className="header-section">
          <h1>Notifications</h1>
        </header>

        {notifications.length === 0 ? (
          <p className="empty-state">You have no notifications 🎉</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notif-card ${notif.read ? "read" : "unread"}`}
              >
                <div className="notif-details">
                  <span className={`category-badge ${notif.category}`}>
                    {notif.category}
                  </span>
                  <h3>{notif.title}</h3>
                  <p>{notif.message}</p>
                  <span className="notif-date">{notif.date}</span>
                </div>
                <div className="notif-actions">
                  {!notif.read && (
                    <button
                      className="mark-btn"
                      onClick={() => markAsRead(notif.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => deleteNotification(notif.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserNotifications;
