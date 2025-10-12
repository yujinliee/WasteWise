import React from "react";
import { useSwipeable } from "react-swipeable";

const NotificationItem = ({ notification, markAsRead, archiveNotification, deleteNotification, isSwiped, setSwiped }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => setSwiped(notification.id),
    onSwipedRight: () => setSwiped(null),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className={`notification-item border-bottom ${notification.read ? "" : "unread-notification"}`}
      style={{
        cursor: "pointer",
        backgroundColor: "#fff",
        padding: "16px 20px",
        position: "relative",
        overflow: "hidden",
        transition: "background-color 0.2s ease",
      }}
      onClick={() => !notification.read && markAsRead(notification.id)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          transition: "transform 0.3s ease-out",
          transform: isSwiped === notification.id ? "translateX(-130px)" : "translateX(0)",
        }}
      >
        {/* Avatar */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
          style={{
            width: 40,
            height: 40,
            backgroundColor: "#45B7D1",
            fontSize: "0.95rem",
            marginRight: "8px",
            flexShrink: 0,
          }}
        >
          {notification.author ? notification.author[0] : "S"}
        </div>

        {/* Content */}
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="mb-1">
            <span className="fw-bold text-dark">{notification.author || "System"}</span>
            <span className="text-dark ms-1">{notification.action || notification.title}</span>
          </div>
          <p className="text-secondary mb-0" style={{ fontSize: "0.85rem", lineHeight: "1.5" }}>
            {notification.message}
          </p>
        </div>
      </div>

      {/* Swipe buttons */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          display: "flex",
          gap: 4,
          transform: isSwiped === notification.id ? "translateX(0)" : "translateX(130px)",
          transition: "transform 0.3s ease-out",
        }}
      >
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            archiveNotification(notification.id);
            setSwiped(null);
          }}
          style={{ width: 60 }}
        >
          Archive
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => {
            deleteNotification(notification.id);
            setSwiped(null);
          }}
          style={{ width: 60 }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
