import React, { useEffect, useRef, useState } from "react";
import { useUser } from "./UserContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TopNavbarUser = () => {
  const { user } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // local notifications state (mirrors UserNotifications page structure)
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

  const [expandedId, setExpandedId] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') { setShowProfile(false); setShowNotif(false); } };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('click', onDocClick); document.removeEventListener('keydown', onEsc); };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    if (window.confirm('Delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom px-4 py-3" style={{ background: '#ffffff', color: '#0D4715', minHeight: 64 }}>
      <div className="container-fluid">
        {/* Search Bar */}
        <div className="d-flex align-items-center" style={{ flex: 1, maxWidth: 400 }}>
          <form className="w-100" onSubmit={handleSearch}>
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
                style={{ borderColor: '#e8f5e8' }}
              />
            </div>
          </form>
        </div>

        <div className="d-flex align-items-center ms-auto gap-3 position-relative">
          {/* Notification Bell */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              className="btn position-relative"
              style={{ background: '#0D4715', color: '#fff', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={(e) => { e.stopPropagation(); setShowNotif(s => !s); setShowProfile(false); }}
              aria-label="Notifications"
            >
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: 11 }}>
                {notifications.length}
              </span>
            </button>

            {showNotif && (
              <div style={{ position: 'absolute', right: 0, top: 52, width: 340, maxWidth: '90vw', zIndex: 1200 }}>
                <div className="card shadow-sm">
                  <div className="card-body p-2">
                    <div className="d-flex justify-content-between align-items-center px-2 mb-2">
                      <h6 className="mb-0">Notifications</h6>
                      <small className="text-muted">{notifications.length} total</small>
                    </div>
                    <div style={{ maxHeight: 320, overflow: 'auto' }}>
                      {notifications.length === 0 && (
                        <div className="text-center p-3 text-muted">No notifications</div>
                      )}
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`d-flex px-2 py-2 ${n.read ? 'bg-light' : 'bg-white'}`}
                          onClick={() => setExpandedId(expandedId === n.id ? null : n.id)}
                          style={{ borderBottom: '1px solid #eef3ef', gap: 8, alignItems: 'flex-start', cursor: 'pointer' }}
                        >
                          {/* left indicator / icon */}
                          <div style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: n.read ? '#cfd8d2' : '#0D4715',
                                display: 'inline-block',
                              }}
                            />
                          </div>

                          <div style={{ flex: 1 }}>
                            <div className="d-flex justify-content-between">
                              <div className="fw-semibold">{n.title}</div>
                              <div className="text-muted small">{n.date}</div>
                            </div>
                            <div className="text-muted small">{n.category}</div>
                            {(expandedId === n.id || showAllNotifications) && <div className="mt-2 text-muted">{n.message}</div>}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, minWidth: 88, alignSelf: 'flex-start' }}>
                            {!n.read && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                                style={{ padding: '4px 8px' }}
                                aria-label={`Mark notification ${n.id} as read`}
                              >
                                Mark
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                              style={{ padding: '4px 8px' }}
                              aria-label={`Delete notification ${n.id}`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={(e) => { e.stopPropagation(); setShowAllNotifications(s => !s); }}
                      >
                        {showAllNotifications ? 'Collapse' : 'View all'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={user?.photoURL || '/default-profile.png'}
              className="rounded-circle shadow-sm"
              style={{ width: 44, height: 44, objectFit: 'cover', cursor: 'pointer', border: '2px solid #0D4715' }}
              onClick={(e) => { e.stopPropagation(); setShowProfile(p => !p); setShowNotif(false); }}
              id="profileDropdown"
              aria-expanded={showProfile}
            />

            {showProfile && (
              <ul className="dropdown-menu dropdown-menu-end show" aria-labelledby="profileDropdown" style={{ position: 'absolute', right: 0, top: 50, minWidth: '160px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 1000 }}>
                <li>
                  <button className="dropdown-item" onClick={() => { navigate('/settings'); setShowProfile(false); }}>Profile</button>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li>
                  <button className="dropdown-item text-danger fw-bold" onClick={handleSignOut}>Sign out</button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbarUser;