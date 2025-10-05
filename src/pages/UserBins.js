import React, { useState } from "react";
import "../styles/UserBins.css";
import NavbarUser from "../Components/NavbarUser";

const UserBins = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const bins = [
    { id: 1, name: "Bin 101", location: "Main Street", status: "Full", lastEmptied: "2 days ago" },
    { id: 2, name: "Bin 102", location: "North District", status: "Available", lastEmptied: "5 hours ago" },
    { id: 3, name: "Bin 103", location: "South Park", status: "Full", lastEmptied: "1 day ago" },
  ];

  const filteredBins = bins.filter(
    (bin) =>
      bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="userbins-container">
      {/* Sidebar */}
      <NavbarUser />

      {/* Main Content */}
      <main className="userbins-main">
        <header className="header-section">
          <h1>Nearby Bins</h1>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </header>

        {/* Bins List */}
        <div className="bins-list">
          {filteredBins.length > 0 ? (
            filteredBins.map((bin) => (
              <div key={bin.id} className="bin-card">
                <div className="bin-details">
                  <h3>{bin.name}</h3>
                  <p className="location">{bin.location}</p>
                  <p className={`status ${bin.status.toLowerCase()}`}>
                    {bin.status === "Full" ? "🟥 Full" : "🟩 Available"}
                  </p>
                  <span className="last-emptied">Last emptied: {bin.lastEmptied}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">No bins found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserBins;
