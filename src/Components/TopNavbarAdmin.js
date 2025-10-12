import React, { useEffect, useRef, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const TopNavbarAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentAdmin) => {
      setAdmin(currentAdmin);
    });

    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    const onEsc = (e) => {
      if (e.key === "Escape") {
        setShowProfile(false);
      }
    };

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);

    return () => {
      unsubscribe();
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Admin searching for:", searchQuery);
  };

  return (
    <nav
      className="navbar navbar-expand-lg border-bottom px-4 py-3"
      style={{
        background: "#f8f8f8",
        color: "#0D4715",
        minHeight: 64,
      }}
    >
      <div className="container-fluid">
        {/* Search Bar */}
        <div
          className="d-flex align-items-center"
          style={{ flex: 1, maxWidth: 400, margin: "0 2rem" }}
        >
          <form className="w-100" onSubmit={handleSearch}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search users, logs, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderColor: "#e8f5e8" }}
              />
            </div>
          </form>
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} style={{ position: "relative", display: "inline-block" }}>
          <div 
            className="d-flex align-items-center gap-2" 
            style={{ position: "relative", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile((p) => !p);
            }}
          >
            {/* Profile Image */}
            <img
              src={admin?.photoURL || require("../assets/profile (1).png")}
              alt="Admin"
              className="rounded-circle shadow-sm"
              style={{
                width: 55,
                height: 55,
                objectFit: "cover",
                border: "3px solid #10b981",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = require("../assets/profile (1).png");
              }}
            />
          </div>

          {showProfile && (
            <ul
              className="dropdown-menu dropdown-menu-end show"
              style={{
                position: "absolute",
                right: 0,
                top: 70,
                minWidth: "220px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "1px solid rgba(13, 71, 21, 0.1)",
                zIndex: 1000,
              }}
            >
              <li className="dropdown-header text-muted small">Signed in as Administrator</li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => {
                    navigate("/admin/settings");
                    setShowProfile(false);
                  }}
                >
                  <i className="bi bi-gear me-2"></i>
                  Administrator Settings
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => {
                    navigate("/admin/users");
                    setShowProfile(false);
                  }}
                >
                  <i className="bi bi-people me-2"></i>
                  Manage Users
                </button>
              </li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center text-danger fw-bold"
                  onClick={handleSignOut}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbarAdmin;