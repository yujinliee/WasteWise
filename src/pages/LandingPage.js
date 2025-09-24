import React, { useState } from "react";
import "../styles/LandingPage.css";

// Modals
import LoginModal from "../pages/LoginModal";
import SignUpModal from "../pages/SignUp";

function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="wastewise-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="brand-icon">
              <span className="icon">♻️</span>
            </div>
            <span className="brand-text">WasteWise</span>
          </div>
          
          <div className="nav-links">
            <button 
              onClick={() => scrollToSection('home')}
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Contact
            </button> 
            <button 
              className="loginLanding-btn" onClick={() => setOpenLogin(true)}>
              Log in
            </button>
            <button 
              className="signupLanding-btn" onClick={() => setOpenSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="home-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">WasteWise</span>
            </h1>
            <p className="hero-description">
              Your comprehensive solution for efficient waste management. 
              Join thousands of users who trust WasteWise to manage their waste responsibly and sustainably.
            </p>
            
            <div className="hero-buttons">
              <button 
                className="btn-primary" onClick={() => setOpenSignUp(true)}
              >
                Get Started Today
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="btn-secondary"
              >
                Learn More
              </button>
            </div>

            {/* Features Cards */}
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon green">
                  <span className="icon">♻️</span>
                </div>
                <h3 className="feature-title">Smart Recycling</h3>
                <p className="feature-description">
                  Intelligent sorting and recycling management to maximize environmental impact.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon blue">
                  <span className="icon">👥</span>
                </div>
                <h3 className="feature-title">Community Focused</h3>
                <p className="feature-description">
                  Connect with your community to create a cleaner, more sustainable environment.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon purple">
                  <span className="icon">🛡️</span>
                </div>
                <h3 className="feature-title">Secure & Reliable</h3>
                <p className="feature-description">
                  Trust in our secure platform with 24/7 monitoring and reliable service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About WasteWise</h2>
            <p className="section-description">
              We're revolutionizing waste management with innovative technology and sustainable practices.
            </p>
          </div>

          <div className="about-content">
            <div className="about-text">
              <h3 className="content-title">Our Mission</h3>
              <p className="content-description">
                At WasteWise, we believe in creating a sustainable future through intelligent waste management solutions. 
                Our platform connects communities, businesses, and waste management services to optimize collection routes, 
                reduce environmental impact, and promote recycling initiatives.
              </p>
              
              <div className="mission-points">
                <div className="mission-point">
                  <div className="bullet"></div>
                  <p>Reduce waste by up to 40% through smart scheduling and optimization</p>
                </div>
                <div className="mission-point">
                  <div className="bullet"></div>
                  <p>Connect communities with local recycling and composting programs</p>
                </div>
                <div className="mission-point">
                  <div className="bullet"></div>
                  <p>Provide real-time tracking and analytics for waste management</p>
                </div>
              </div>
            </div>
            
            <div className="about-card">
              <h3 className="card-title">Why Choose WasteWise?</h3>
              <div className="card-items">
                <div className="card-item">
                  <h4 className="item-title">Eco-Friendly Solutions</h4>
                  <p className="item-description">Promoting sustainable practices for a greener planet</p>
                </div>
                <div className="card-item">
                  <h4 className="item-title">Cost Effective</h4>
                  <p className="item-description">Reduce waste management costs by up to 30%</p>
                </div>
                <div className="card-item">
                  <h4 className="item-title">Easy to Use</h4>
                  <p className="item-description">Intuitive interface designed for everyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-description">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <h3 className="content-title">Contact Information</h3>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon green">
                    <span className="icon">📞</span>
                  </div>
                  <div className="contact-details">
                    <h4 className="contact-label">Phone</h4>
                    <p className="contact-value">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon blue">
                    <span className="icon">📧</span>
                  </div>
                  <div className="contact-details">
                    <h4 className="contact-label">Email</h4>
                    <p className="contact-value">contact@wastewise.com</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="contact-icon purple">
                    <span className="icon">📍</span>
                  </div>
                  <div className="contact-details">
                    <h4 className="contact-label">Address</h4>
                    <p className="contact-value">123 Green Street, Eco City, EC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h3 className="content-title">Send us a Message</h3>
              <div className="contact-form">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Your name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea 
                    rows="4"
                    className="form-input form-textarea"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button 
                  onClick={() => alert('Message sent successfully!')}
                  className="btn-primary full-width"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-icon">
                <span className="icon">♻️</span>
              </div>
              <span className="brand-text">WasteWise</span>
            </div>
            <p className="footer-text">
              © 2025 WasteWise. All rights reserved. Making waste management smarter and more sustainable.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(false)} />
      <SignUpModal open={openSignUp} handleClose={() => setOpenSignUp(false)} />
    </div>
  );
}

export default LandingPage;
