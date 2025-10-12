import React, { useEffect, useRef, useState } from "react";
import { useUser } from "./UserContext";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TopNavbarUser = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmAction, setConfirmAction] = useState(null); // { type, notif }
  const [viewNotif, setViewNotif] = useState(null);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const modalRef = useRef(null);

  // ------------------- Hooks -------------------

  // Fetch notifications (always call the hook)
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const notifs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((n) => !n.deletedBy?.includes(user.uid));

      const sortedNotifs = notifs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(sortedNotifs);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  // Handle outside clicks and Esc key
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking modal content
      if (e.target.closest(".modal-content")) return;

      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (confirmAction) setConfirmAction(null);
        else if (viewNotif) setViewNotif(null);
        else {
          setShowNotif(false);
          setShowProfile(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [confirmAction, viewNotif]);

  // ------------------- Handlers -------------------

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const markAsRead = async (notif) => {
    if (!user || notif.readBy?.includes(user.uid)) return;
    try {
      await updateDoc(doc(db, "notifications", notif.id), {
        readBy: [...(notif.readBy || []), user.uid],
      });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const archiveNotification = (notif) => setConfirmAction({ type: "archive", notif });
  const restoreNotification = (notif) => setConfirmAction({ type: "restore", notif });
  const deleteNotification = (notif) => setConfirmAction({ type: "delete", notif });

  const confirmActionHandler = async () => {
    if (!user || !confirmAction) return;
    const { type, notif } = confirmAction;
    try {
      const notifRefDoc = doc(db, "notifications", notif.id);
      if (type === "archive") {
        await updateDoc(notifRefDoc, {
          archivedBy: [...(notif.archivedBy || []), user.uid],
          readBy: [...(notif.readBy || []), user.uid],
        });
      } else if (type === "restore") {
        const updatedArchivedBy = (notif.archivedBy || []).filter((uid) => uid !== user.uid);
        await updateDoc(notifRefDoc, { archivedBy: updatedArchivedBy });
      } else if (type === "delete") {
        await updateDoc(notifRefDoc, { deletedBy: [...(notif.deletedBy || []), user.uid] });
      }
    } catch (err) {
      console.error(`Error performing ${type}:`, err);
    } finally {
      setConfirmAction(null);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const unread = notifications.filter(
      (n) => !n.readBy?.includes(user.uid) && !n.archivedBy?.includes(user.uid)
    );
    await Promise.all(
      unread.map((n) =>
        updateDoc(doc(db, "notifications", n.id), {
          readBy: [...(n.readBy || []), user.uid],
        })
      )
    );
  };

  // ------------------- Derived Data -------------------

  const filteredNotifications = notifications.filter((n) => {
    if (!user) return false;
    if (activeTab === "all") return !n.archivedBy?.includes(user.uid);
    if (activeTab === "archived") return n.archivedBy?.includes(user.uid);
    return true;
  });

  const unreadCount = notifications.filter(
    (n) => user && !n.readBy?.includes(user.uid) && !n.archivedBy?.includes(user.uid)
  ).length;

  const getBadgeClass = (cat) => ({
    System: "bg-primary",
    Policy: "bg-success",
    Event: "bg-info",
    Urgent: "bg-danger",
    General: "bg-secondary",
  }[cat] || "bg-secondary");

  // ------------------- Render -------------------

  if (!user) {
    return (
      <nav className="navbar navbar-expand-lg border-bottom px-4 py-3">
        <div className="container-fluid">Loading user...</div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom px-4 py-3" style={{ background: "#f8f8f8", minHeight: 64 }}>
        <div className="container-fluid">
          {/* Search */}
          <div className="d-flex align-items-center" style={{ flex: 1, maxWidth: 400 }}>
            <form className="w-100" onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search bins, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderColor: "#e8f5e8" }}
                />
              </div>
            </form>
          </div>

          {/* Right buttons */}
          <div className="d-flex align-items-center ms-auto gap-3 position-relative">
            {/* Notifications */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                className="btn position-relative"
                style={{
                  background: "#0D4715",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotif((s) => !s);
                  setShowProfile(false);
                }}
              >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: 11 }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotif && (
                <div style={{ position: "absolute", right: 0, top: 52, width: 420, maxWidth: "90vw", zIndex: 1200 }}>
                  <div className="card shadow-lg border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
                    <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 px-4">
                      <h5 className="mb-0 fw-bold text-dark">Notifications</h5>
                      {unreadCount > 0 && (
                        <button className="btn btn-sm btn-outline-success" style={{ fontSize: "0.8rem" }} onClick={markAllAsRead}>
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Tabs */}
                    <div className="card-header bg-white py-2 px-4">
                      <div className="d-flex gap-4">
                        {["all", "archived"].map((tab) => (
                          <button
                            key={tab}
                            className={`btn btn-link p-0 ${activeTab === tab ? "fw-bold" : ""}`}
                            style={{
                              color: activeTab === tab ? "#0D4715" : "#6c757d",
                              borderBottom: activeTab === tab ? "2px solid #0D4715" : "none",
                              fontSize: "0.9rem",
                            }}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab === "all" ? "All" : "Archived"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-body p-2" style={{ maxHeight: 480, overflow: "auto" }}>
  {loading ? (
    <div className="text-center py-5">
      <div className="spinner-border text-success spinner-border-sm"></div>
      <p className="text-muted mt-2 mb-0">Loading notifications...</p>
    </div>
  ) : filteredNotifications.length === 0 ? (
    <div className="text-center py-5">
      <i className="bi bi-bell-slash display-6 text-muted mb-3"></i>
      <p className="text-muted mb-0">No notifications</p>
      <small className="text-muted">You're all caught up!</small>
    </div>
  ) : (
    <>
      {filteredNotifications.map((n) => (
  <div
    key={n.id}
    className="d-flex align-items-center border rounded py-2 px-3 mb-2 shadow-sm"
    style={{
      cursor: "pointer",
      backgroundColor: !n.readBy?.includes(user.uid) ? "#d1fae5" : "#fff",
      transition: "background-color 0.6s ease",
      borderRadius: 10,
    }}
    onClick={() => {
      setViewNotif(n);
      markAsRead(n);
    }}
  >
    {/* Left: Admin/Profile Icon - Bigger & Centered */}
    <div
      className="d-flex align-items-center justify-content-center me-3"
      style={{ width: 60, height: 60 }}
    >
      <img
        src={user?.photoURL || "/default-profile.png"}
        alt="Admin"
        className="rounded-circle shadow-sm"
        style={{ width: 60, height: 60, objectFit: "cover" }}
      />
    </div>

    {/* Right: Notification Content */}
    <div className="flex-grow-1 d-flex flex-column align-items-start">
      {/* Admin Name (Title) and Category Badge */}
      <div className="d-flex align-items-center gap-2 mb-1">
        <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "0.95rem" }}>
          Administrator
        </h6>
        <span
          className={`badge ${getBadgeClass(n.category)}`}
          style={{ fontSize: "0.75rem", padding: "0.25em 0.5em" }}
        >
          {n.category}
        </span>
      </div>

      {/* Message */}
      <p
  className="mb-1 text-start"
  style={{
    fontSize: "0.9rem",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2, // 👈 shows up to 2 lines before adding “...”
    WebkitBoxOrient: "vertical",
    lineHeight: "1.4",
    wordBreak: "break-word",
  }}
  title={n.message}
>
  {n.message}
</p>


      {/* Time */}
      <small
        className="text-muted text-start"
        style={{ fontSize: "0.75rem" }}
      >
        {new Date(n.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </small>
    </div>

    {/* Actions */}
    <div className="d-flex flex-column gap-1 ms-3">
      {!n.archivedBy?.includes(user.uid) ? (
        <button
          className="btn btn-sm btn-outline-secondary"
          title="Archive"
          onClick={(e) => {
            e.stopPropagation();
            archiveNotification(n);
          }}
        >
          <i className="bi bi-archive"></i>
        </button>
      ) : (
        <button
          className="btn btn-sm btn-outline-success"
          title="Restore"
          onClick={(e) => {
            e.stopPropagation();
            restoreNotification(n);
          }}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      )}
      <button
        className="btn btn-sm btn-outline-danger"
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          deleteNotification(n);
        }}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  </div>
))}

      {/* Plain footer */}
      <div
        className="text-center text-muted"
        style={{
          borderTop: "1px solid #dee2e6",
          paddingTop: "10px",
          paddingBottom: "5px",
          fontSize: "0.8rem",
        }}
      >
        End of Notifications
      </div>
    </>
  )}
</div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <img
                src={user?.photoURL || "/default-profile.png"}
                className="rounded-circle shadow-sm"
                style={{ width: 44, height: 44, objectFit: "cover", cursor: "pointer", border: "2px solid #0D4715" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfile((p) => !p);
                  setShowNotif(false);
                }}
                alt="Profile"
              />
              {showProfile && (
                <ul className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute", right: 0, top: 50, minWidth: 160, zIndex: 1000 }}>
                  <li>
                    <button className="dropdown-item" onClick={() => { navigate("/settings"); setShowProfile(false); }}>
                      Profile
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger fw-bold" onClick={handleSignOut}>
                      Sign out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Confirm Modal */}
      {confirmAction && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setConfirmAction(null)} style={{ zIndex: 1300 }}></div>
          <div className="modal show d-block fade" tabIndex="-1" style={{ zIndex: 1301 }} ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h5 className="modal-title">Confirm {confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}</h5>
                  <button type="button" className="btn-close" onClick={() => setConfirmAction(null)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to {confirmAction.type} this notification?</p>
                  <strong>{confirmAction.notif.title}</strong>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setConfirmAction(null)}>Cancel</button>
                  <button className={`btn ${confirmAction.type === "delete" ? "btn-danger" : "btn-success"}`} onClick={confirmActionHandler}>
                    {confirmAction.type === "delete" ? "Delete" : confirmAction.type === "restore" ? "Restore" : "Archive"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

     {/* View Notification Modal */}
{viewNotif && (
  <>
    {/* Backdrop */}
    <div
      className="modal-backdrop fade show"
      onClick={() => setViewNotif(null)}
      style={{ zIndex: 1300 }}
    ></div>

    {/* Modal */}
    <div
      className="modal show d-block fade"
      tabIndex="-1"
      style={{ zIndex: 1301 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "520px", width: "100%" }}
        >
          {/* Header */}
          <div className="modal-header bg-success bg-opacity-10 border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-success">
              <i className="bi bi-bell-fill me-2"></i>Notification
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setViewNotif(null)}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body px-4 pb-4 pt-3 bg-white">
            {/* Profile + Admin Info */}
            <div className="d-flex align-items-center mb-4">
              <img
                src={user?.photoURL || "/default-profile.png"}
                alt="Admin"
                className="rounded-circle shadow-sm me-3"
                style={{
                  width: 55,
                  height: 55,
                  objectFit: "cover",
                  border: "3px solid #10b981",
                }}
              />
              <div className="flex-grow-1 text-start">
                <h6 className="fw-bold mb-0 text-dark">Administrator</h6>
                <span
                  className={`badge ${getBadgeClass(viewNotif.category)}`}
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.4em 0.7em",
                  }}
                >
                  {viewNotif.category}
                </span>
              </div>
              <div className="text-end">
                <small className="text-muted d-block">
                  {new Date(viewNotif.date).toLocaleDateString()}
                </small>
                <small className="text-muted">
                  {new Date(viewNotif.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-3" />

            {/* Title */}
            <h6
              className="fw-bold text-dark mb-2"
              style={{ fontSize: "1.05rem" }}
            >
              {viewNotif.title}
            </h6>

            {/* Message */}
            <p
              className="text-secondary mb-3"
              style={{
                fontSize: "0.95rem",
                lineHeight: "1.6",
                textAlign: "justify",
              }}
            >
              {viewNotif.message}
            </p>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-light px-4 py-3 d-flex flex-column align-items-stretch">
            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
              {!viewNotif.archivedBy?.includes(user.uid) ? (
                <button
                  className="btn btn-success"
                  onClick={(e) => {
                    e.stopPropagation();
                    archiveNotification(viewNotif);
                    setViewNotif(null);
                  }}
                >
                  <i className="bi bi-archive me-2"></i>Archive
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    restoreNotification(viewNotif);
                    setViewNotif(null);
                  }}
                >
                  <i className="bi bi-inbox me-2"></i>Restore
                </button>
              )}

              {/* Delete Button */}
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(viewNotif); // ⚠️ make sure you have this function
                  setViewNotif(null);
                }}
              >
                <i className="bi bi-trash3 me-2"></i>Delete
              </button>

              {/* Close Button */}
              <button
                className="btn btn-outline-secondary"
                onClick={() => setViewNotif(null)}
              >
                <i className="bi bi-x-circle me-2"></i>Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)}
    </>
  );
};

export default TopNavbarUser;