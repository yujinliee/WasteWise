import React, { useEffect, useState } from "react";
import { auth } from "../Components/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavbarAdmin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div 
      className="d-flex flex-column bg-white border-end position-fixed"
      style={{ 
        width: "250px", 
        height: "100vh",
        top: 0,
        left: 0,
        overflowY: "auto" // Allows scrolling only if content exceeds viewport
      }}
    >
      {/* Branding */}
      <div className="text-center py-4 text-black border-bottom">
        <h4 className="mb-0 fw-bold">🌱 WasteWise</h4>
        <small className="opacity-75">Smart Waste Management</small>
      </div>

      {/* Profile Section */}
      <div className="text-center border-bottom py-4">
        <img
          src={user?.photoURL || "/default-profile.png"}
          alt="Admin Profile"
          className="rounded-circle mb-2"
          style={{ width: 80, height: 80, objectFit: "cover" }}
        />
        <h6 className="fw-bold mb-1">{user?.displayName || "Admin"}</h6>
        <p className="text-muted small mb-0">{user?.email || "No email"}</p>
      </div>

      {/* Navigation - Fixed height with scroll if needed */}
      <div 
        className="flex-grow-1 d-flex flex-column justify-content-center"
        style={{ minHeight: "0" }} // Important for flexbox scrolling
      >
        <nav 
          className="nav flex-column text-start px-3"
          style={{ maxHeight: "100%", overflowY: "auto" }}
        >
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `nav-link px-4 py-3 mb-2 rounded ${
                isActive ? "text-success fw-bold bg-light border" : "text-dark"
              }`
            }
          >
            <span className="me-3">🏠</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/bins"
            className={({ isActive }) =>
              `nav-link px-4 py-3 mb-2 rounded ${
                isActive ? "text-success fw-bold bg-light border" : "text-dark"
              }`
            }
          >
            <span className="me-3">🗑️</span>
            Bins
          </NavLink>
          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `nav-link px-4 py-3 mb-2 rounded ${
                isActive ? "text-success fw-bold bg-light border" : "text-dark"
              }`
            }
          >
            <span className="me-3">🔔</span>
            Notifications
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `nav-link px-4 py-3 mb-2 rounded ${
                isActive ? "text-success fw-bold bg-light border" : "text-dark"
              }`
            }
          >
            <span className="me-3">👥</span>
            Users
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `nav-link px-4 py-3 mb-2 rounded ${
                isActive ? "text-success fw-bold bg-light border" : "text-dark"
              }`
            }
          >
            <span className="me-3">⚙️</span>
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div className="px-3 pb-4 mt-auto">
        <button className="btn btn-outline-danger w-100 py-2" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default NavbarAdmin;