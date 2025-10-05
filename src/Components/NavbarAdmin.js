import React, { useEffect, useState } from "react";
import "../styles/NavbarAdmin.css";
import { auth } from "../Components/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";

const NavbarAdmin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Listen for user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to homepage
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="Adminsidebar">
      <div className="Adminsidebar-profile">
        <div className="Adminprofile-avatar">👤</div>
        <div className="Adminprofile-info">
          <h3>{user?.displayName || "Admin"}</h3>
          <p>{user?.email || "No email"}</p>
        </div>
      </div>

      <nav className="Adminsidebar-nav">
        <NavLink 
          to="/admin" 
          className={({ isActive }) => "Adminnav-item" + (isActive ? " active" : "")}
        >
          🏠 <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/admin/bins" 
          className={({ isActive }) => "Adminnav-item" + (isActive ? " active" : "")}
        >
          🗑️ <span>Bins</span>
        </NavLink>

        <NavLink 
          to="/admin/notifications" 
          className={({ isActive }) => "Adminnav-item" + (isActive ? " active" : "")}
        >
          🔔 <span>Notifications</span>
        </NavLink>

        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => "Adminnav-item" + (isActive ? " active" : "")}
        >
          👥 <span>Users</span>
        </NavLink>

        <NavLink 
          to="/admin/settings" 
          className={({ isActive }) => "Adminnav-item" + (isActive ? " active" : "")}
        >
          ⚙️ <span>Settings</span>
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default NavbarAdmin;
