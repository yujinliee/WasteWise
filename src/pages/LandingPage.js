import React from 'react'
import "../styles/LandingPage.css";
import landing_icon from "../assets/Landing page main.png";
import aim_icon from "../assets/Aim.png";
import logo_icon from "../assets/Logo.png";

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-text">
          <h1>Smart, Sustainable, and Efficient Waste Management</h1>
          <p>Want to know more about us?</p>
          <button className="signup-btn">Sign Up</button>
        </div>
        <div className="hero-image">
          <img src={landing_icon} alt="Waste management" />
        </div>
      </section>

      {/* Challenges Section */}
      <section id="about" className="challenges">
        <h2>What are the current challenges?</h2>
        <div className="challenge-cards">
          <div className="card">
            <h3>Overflowing trash bins</h3>
            <p>Bins fill up quickly and often remain uncollected, leading to littering and bad odors.</p>
          </div>
          <div className="card">
            <h3>Lack of real-time monitoring</h3>
            <p>Administrators lack live data on bin status, delaying timely waste collection.</p>
          </div>
          <div className="card">
            <h3>Unhygienic environments</h3>
            <p>Poor waste management results in unsanitary conditions that affect students and staff.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="services" className="about">
        <div className="about-text">
          <h2>What does WasteWise aim to solve?</h2>
          <p>
            WasteWise is a smart waste management system designed to monitor and
            maintain cleanliness across NU campus. Using IoT-enabled smart bins,
            it helps reduce overflowing trash cans and unhygienic areas while
            streamlining waste collection and promoting sustainability.
          </p>
          <button className="about-btn">About WasteWise</button>
        </div>
        <div className="about-image">
          <img src={aim_icon} alt="Smart monitoring" />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} WasteWise. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage
