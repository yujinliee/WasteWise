import React, { useEffect, useState } from "react";
import "../styles/Users.css";
import NavbarAdmin from "../Components/NavbarAdmin";
import ConfirmDeletePopup from "../Components/ConfirmDeletePopup";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fakeUsers = [
      { id: "1", email: "eugene@gmail.com", displayName: "Eugene", campus: "Main Campus", floor: "2F" },
      { id: "2", email: "admin@gmail.com", displayName: "Admin", campus: "Admin Office", floor: "3F" },
      { id: "3", email: "student@gmail.com", displayName: "Student", campus: "North Campus", floor: "1F" },
    ];
    setUsers(fakeUsers);
    setLoading(false);
  }, []);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setShowPopup(false);
    alert("✅ User deleted (simulation only).");
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="users-dashboard">
      <div className="users-sidebar">
        <NavbarAdmin />
      </div>

      <div className="users-main">
        <div className="users-container">
          <h2>👥 Users Management</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Campus</th>
                  <th>Floor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.displayName || "N/A"}</td>
                    <td>{user.campus || "N/A"}</td>
                    <td>{user.floor || "N/A"}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(user)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ✅ Confirmation popup */}
          <ConfirmDeletePopup
            open={showPopup}
            onClose={() => setShowPopup(false)}
            onConfirm={confirmDelete}
            user={selectedUser}
          />
        </div>
      </div>  
    </div>
  );
};

export default Users;
