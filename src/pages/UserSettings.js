import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarUser from "../Components/NavbarUser";
import TopNavbarUser from "../Components/TopNavbarUser";
import { auth, storage } from "../Components/firebase";
import { useUser } from "../Components/UserContext";
import "../styles/UserDashboard.css";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function UserSettings() {
  const { user, refreshUser } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profilePicture: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preview, setPreview] = useState("/default-profile.png");
  const [pendingImage, setPendingImage] = useState(null); // for background upload

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const names = (user.displayName || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
      }));
      setPreview(user.photoURL || "/default-profile.png");
    }
  }, [user]);

  // Update preview when new image is selected
  useEffect(() => {
    if (formData.profilePicture) {
      const url = URL.createObjectURL(formData.profilePicture);
      setPreview(url);
      setPendingImage(formData.profilePicture);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.profilePicture]);

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          alert("❌ Please select only JPG or PNG images!");
          e.target.value = "";
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          alert("❌ Image size should be less than 2MB!");
          e.target.value = "";
          return;
        }
        setFormData(prev => ({ ...prev, profilePicture: file }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const showNotification = message => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const resetProfileForm = () => {
    if (user) {
      const names = (user.displayName || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        profilePicture: null,
      }));
    }
    const fileInput = document.querySelector('input[name="profilePicture"]');
    if (fileInput) fileInput.value = "";
    setPreview(user?.photoURL || "/default-profile.png");
    setPendingImage(null);
  };

  const resetPasswordForm = () => {
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const compressImage = file =>
    new Promise(resolve => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const MAX_SIZE = 200; // smaller = faster
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          blob => resolve(new File([blob], file.name, { type: "image/jpeg" })),
          "image/jpeg",
          0.7
        );
      };

      img.src = URL.createObjectURL(file);
    });

  // PROFILE UPDATE (instant text update)
  const handleProfileSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("⚠️ No user found. Please log in again.");

    setIsLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (!fullName) throw new Error("Please enter first and last name.");

      // Update text immediately
      await updateProfile(auth.currentUser, { displayName: fullName });
      if (refreshUser) await refreshUser();
      showNotification("✅ Name updated successfully!");

      // Background image upload
      if (pendingImage) {
        const compressedFile = await compressImage(pendingImage);
        const storageRef = ref(
          storage,
          `profile_pictures/${user.uid}/profile_${Date.now()}.jpg`
        );
        const snapshot = await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        if (refreshUser) await refreshUser();
        showNotification("✅ Profile picture updated!");
        setPendingImage(null);
        setFormData(prev => ({ ...prev, profilePicture: null }));
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert(`⚠️ Failed to update profile. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // PASSWORD UPDATE
  const handlePasswordSubmit = async e => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      return alert("⚠️ Please fill in all password fields.");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return alert("❌ New passwords do not match!");
    }

    if (formData.newPassword.length < 6) {
      return alert("⚠️ Password must be at least 6 characters long.");
    }

    try {
      setIsLoading(true);
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, formData.newPassword);
      showNotification("✅ Password updated successfully!");
      resetPasswordForm();
    } catch (error) {
      console.error("Password update error:", error);
      alert("❌ Incorrect current password or session expired.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabConfig = [
    { key: "profile", label: "Profile", icon: "bi-person-circle", color: "success" },
    { key: "security", label: "Security", icon: "bi-shield-lock", color: "warning" },
  ];

  const getActiveIcon = () => {
    switch (activeTab) {
      case "profile": return "bi-person-circle text-success";
      case "security": return "bi-shield-lock text-warning";
      default: return "bi-gear text-secondary";
    }
  };

  return (
    <div className="d-flex bg-light" style={{ height: "100vh", overflow: "hidden" }}>
      <NavbarUser />
      <div className="flex-grow-1 d-flex flex-column">
        <TopNavbarUser />
        <div className="flex-grow-1 p-4" style={{ overflow: "hidden" }}>
          <div className="container-fluid h-100 d-flex flex-column">
            {/* Header */}
            <div className="row mb-3 animate__animated animate__fadeInDown">
              <div className="col-12">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-3">
                    <i className="bi bi-gear fs-1 text-success"></i>
                  </div>
                  <div>
                    <h1 className="fw-bold mb-1">Account Settings</h1>
                    <p className="text-muted mb-0">Manage your profile and security</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row flex-grow-1">
              {/* Sidebar */}
              <div className="col-lg-3 d-flex flex-column">
                <div className="card border-0 shadow-sm rounded-3 animate__animated animate__fadeInLeft">
                  <div className="card-body d-flex flex-column p-3">
                    <div className="text-center mb-4">
                      <img
                        src={preview}
                        alt="User Avatar"
                        className="rounded-circle shadow mb-2"
                        style={{ width: "80px", height: "80px", objectFit: "cover", border: "3px solid #10b981" }}
                        onError={e => { e.target.src = "/default-profile.png"; }}
                      />
                      <h6 className="fw-bold mb-1">{user?.displayName || "User"}</h6>
                      <p className="text-muted small mb-0">{user?.email}</p>
                    </div>

                    <div className="nav flex-column">
                      <h6 className="fw-bold text-muted mb-3">SETTINGS</h6>
                      {tabConfig.map((tab, index) => (
                        <button
                          key={tab.key}
                          className={`nav-link text-start d-flex align-items-center gap-3 p-3 mb-2 rounded-3 border-0 ${
                            activeTab === tab.key
                              ? `bg-${tab.color} bg-opacity-10 text-${tab.color} border-start border-3 border-${tab.color}`
                              : "text-muted"
                          } animate__animated animate__fadeIn`}
                          style={{ animationDelay: `${index * 0.1}s`, transition: "all 0.3s ease" }}
                          onClick={() => setActiveTab(tab.key)}
                        >
                          <i className={`${tab.icon} fs-5`}></i>
                          <span className="fw-semibold">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-lg-9 d-flex">
                <div className="card border-0 shadow-sm rounded-3 w-100 d-flex flex-column animate__animated animate__fadeInRight">
                  <div className="card-body p-4 flex-grow-1 d-flex flex-column">
                    <div className="mb-4 animate__animated animate__fadeInDown">
                      <h4 className="fw-bold mb-2">
                        <i className={`${getActiveIcon()} me-2`}></i>
                        {tabConfig.find(tab => tab.key === activeTab)?.label}
                      </h4>
                      <p className="text-muted mb-0">
                        {activeTab === "profile"
                          ? "Update your personal details and profile picture."
                          : "Manage your password and account security."}
                      </p>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                      <form onSubmit={handleProfileSubmit} className="animate__animated animate__fadeIn">
                        <div className="row g-3">
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">First Name *</label>
                            <input
                              type="text"
                              name="firstName"
                              className="form-control"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-semibold">Last Name *</label>
                            <input
                              type="text"
                              name="lastName"
                              className="form-control"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-semibold">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={user?.email || ""}
                              disabled
                              style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                            />
                            <small className="text-muted">Email cannot be changed</small>
                          </div>
                          <div className="col-12">
                            <label className="form-label fw-semibold">Profile Picture</label>
                            <input
                              type="file"
                              name="profilePicture"
                              accept=".jpg,.jpeg,.png"
                              className="form-control"
                              onChange={handleChange}
                              disabled={isLoading}
                            />
                            <small className="text-muted">JPG/PNG • Max 2MB • Recommended 200x200px</small>
                          </div>
                        </div>

                        <div className="mt-4 d-flex gap-2 justify-content-end">
                          <button type="button" className="btn btn-outline-secondary px-4" onClick={resetProfileForm} disabled={isLoading}>
                            Reset
                          </button>
                          <button type="submit" className="btn btn-success px-4" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                      <form onSubmit={handlePasswordSubmit} className="animate__animated animate__fadeIn">
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label fw-semibold">Current Password *</label>
                            <input
                              type="password"
                              name="currentPassword"
                              className="form-control"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">New Password *</label>
                            <input
                              type="password"
                              name="newPassword"
                              className="form-control"
                              value={formData.newPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold">Confirm Password *</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              className="form-control"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-4 d-flex gap-2 justify-content-end">
                          <button type="button" className="btn btn-outline-secondary px-4" onClick={resetPasswordForm} disabled={isLoading}>
                            Reset
                          </button>
                          <button type="submit" className="btn btn-warning px-4" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Updating...
                              </>
                            ) : (
                              "Update Password"
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popup Notification */}
        {showPopup && (
          <div className="position-fixed top-0 start-50 translate-middle-x mt-5 animate__animated animate__fadeInDown" style={{ zIndex: 1050 }}>
            <div className="alert alert-success shadow-lg border-0 d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              {popupMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;
