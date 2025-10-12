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
    <aside
      className="sidebar d-flex flex-column justify-content-between align-items-center vh-100 shadow-lg"
       style={{ width: "260px", background: "#0D4715", color: "#fff", borderRight: "2px solid #0D4715", borderTopRightRadius: 16, borderBottomRightRadius: 16, padding: '20px 12px', overflow: 'hidden', position: 'sticky', top: 18, maxHeight: 'calc(100vh - 36px)' }}
    >
      {/* Branding */}
      <div className="w-100 text-center py-4 mb-2" style={{ borderBottom: "1px solid #417255" }}>
        <img src={require('../assets/Logo.png')} alt="Logo" style={{ width: 56, height: 56, marginBottom: 8 }} />
        <h4 className="mb-0 fw-bold" style={{ color: "#fff", letterSpacing: 1 }}>TrashAlign</h4>
        <small className="opacity-75" style={{ color: "#e0f2e9" }}>Smart Waste Management</small>
      </div>

      {/* Navigation */}
      <nav className="w-100 flex-grow-1 d-flex flex-column align-items-center pt-3" style={{ gap: 8 }}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `w-75 nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-pill fw-semibold ${
              isActive ? "bg-white text-success shadow-sm" : "text-white"
            }`
          }
          style={{ fontSize: "1.08rem", transition: "all 0.2s" }}
        >
          <span className="me-2" style={{ fontSize: "1.3rem" }}>🏠</span>
          Dashboard
        </NavLink>
        <NavLink
          to="/bins"
          className={({ isActive }) =>
            `w-75 nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-pill fw-semibold ${
              isActive ? "bg-white text-success shadow-sm" : "text-white"
            }`
          }
          style={{ fontSize: "1.08rem", transition: "all 0.2s" }}
        >
          <span className="me-2" style={{ fontSize: "1.3rem" }}>🗑️</span>
          Bins
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-75 nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-pill fw-semibold ${
              isActive ? "bg-white text-success shadow-sm" : "text-white"
            }`
          }
          style={{ fontSize: "1.08rem", transition: "all 0.2s" }}
        >
          <span className="me-2" style={{ fontSize: "1.3rem" }}>⚙️</span>
          Settings
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="w-100 px-4 pb-4">
        <button
          className="btn w-100 py-2 rounded-pill fw-bold"
          style={{ backgroundColor: "#417255", color: "#fff", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          onClick={handleLogout}
        >
          <span style={{ fontSize: "1.2rem" }}>🚪</span> <span className="ms-2">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default NavbarUser;