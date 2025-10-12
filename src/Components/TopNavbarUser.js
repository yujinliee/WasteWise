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

  const [confirmAction, setConfirmAction] = useState(null);
  const [viewNotif, setViewNotif] = useState(null);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const modalRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
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

  if (!user) {
    return (
      <nav className="navbar navbar-expand-lg border-bottom px-4 py-3">
        <div className="container-fluid">Loading user...</div>
      </nav>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .search-container {
            display: none !important;
          }
          .navbar-container {
            padding: 0.75rem 1rem !important;
          }
          .notif-dropdown {
            right: 0 !important;
            left: auto !important;
            width: 95vw !important;
            max-width: 95vw !important;
          }
          .notif-card-body {
            max-height: 60vh !important;
          }
          .profile-dropdown {
            right: 0 !important;
          }
        }
        @media (max-width: 576px) {
          .notification-item {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .notification-avatar {
            width: 40px !important;
            height: 40px !important;
            margin-bottom: 0.5rem;
          }
          .notification-actions {
            flex-direction: row !important;
            margin-left: 0 !important;
            margin-top: 0.5rem;
            width: 100%;
            justify-content: flex-end;
          }
          .modal-dialog {
            margin: 0.5rem !important;
          }
          .view-modal-body {
            padding: 1rem !important;
          }
          .view-modal-footer {
            flex-direction: column !important;
          }
          .view-modal-footer .btn {
            width: 100% !important;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg border-bottom px-2 px-md-4 py-3 navbar-container" style={{ background: "#f8f8f8", minHeight: 64 }}>
        <div className="container-fluid">
          {/* Search */}
          <div className="d-flex align-items-center search-container" style={{ flex: 1, maxWidth: 400 }}>
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
          </div>

          {/* Right buttons */}
          <div className="d-flex align-items-center ms-auto gap-2 gap-md-3 position-relative">
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
                <div className="notif-dropdown" style={{ position: "absolute", right: 0, top: 52, width: 420, maxWidth: "90vw", zIndex: 1200 }}>
                  <div className="card shadow-lg border-0" style={{ borderRadius: "12px", overflow: "hidden" }}>
                    <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 px-3 px-md-4">
                      <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: "1rem" }}>Notifications</h5>
                      {unreadCount > 0 && (
                        <button className="btn btn-sm btn-outline-success" style={{ fontSize: "0.75rem" }} onClick={markAllAsRead}>
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Tabs */}
                    <div className="card-header bg-white py-2 px-3 px-md-4">
                      <div className="d-flex gap-3 gap-md-4">
                        {["all", "archived"].map((tab) => (
                          <button
                            key={tab}
                            className={`btn btn-link p-0 ${activeTab === tab ? "fw-bold" : ""}`}
                            style={{
                              color: activeTab === tab ? "#0D4715" : "#6c757d",
                              borderBottom: activeTab === tab ? "2px solid #0D4715" : "none",
                              fontSize: "0.85rem",
                            }}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab === "all" ? "All" : "Archived"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-body notif-card-body p-2" style={{ maxHeight: 480, overflow: "auto" }}>
                      {loading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-success spinner-border-sm"></div>
                          <p className="text-muted mt-2 mb-0 small">Loading notifications...</p>
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
                              className="notification-item d-flex align-items-center border rounded py-2 px-2 px-md-3 mb-2 shadow-sm"
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
                              {/* Admin/Profile Icon */}
                              <div className="d-flex align-items-center justify-content-center me-2 me-md-3 notification-avatar" style={{ width: 50, height: 50, flexShrink: 0 }}>
                                <img
                                  src={require("../assets/profile (1).png")}
                                  alt="Admin"
                                  className="rounded-circle shadow-sm"
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </div>

                              {/* Notification Content */}
                              <div className="flex-grow-1 d-flex flex-column align-items-start overflow-hidden">
                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                  <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "0.85rem" }}>
                                    Administrator
                                  </h6>
                                  <span
                                    className={`badge ${getBadgeClass(n.category)}`}
                                    style={{ fontSize: "0.65rem", padding: "0.2em 0.4em" }}
                                  >
                                    {n.category}
                                  </span>
                                </div>

                                <p
                                  className="mb-1 text-start"
                                  style={{
                                    fontSize: "0.8rem",
                                    width: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    lineHeight: "1.3",
                                    wordBreak: "break-word",
                                  }}
                                  title={n.message}
                                >
                                  {n.message}
                                </p>

                                <small className="text-muted text-start" style={{ fontSize: "0.7rem" }}>
                                  {new Date(n.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </small>
                              </div>

                              {/* Actions */}
                              <div className="notification-actions d-flex flex-column gap-1 ms-2">
                                {!n.archivedBy?.includes(user.uid) ? (
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    title="Archive"
                                    style={{ padding: "0.25rem 0.4rem" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      archiveNotification(n);
                                    }}
                                  >
                                    <i className="bi bi-archive" style={{ fontSize: "0.8rem" }}></i>
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-outline-success"
                                    title="Restore"
                                    style={{ padding: "0.25rem 0.4rem" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      restoreNotification(n);
                                    }}
                                  >
                                    <i className="bi bi-arrow-counterclockwise" style={{ fontSize: "0.8rem" }}></i>
                                  </button>
                                )}
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete"
                                  style={{ padding: "0.25rem 0.4rem" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(n);
                                  }}
                                >
                                  <i className="bi bi-trash" style={{ fontSize: "0.8rem" }}></i>
                                </button>
                              </div>
                            </div>
                          ))}

                          <div
                            className="text-center text-muted"
                            style={{
                              borderTop: "1px solid #dee2e6",
                              paddingTop: "10px",
                              paddingBottom: "5px",
                              fontSize: "0.75rem",
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
                <ul className="dropdown-menu dropdown-menu-end show profile-dropdown" style={{ position: "absolute", right: 0, top: 50, minWidth: 160, zIndex: 1000 }}>
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
                  <h5 className="modal-title">{confirmAction.type.charAt(0).toUpperCase() + confirmAction.type.slice(1)}</h5>
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
          <div className="modal-backdrop fade show" onClick={() => setViewNotif(null)} style={{ zIndex: 1300 }}></div>
          <div className="modal show d-block fade" tabIndex="-1" style={{ zIndex: 1301 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "520px", width: "100%" }}
              >
                <div className="modal-header bg-success bg-opacity-10 border-0 py-3 px-3 px-md-4 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold text-success" style={{ fontSize: "1rem" }}>
                    <i className="bi bi-bell-fill me-2"></i>Notification
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setViewNotif(null)}></button>
                </div>

                <div className="modal-body view-modal-body px-3 px-md-4 pb-3 pb-md-4 pt-3 bg-white">
                  <div className="d-flex align-items-center mb-3 mb-md-4 flex-wrap">
                    <img
                      src={require("../assets/profile (1).png")}
                      alt="Admin"
                      className="rounded-circle shadow-sm me-3"
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        border: "3px solid #10b981",
                      }}
                    />
                    <div className="flex-grow-1 text-start">
                      <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: "0.95rem" }}>Administrator</h6>
                      <span
                        className={`badge ${getBadgeClass(viewNotif.category)}`}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.3em 0.6em",
                        }}
                      >
                        {viewNotif.category}
                      </span>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        {new Date(viewNotif.date).toLocaleDateString()}
                      </small>
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {new Date(viewNotif.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <h6 className="fw-bold text-dark mb-2" style={{ fontSize: "1rem" }}>
                    {viewNotif.title}
                  </h6>

                  <p
                    className="text-secondary mb-3"
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      textAlign: "justify",
                    }}
                  >
                    {viewNotif.message}
                  </p>
                </div>

                <div className="modal-footer view-modal-footer border-0 bg-light px-3 px-md-4 py-3 d-flex gap-2">
                  {!viewNotif.archivedBy?.includes(user.uid) ? (
                    <button
                      className="btn btn-success btn-sm"
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
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreNotification(viewNotif);
                        setViewNotif(null);
                      }}
                    >
                      <i className="bi bi-inbox me-2"></i>Restore
                    </button>
                  )}

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(viewNotif);
                      setViewNotif(null);
                    }}
                  >
                    <i className="bi bi-trash3 me-2"></i>Delete
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setViewNotif(null)}
                  >
                    <i className="bi bi-x-circle me-2"></i>Close
                  </button>
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