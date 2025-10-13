import React, { useEffect, useState } from "react";
import NavbarAdmin from "../Components/NavbarAdmin";
import TopNavbarAdmin from "../Components/TopNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs
} from "firebase/firestore";
import { db } from "../Components/firebase";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [error, setError] = useState("");

  // 🔥 Fetch users from Firestore with error handling
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        
        console.log("Starting to fetch users...");
        
        // Try both collection names
        const collectionsToTry = ["users", "Users", "user", "User"];
        
        for (const collectionName of collectionsToTry) {
          try {
            console.log(`Trying collection: ${collectionName}`);
            const querySnapshot = await getDocs(collection(db, collectionName));
            
            if (!querySnapshot.empty) {
              const fetchedUsers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              
              console.log(`Found ${fetchedUsers.length} users in collection: ${collectionName}`);
              console.log("Users data:", fetchedUsers);
              
              setUsers(fetchedUsers);
              setLoading(false);
              return; // Exit if successful
            }
          } catch (err) {
            console.log(`Collection ${collectionName} not accessible:`, err.message);
          }
        }
        
        // If no collections worked
        setError("No users collection found. Please check your Firestore database.");
        setUsers([]);
        
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(`Failed to load users: ${err.message}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🧠 Filter based on tab and search
  const filteredUsers = users
    .filter((user) =>
      activeTab === "active"
        ? user.status === "Active" && !user.archived
        : user.archived
    )
    .filter(
      (user) =>
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        user.name?.toLowerCase().includes(search.toLowerCase())
    );

  // 🔥 Modal Handlers
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    const modal = new window.bootstrap.Modal(
      document.getElementById("deleteModal")
    );
    modal.show();
  };

  const handleArchiveClick = (user) => {
    setSelectedUser(user);
    const modal = new window.bootstrap.Modal(
      document.getElementById("archiveModal")
    );
    modal.show();
  };

  // ✅ Delete from Firestore
  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteDoc(doc(db, "users", selectedUser.id));
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("deleteModal")
      );
      modal.hide();
      showToast(`Deleted ${getUserDisplayName(selectedUser)}`, "danger");
    } catch (err) {
      console.error("Delete error:", err);
      showToast(`Failed to delete user: ${err.message}`, "danger");
    }
  };

  // ✅ Archive or Restore in Firestore
  const confirmArchive = async () => {
    if (!selectedUser) return;
    
    try {
      await updateDoc(doc(db, "users", selectedUser.id), {
        archived: !selectedUser.archived,
      });
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("archiveModal")
      );
      modal.hide();
      showToast(
        `${selectedUser.archived ? "Restored" : "Archived"} ${
          getUserDisplayName(selectedUser)
        }`,
        selectedUser.archived ? "success" : "warning"
      );
    } catch (err) {
      console.error("Archive error:", err);
      showToast(`Failed to archive user: ${err.message}`, "danger");
    }
  };

  // ✅ Restore directly from archived tab
  const handleRestoreClick = async (user) => {
    try {
      await updateDoc(doc(db, "users", user.id), { archived: false });
      showToast(`Restored ${getUserDisplayName(user)}`, "success");
    } catch (err) {
      console.error("Restore error:", err);
      showToast(`Failed to restore user: ${err.message}`, "danger");
    }
  };

  // 🪄 Toast function
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 2500);
  };

  // 🔒 Safe user data access functions with null checks
  const getUserDisplayName = (user) => {
    if (!user) return "Unknown User";
    return user.displayName || user.name || user.email || "Unknown User";
  };

  const getUserEmail = (user) => {
    if (!user) return "No email";
    return user.email || "No email";
  };

  const getUserJoinDate = (user) => {
    if (!user) return "Unknown date";
    return user.joinDate || user.createdAt || user.dateCreated || "Unknown date";
  };

  const getUserStatus = (user) => {
    if (!user) return "Unknown";
    return user.status || "Active";
  };

  const getStatusBadgeClass = (status) =>
    status === "Active" ? "bg-success" : "bg-secondary";

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 📊 Updated counts
  const activeCount = users.filter(
    (u) => getUserStatus(u) === "Active" && !u.archived
  ).length;
  const archivedCount = users.filter((u) => u.archived).length;

  return (
    <div className="d-flex vh-100 bg-light">
      <NavbarAdmin />

      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarAdmin />

        <div
          className="flex-grow-1 p-4 overflow-auto"
          style={{ backgroundColor: "#f3f4f6" }}
        >
          <div className="container-fluid">
            {/* Header */}
            <div
              className="widget mb-4 rounded-3 shadow-sm p-4 animate__animated animate__fadeInDown text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 className="fw-bold mb-1 text-start">Users Management 👥</h3>
                <p className="text-light text-start mb-0">
                  Manage, archive, and organize system users efficiently.
                </p>
              </div>
              
              {/* Debug Info */}
              <div className="text-end">
                <small className="text-light opacity-75">
                  Total Users: {users.length}
                </small>
                {error && (
                  <div className="alert alert-warning mt-2 p-2 small">
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-pills mb-4">
              <li className="nav-item me-2">
                <button
                  className={`nav-link ${
                    activeTab === "active"
                      ? "active bg-primary text-white"
                      : "text-primary border border-primary"
                  }`}
                  onClick={() => setActiveTab("active")}
                >
                  <i className="bi bi-people me-2"></i>
                  Active Users ({activeCount})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "archived"
                      ? "active bg-secondary text-white"
                      : "text-secondary border border-secondary"
                  }`}
                  onClick={() => setActiveTab("archived")}
                >
                  <i className="bi bi-archive me-2"></i>
                  Archived Users ({archivedCount})
                </button>
              </li>
            </ul>

            {/* Search */}
            <div className="input-group mb-4 w-50">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 shadow-sm"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="card border-0 shadow-sm rounded-3 animate__animated animate__fadeInUp">
              <div className="card-body">
                {error ? (
                  <div className="text-center py-5">
                    <i className="bi bi-exclamation-triangle display-5 text-warning d-block mb-3"></i>
                    <h5 className="text-warning">Unable to Load Users</h5>
                    <p className="text-muted">{error}</p>
                    <button 
                      className="btn btn-primary mt-2"
                      onClick={() => window.location.reload()}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Retry
                    </button>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Join Date</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <strong>{getUserDisplayName(user)}</strong>
                              <br />
                              <small className="text-muted">{getUserEmail(user)}</small>
                            </td>
                            <td>
                              <span
                                className={`badge ${getStatusBadgeClass(
                                  getUserStatus(user)
                                )}`}
                              >
                                {getUserStatus(user)}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {getUserJoinDate(user)}
                              </small>
                            </td>
                            <td className="text-center">
                              {activeTab === "active" ? (
                                <>
                                  <button
                                    className="btn btn-outline-warning btn-sm me-2"
                                    onClick={() => handleArchiveClick(user)}
                                  >
                                    <i className="bi bi-archive me-1"></i>
                                    Archive
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteClick(user)}
                                  >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-outline-success btn-sm me-2"
                                    onClick={() => handleRestoreClick(user)}
                                  >
                                    <i className="bi bi-arrow-counterclockwise me-1"></i>
                                    Restore
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteClick(user)}
                                  >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-people display-5 text-muted d-block mb-2"></i>
                    <p className="text-muted mb-0">
                      No {activeTab === "active" ? "active" : "archived"} users
                      found.
                    </p>
                    {users.length === 0 && (
                      <div className="mt-3">
                        <small className="text-muted">
                          No users found in database. Check your Firestore collection.
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Delete Modal */}
        <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg animate__animated animate__fadeInDown">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-trash3 me-2 text-danger"></i> Confirm Delete
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
                <h5 className="fw-semibold mb-2">
                  Delete <span className="text-danger">{getUserDisplayName(selectedUser)}</span>?
                </h5>
                <p className="text-muted small mb-0">This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center pb-4">
                <button className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button className="btn btn-danger px-4" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🗂️ Archive Modal */}
        <div className="modal fade" id="archiveModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg animate__animated animate__fadeInDown">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i
                    className={`bi ${
                      selectedUser?.archived
                        ? "bi-arrow-counterclockwise text-success"
                        : "bi-archive text-warning"
                    } me-2`}
                  ></i>
                  {selectedUser?.archived ? "Restore User" : "Archive User"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body text-center py-4">
                <i
                  className={`bi ${
                    selectedUser?.archived
                      ? "bi-arrow-counterclockwise text-success"
                      : "bi-archive text-warning"
                  } fs-1 mb-3`}
                ></i>
                <h5 className="fw-semibold mb-2">
                  {selectedUser?.archived ? "Restore" : "Archive"}{" "}
                  <span className="text-dark">{getUserDisplayName(selectedUser)}</span>?
                </h5>
                <p className="text-muted small mb-0">
                  {selectedUser?.archived
                    ? "This user will become active again."
                    : "You can restore this user anytime."}
                </p>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-center pb-4">
                <button className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  className={`btn px-4 ${
                    selectedUser?.archived ? "btn-success" : "btn-warning text-dark"
                  }`}
                  onClick={confirmArchive}
                >
                  {selectedUser?.archived ? "Restore" : "Archive"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Temporary Toast */}
        {toast.show && (
          <div
            className={`toast align-items-center text-white bg-${toast.type} border-0 position-fixed bottom-0 end-0 m-4 show`}
            role="alert"
            style={{ zIndex: 1055 }}
          >
            <div className="d-flex">
              <div className="toast-body">{toast.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast({ show: false, message: "", type: "" })}
              ></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;