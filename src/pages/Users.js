import React, { useEffect, useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showArchivePopup, setShowArchivePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active"); 

  useEffect(() => {
    const fakeUsers = [
      { 
        id: "1", 
        email: "eugene@gmail.com", 
        displayName: "Eugene", 
        campus: "Main Campus", 
        floor: "2F",
        role: "User",
        status: "Active",
        joinDate: "2024-01-15",
        archived: false
      },
      { 
        id: "2", 
        email: "admin@gmail.com", 
        displayName: "Admin", 
        campus: "Admin Office", 
        floor: "3F",
        role: "Admin",
        status: "Active",
        joinDate: "2024-01-10",
        archived: false
      },
      { 
        id: "3", 
        email: "student@gmail.com", 
        displayName: "Student", 
        campus: "North Campus", 
        floor: "1F",
        role: "User",
        status: "Active",
        joinDate: "2024-01-20",
        archived: false
      },
      { 
        id: "4", 
        email: "olduser@gmail.com", 
        displayName: "Old User", 
        campus: "South Campus", 
        floor: "4F",
        role: "User",
        status: "Inactive",
        joinDate: "2023-12-01",
        archived: true
      },
    ];
    setUsers(fakeUsers);
    setLoading(false);
  }, []);

  // Filter users based on active tab and search
  const filteredUsers = users
    .filter(user => activeTab === "active" ? !user.archived : user.archived)
    .filter(user =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.displayName.toLowerCase().includes(search.toLowerCase()) ||
      user.campus.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
    );

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  const handleArchiveClick = (user) => {
    setSelectedUser(user);
    setShowArchivePopup(true);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setShowDeletePopup(false);
  };

  const confirmArchive = () => {
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, archived: !u.archived } : u
    ));
    setShowArchivePopup(false);
  };

  // Fixed Restore function
  const handleRestoreClick = (user) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, archived: false } : u
    ));
  };

  const getStatusBadgeClass = (status) => {
    return status === "Active" ? "bg-success" : "bg-secondary";
  };

  const getRoleBadgeClass = (role) => {
    return role === "Admin" ? "bg-primary" : "bg-info";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <NavbarAdmin />

      {/* Main Section */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Fixed Top Navbar */}
        <div className="bg-white shadow-sm sticky-top">
          <TopNavbarAdmin />
        </div>

        {/* Grayish Layer */}
        <div
          className="flex-grow-1 p-4"
          style={{
            backgroundColor: "#f0f2f5",
            overflow: "hidden",
          }}
        >
          {/* Scrollable White Section */}
          <div
            className="bg-white rounded shadow p-4"
            style={{
              height: "100%",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">Users Management 👥</h2>
                <p className="text-muted mb-0">
                  Manage system users and their permissions
                </p>
              </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "active" ? "active" : ""}`}
                  onClick={() => setActiveTab("active")}
                >
                  <i className="bi bi-people me-2"></i>
                  Active Users ({users.filter(u => !u.archived).length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "archived" ? "active" : ""}`}
                  onClick={() => setActiveTab("archived")}
                >
                  <i className="bi bi-archive me-2"></i>
                  Archived Users ({users.filter(u => u.archived).length})
                </button>
              </li>
            </ul>

            {/* Search Bar */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Search ${activeTab} users...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="card bg-light shadow-sm border-0">
              <div className="card-body">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-people display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">No {activeTab} users found</h5>
                    <p className="text-muted">
                      {activeTab === "active" 
                        ? "No active users to display" 
                        : "No users have been archived yet"
                      }
                    </p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Campus</th>
                          <th>Floor</th>
                          <th>Status</th>
                          <th>Join Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div>
                                <strong>{user.displayName}</strong>
                                <br />
                                <small className="text-muted">{user.email}</small>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>{user.campus}</td>
                            <td>{user.floor}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">{user.joinDate}</small>
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                {activeTab === "active" ? (
                                  <>
                                    <button
                                      className="btn btn-outline-warning btn-sm"
                                      onClick={() => handleArchiveClick(user)}
                                    >
                                      <i className="bi bi-archive me-1"></i>Archive
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteClick(user)}
                                    >
                                      <i className="bi bi-trash me-1"></i>Delete
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="btn btn-outline-success btn-sm"
                                      onClick={() => handleRestoreClick(user)}
                                    >
                                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                                      Restore
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteClick(user)}
                                    >
                                      <i className="bi bi-trash me-1"></i>Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeletePopup && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
              <h5 className="text-danger mb-3">Confirm Delete</h5>
              <p>
                Are you sure you want to delete user <strong>{selectedUser?.displayName}</strong>?
                <br />
                <small className="text-muted">Email: {selectedUser?.email}</small>
              </p>
              <p className="text-danger">
                <i className="bi bi-exclamation-triangle me-1"></i> This action cannot be undone.
              </p>
              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive/Restore Confirmation Modal */}
        {showArchivePopup && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
              <h5 className="text-warning mb-3">
                {selectedUser?.archived ? 'Restore User' : 'Archive User'}
              </h5>
              <p>
                Are you sure you want to {selectedUser?.archived ? 'restore' : 'archive'} user{" "}
                <strong>{selectedUser?.displayName}</strong>?
                <br />
                <small className="text-muted">Email: {selectedUser?.email}</small>
              </p>
              {!selectedUser?.archived && (
                <p className="text-muted">
                  <i className="bi bi-info-circle me-1"></i> Archived users will be hidden from active view but can be restored later.
                </p>
              )}
              <div className="text-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowArchivePopup(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-warning" onClick={confirmArchive}>
                  {selectedUser?.archived ? 'Restore User' : 'Archive User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;