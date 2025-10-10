import React, { useState } from "react";
import LoginModal from "../pages/LoginModal";
import SignUpModal from "../pages/SignUp";

function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="wastewise-container" style={{ background: '#ffffff' }}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top" style={{ zIndex: 1000 }}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <span className="me-2">♻️</span>
            <span className="fw-bold">TrashAlign</span>
          </a>

          {/* Toggle Button for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <div className="ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
              {["home", "about", "contact"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section);
                  }}
                  className={`nav-link mx-lg-3 my-2 my-lg-0 ${
                    activeSection === section ? "fw-bold text-success" : ""
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
              <div className="d-flex flex-column flex-lg-row gap-2 ms-lg-3 my-2 my-lg-0">
                <button className="btn btn-outline-success" onClick={() => setOpenLogin(true)}>
                  Sign in
                </button>
                <button className="btn btn-success" onClick={() => setOpenSignUp(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
  <section id="home" className="pt-5 mt-5 bg-white">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3 mt-3">
            Welcome to <span className="text-success">TrashAlign</span>
          </h1>
          <p className="lead mb-4">
            Your comprehensive solution for efficient waste management. Join thousands of users who trust TrashAlign to manage their waste responsibly and sustainably.
          </p>
          <div className="d-flex justify-content-center flex-wrap mb-5 gap-3">
            <button className="btn btn-success btn-lg" onClick={() => setOpenSignUp(true)}>
              Get Started Today
            </button>
            <button onClick={() => scrollToSection("about")} className="btn btn-outline-secondary btn-lg">
              Learn More
            </button>
          </div>

          {/* Features Cards */}
          <div className="row">
            {[
              {
                title: "♻️ Smart Recycling",
                text: "Intelligent sorting and recycling management to maximize environmental impact.",
                color: "text-success",
              },
              {
                title: "👥 Community Focused",
                text: "Connect with your community to create a cleaner, more sustainable environment.",
                color: "text-primary",
              },
              {
                title: "🛡️ Secure & Reliable",
                text: "Trust in our secure platform with 24/7 monitoring and reliable service.",
                color: "text-warning",
              },
            ].map((feature, index) => (
              <div className="col-md-4" key={index}>
                <div className="card shadow-sm p-3 mb-4 h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className={`card-title ${feature.color}`}>{feature.title}</h5>
                    <p className="card-text flex-grow-1">{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
  <section id="about" className="pt-5 mt-5 bg-white">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">About TrashAlign</h2>
          <p className="text-center mb-5">
            We're revolutionizing waste management with innovative technology and sustainable practices.
          </p>
          <div className="row">
            <div className="col-md-6">
              <h4 className="fw-bold">Our Mission</h4>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">Reduce waste by up to 40% through smart scheduling and optimization</li>
                <li className="list-group-item">Connect communities with local recycling and composting programs</li>
                <li className="list-group-item">Provide real-time tracking and analytics for waste management</li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Why Choose TrashAlign?</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">🌱 Eco-Friendly Solutions</li>
                    <li className="list-group-item">💰 Cost Effective (reduce costs up to 30%)</li>
                    <li className="list-group-item">👌 Easy to Use with intuitive interface</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
  <section id="contact" className="pt-5 mt-5 bg-white">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Get in Touch</h2>
          <p className="text-center mb-5">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          <div className="row">
            <div className="col-md-6 mb-4">
              <h4 className="fw-bold">Contact Information</h4>
              <ul className="list-group">
                <li className="list-group-item">📞 Phone: +1 (555) 123-4567</li>
                <li className="list-group-item">📧 Email: contact@trashalign.com</li>
                <li className="list-group-item">📍 Address: 123 Green Street, Eco City, EC 12345</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h4 className="fw-bold">Send us a Message</h4>
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" placeholder="Your name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="your.email@example.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea className="form-control" rows="4" placeholder="Your message..."></textarea>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Message sent successfully!")}
                  className="btn btn-success w-100"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <span className="d-block mb-2">♻️ TrashAlign</span>
          <p className="mb-0">
            © 2025 TrashAlign. All rights reserved. Making waste management smarter and more sustainable.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(false)} />
            <SignUpModal open={openSignUp} handleClose={() => setOpenSignUp(false)} />
    </div>
  );
}

export default LandingPage;