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
    <aside
      className="sidebar d-flex flex-column justify-content-between align-items-center vh-100 shadow-lg"
      style={{
        width: "260px",
        background: "#0D4715",
        color: "#fff",
        borderRight: "2px solid #0D4715",
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        padding: "20px 12px",
        overflow: "hidden",
        position: "sticky",
        top: 18,
        maxHeight: "calc(100vh - 36px)",
      }}
    >
      {/* Branding */}
      <div
        className="w-100 text-center py-4 mb-2"
        style={{ borderBottom: "1px solid #417255" }}
      >
        <img
          src={require("../assets/Logo.png")}
          alt="Logo"
          style={{ width: 56, height: 56, marginBottom: 8 }}
        />
        <h4 className="mb-0 fw-bold" style={{ color: "#fff", letterSpacing: 1 }}>
          TrashAlign
        </h4>
        <small className="opacity-75" style={{ color: "#e0f2e9" }}>
          Smart Waste Management
        </small>
      </div>

      {/* Navigation */}
      <nav
        className="w-100 flex-grow-1 d-flex flex-column align-items-center pt-3"
        style={{ gap: 8 }}
      >
        <NavLink
          to="/admin"
          end
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
          to="/admin/bins"
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
          to="/admin/notifications"
          className={({ isActive }) =>
            `w-75 nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-pill fw-semibold ${
              isActive ? "bg-white text-success shadow-sm" : "text-white"
            }`
          }
          style={{ fontSize: "1.08rem", transition: "all 0.2s" }}
        >
          <span className="me-2" style={{ fontSize: "1.3rem" }}>🔔</span>
          Notifications
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `w-75 nav-link d-flex align-items-center px-3 py-2 mb-2 rounded-pill fw-semibold ${
              isActive ? "bg-white text-success shadow-sm" : "text-white"
            }`
          }
          style={{ fontSize: "1.08rem", transition: "all 0.2s" }}
        >
          <span className="me-2" style={{ fontSize: "1.3rem" }}>👥</span>
          Users
        </NavLink>

        <NavLink
          to="/admin/settings"
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

      {/* Logout Button */}
      <div className="w-100 px-4 pb-4">
        <button
          className="btn w-100 py-2 rounded-pill fw-bold"
          style={{
            backgroundColor: "#417255",
            color: "#fff",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          onClick={handleLogout}
        >
          <span style={{ fontSize: "1.2rem" }}>🚪</span>{" "}
          <span className="ms-2">Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default NavbarAdmin;
