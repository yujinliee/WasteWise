import React, { useEffect, useState } from 'react';
import "../styles/UserDashboard.css";
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
        // Update Firebase Auth profile
        await updateProfile(auth.currentUser, {
          displayName: updatedData.displayName,
        });

        // Update local state
        setUser({
          ...auth.currentUser,
          displayName: updatedData.displayName,
          campus: updatedData.campus, // not stored in Auth, but we keep in state
        });

        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  // Sample data
  const binStatus = [
    { id: 1, location: 'Main Building A', status: 'Available', fill: 20, distance: '50m' },
    { id: 2, location: 'Library Entrance', status: 'Half Full', fill: 65, distance: '120m' },
    { id: 3, location: 'Cafeteria', status: 'Nearly Full', fill: 85, distance: '200m' }
  ];

  const notifications = [
    { id: 1, type: 'collection', message: 'Waste collection scheduled for tomorrow at 8:00 AM', time: '2 hours ago' },
    { id: 2, type: 'reminder', message: 'Remember to separate recyclables from general waste', time: '1 day ago' },
    { id: 3, type: 'alert', message: 'Bin near Library is almost full', time: '2 days ago' }
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
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Half Full': return 'bg-yellow-100 text-yellow-800';
      case 'Nearly Full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      days.push(<div key={`empty-${i}`} className="calendar-day"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className={`calendar-day ${day === today ? 'today' : ''}`}>
          {day}
        </div>
      );
    }

    return (
      <div className="calendar-widget">
        <div className="calendar-header">
          <h3>{monthNames[month]} {year}</h3>
          <div className="calendar-nav">
            <button>‹</button>
            <button>›</button>
          </div>
        </div>
        <div className="calendar-weekdays">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <NavbarUser />

      {/* Main Content */}
      <div className="main-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.displayName || "User"}! 👋</h1>
        </div>

        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Bin Status */}
            <div className="widget">
              <div className="widget-header">
                <h2>Nearby Bins Status</h2> 📍
              </div>
              <div className="bin-list">
                {binStatus.map(bin => (
                  <div key={bin.id} className="bin-item">
                    <div className="bin-info">
                      <div className="bin-location">{bin.location}</div>
                      <div className="bin-distance">{bin.distance} away</div>
                    </div>
                    <div className="bin-status">
                      <span className={`status-badge ${getStatusColor(bin.status)}`}>
                        {bin.status}
                      </span>
                      <div className="fill-meter">
                        <div 
                          className="fill-bar" 
                          style={{ width: getFillWidth(bin.fill) }}
                        ></div>
                      </div>
                      <span className="fill-text">{bin.fill}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="widget">
              <div className="widget-header">
                <h2>Active Notifications</h2> 🔔
              </div>
              <div className="notification-list">
                {notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Eco Tips */}
            <div className="widget">
              <div className="widget-header">
                <h2>Eco Tips & Reminders</h2> 💡
              </div>
              <div className="tips-list">
                {ecoTips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <div className="tip-icon">💡</div>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {renderCalendar()}

            {/* History */}
            <div className="widget">
              <div className="widget-header">
                <h2>Recent Activity</h2> 📊
              </div>
              <div className="history-list">
                {recentHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-date">{item.date}</div>
                    <div className="history-details">
                      <div className="history-action">{item.action}</div>
                      <div className="history-location">{item.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Widget */}
            <div className="widget">
              <div className="widget-header">
                <h2>Profile</h2> 👤
              </div>
              <div className="profile-section">
                <div className="profile-detail">
                  <span className="label">Email:</span>
                  <span className="value">{user?.email}</span>
                </div>
                <div className="profile-detail">
                  <span className="label">Name:</span>
                  <span className="value">{user?.displayName || "N/A"}</span>
                </div>
                <div className="profile-detail">
                  <span className="label">Floor:</span>
                  <span className="value">{user?.campus || "Not set"}</span>
                </div>
                <button
                  className="profile-edit-btn"
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
