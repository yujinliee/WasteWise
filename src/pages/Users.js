import React, { useEffect, useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

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
    <div className="d-flex">
      <NavbarAdmin />

      {/* Main Content */}
      <div 
        className="flex-grow-1 p-4 bg-light" 
        style={{ 
          marginLeft: "250px",
          minHeight: "100vh",
          width: "calc(100% - 250px)"
        }}
      >
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex justify-content-between text-start mb-4">
            <div>
              <h2 className="fw-bold text-dark">👥 Users Management</h2>
              <p className="text-muted mb-0">Manage system users and their permissions</p>
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
                Active Users
                <span className="badge bg-primary ms-2">
                  {users.filter(u => !u.archived).length}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "archived" ? "active" : ""}`}
                onClick={() => setActiveTab("archived")}
              >
                <i className="bi bi-archive me-2"></i>
                Archived Users
                <span className="badge bg-secondary ms-2">
                  {users.filter(u => u.archived).length}
                </span>
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
          <div className="card shadow-sm">
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
                  <table className="table table-hover">
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
                          <td className="text-center align-middle">
                            <div className="d-flex justify-content-center flex-wrap gap-2">
                              {activeTab === "active" ? (
                                <>
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={() => handleArchiveClick(user)}
                                    title="Archive User"
                                  >
                                    <i className="bi bi-archive me-1"></i> Archive
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteClick(user)}
                                    title="Delete User"
                                  >
                                    <i className="bi bi-trash me-1"></i> Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => handleRestoreClick(user)}
                                    title="Restore User"
                                  >
                                    <i className="bi bi-arrow-counterclockwise me-1"></i> Restore
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteClick(user)}
                                    title="Delete User"
                                  >
                                    <i className="bi bi-trash me-1"></i> Delete
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

        {/* Delete Confirmation Modal */}
        {showDeletePopup && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Confirm Delete
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowDeletePopup(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete user <strong>{selectedUser?.displayName}</strong>?
                    <br />
                    <small className="text-muted">Email: {selectedUser?.email}</small>
                  </p>
                  <p className="text-danger">
                    <i className="bi bi-exclamation-triangle me-1"></i> This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeletePopup(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={confirmDelete}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archive/Restore Confirmation Modal */}
        {showArchivePopup && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-warning">
                    <i className="bi bi-archive me-2"></i>
                    {selectedUser?.archived ? 'Restore User' : 'Archive User'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowArchivePopup(false)}
                  ></button>
                </div>
                <div className="modal-body">
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
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowArchivePopup(false)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={confirmArchive}
                  >
                    <i className="bi bi-archive me-1"></i>
                    {selectedUser?.archived ? 'Restore User' : 'Archive User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;