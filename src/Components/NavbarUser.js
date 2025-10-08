import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Components/firebase";
import { useUser } from "../Components/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

const NavbarUser = () => {
  const { user } = useUser();
  const navigate = useNavigate();

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
      className="d-flex flex-column bg-white border-end vh-100"
      style={{ width: "250px" }}
    >
      {/* App Branding - Larger Title */}
      <div className="text-center py-4 text-black">
        <h4 className="mb-0 fw-bold">🌱 WasteWise</h4>
        <small className="opacity-75">Smart Waste Management</small>
      </div>

      {/* Profile Section - Moved up */}
      <div className="text-center border-bottom py-4">
        <img
          src={user?.photoURL || "/default-profile.png"}
          alt="Profile"
          className="rounded-circle mb-2"
          style={{ width: 80, height: 80, objectFit: "cover" }}
        />
        <h6 className="fw-bold mb-1">{user?.displayName || "User"}</h6>
        <p className="text-muted small mb-0">{user?.email || "No email"}</p>
      </div>

      {/* Spacer to push navigation down */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        {/* Navigation - Centered vertically */}
        <nav className="nav flex-column text-start px-3">
          <NavLink
            to="/dashboard"
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
            to="/bins"
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
            to="/notifications"
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
            to="/settings"
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

      {/* Logout - Fixed at bottom */}
      <div className="px-3 pb-4">
        <button className="btn btn-outline-danger w-100 py-2" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default NavbarUser;