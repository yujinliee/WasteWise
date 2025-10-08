import React, { useEffect, useState } from 'react';
import NavbarUser from "../Components/NavbarUser";
import { auth } from "../Components/firebase";
import { signOut, onAuthStateChanged, updateProfile } from "firebase/auth";
import EditProfileModal from "../Components/EditProfileModal";

const UserDashboard = () => {
  const [currentDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async (updatedData) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: updatedData.displayName,
        });

        setUser({
          ...auth.currentUser,
          displayName: updatedData.displayName,
          campus: updatedData.campus,
        });

        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const binStatus = [
    { id: 1, location: 'Main Building A', status: 'Available', fill: 20, distance: '50m' },
    { id: 2, location: 'Library Entrance', status: 'Half Full', fill: 65, distance: '120m' },
    { id: 3, location: 'Cafeteria', status: 'Nearly Full', fill: 85, distance: '200m' }
  ];

  const notifications = [
    { id: 1, message: 'Waste collection scheduled for tomorrow at 8:00 AM', time: '2 hours ago' },
    { id: 2, message: 'Remember to separate recyclables from general waste', time: '1 day ago' },
    { id: 3, message: 'Bin near Library is almost full', time: '2 days ago' }
  ];

  const ecoTips = [
    "Reduce paper waste by going digital whenever possible",
    "Bring your own reusable water bottle to campus",
    "Properly sort recyclables to improve processing efficiency",
    "Compost organic waste in designated compost bins"
  ];

  const recentHistory = [
    { date: '2025-09-16', action: 'Used recycling bin', location: 'Main Building A' },
    { date: '2025-09-15', action: 'Reported full bin', location: 'Library Entrance' },
    { date: '2025-09-14', action: 'Used general waste bin', location: 'Cafeteria' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-success text-white';
      case 'Half Full': return 'bg-warning text-dark';
      case 'Nearly Full': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getFillWidth = (fill) => `${fill}%`;

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date().getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="border p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className={`border p-2 text-center ${day === today ? 'bg-success text-white fw-bold' : ''}`}>
          {day}
        </div>
      );
    }

    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">{monthNames[month]} {year}</h5>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-1">‹</button>
            <button className="btn btn-sm btn-outline-secondary">›</button>
          </div>
        </div>
        <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="fw-bold text-center border py-2">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex vh-100">
      <NavbarUser />

      <div className="flex-grow-1 p-4 bg-light overflow-auto">
        <h2 className="fw-bold mb-4 text-start">Welcome back, {user?.displayName || "User"}! 👋</h2>

        <div className="row g-4">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Bin Status */}
            <div className="card mb-4">
              <div className="card-header fw-bold">📍 Nearby Bins Status</div>
              <div className="card-body">
                {binStatus.map(bin => (
                  <div key={bin.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold">{bin.location}</div>
                        <small className="text-muted">{bin.distance} away</small>
                      </div>
                      <div className="text-end">
                        <span className={`badge ${getStatusColor(bin.status)}`}>{bin.status}</span>
                        <div className="progress mt-2" style={{ height: "6px" }}>
                          <div className="progress-bar" style={{ width: getFillWidth(bin.fill) }}></div>
                        </div>
                        <small>{bin.fill}% full</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="card mb-4">
              <div className="card-header fw-bold">🔔 Active Notifications</div>
              <div className="card-body">
                {notifications.map(note => (
                  <div key={note.id} className="mb-2">
                    <p className="mb-1">{note.message}</p>
                    <small className="text-muted">{note.time}</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Eco Tips */}
            <div className="card mb-4">
              <div className="card-header fw-bold">💡 Eco Tips & Reminders</div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {ecoTips.map((tip, index) => (
                    <li key={index} className="list-group-item">💡 {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            {/* Calendar */}
            <div className="card mb-4">
              <div className="card-header fw-bold">📅 Calendar</div>
              <div className="card-body">{renderCalendar()}</div>
            </div>

            {/* History */}
            <div className="card mb-4">
              <div className="card-header fw-bold">📊 Recent Activity</div>
              <div className="card-body">
                {recentHistory.map((item, index) => (
                  <div key={index} className="mb-2">
                    <div className="fw-semibold">{item.date}</div>
                    <small>{item.action} — {item.location}</small>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile */}
            <div className="card">
              <div className="card-header fw-bold">👤 Profile</div>
              <div className="card-body">
                <div className="mb-2">
                  <strong>Email:</strong> <span className="text-muted">{user?.email}</span>
                </div>
                <div className="mb-2">
                  <strong>Name:</strong> <span className="text-muted">{user?.displayName || "N/A"}</span>
                </div>
                <div className="mb-3">
                  <strong>Floor:</strong> <span className="text-muted">{user?.campus || "Not set"}</span>
                </div>
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default UserDashboard;
