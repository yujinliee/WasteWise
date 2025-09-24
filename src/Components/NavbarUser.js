import React, { useEffect, useState } from "react";
import "../styles/NavbarUser.css";
import { auth } from "../Components/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const NavbarUser = () => {
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
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          {/* ✅ Display name if available, else fallback */}
          <h3>{user?.displayName || "User"}</h3>
          <p>{user?.email || "No email"}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <a href="#" className="nav-item active">
          🏠 <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item">
          🗑️ <span>Bins</span>
        </a>
        <a href="#" className="nav-item">
          🔔 <span>Notifications</span>
        </a>
        <a href="#" className="nav-item">
          👥 <span>Users</span>
        </a>
        <a href="#" className="nav-item">
          ⚙️ <span>Settings</span>
        </a>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default NavbarUser;
