import React, { useState, useEffect } from "react";
import LoginModal from "../pages/LoginModal";
import SignUpModal from "../pages/SignUp";

function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const truck = document.querySelector(".truck-img");
      if (truck) {
        const scrollY = window.scrollY;
        const moveDistance = Math.min(scrollY * 2.5, window.innerWidth - 200);
        truck.style.transform = `translateX(-${moveDistance}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white text-dark">
      {/* Floating button and feature card styles */}
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top border-bottom">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center text-success fw-bold" href="#">
            <span className="me-2">♻️</span> TrashAlign
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <div className="ms-auto d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
              {["home", "about", "impact"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section);
                  }}
                  className={`nav-link mx-lg-3 my-2 my-lg-0 ${
                    activeSection === section ? "fw-bold text-success" : "text-dark"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              ))}
              <div className="d-flex flex-column flex-lg-row gap-2 ms-lg-3 my-2 my-lg-0">
                <button
                  className="btn btn-outline-success"
                  onClick={() => setOpenLogin(true)}
                >
                  Sign in
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setOpenSignUp(true)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="pt-5 mt-5 text-center position-relative">
        <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
          {/* Clouds */}
          <div
            className="position-absolute start-0 w-100"
            style={{ top: "10%", transform: "translateY(-50%)", zIndex: 1 }}
          >
            <img
              src={require("../assets/cloud.png")}
              alt="Clouds"
              className="img-fluid w-100"
              style={{ height: "auto", opacity: 0.7, maxHeight: "300px", objectFit: "cover" }}
            />
          </div>

          {/* Content */}
<div className="position-relative" style={{ zIndex: 3, marginTop: "50px" }}>
  <h1 className="display-4 fw-bold mb-3 mt-3 text-success">
    Welcome to TrashAlign
  </h1>
  <p className="lead mb-4 text-muted">
    Your comprehensive solution for efficient waste management.
  </p>

  <div className="d-flex justify-content-center flex-wrap gap-3 mb-5">
    <button
      className="btn btn-success btn-lg shadow lift floating-btn"
      onClick={() => setOpenSignUp(true)}
    >
      Get Started
    </button>
    <button
      onClick={() => scrollToSection("about")}
      className="btn btn-outline-secondary btn-lg shadow lift floating-btn"
    >
      Learn More
    </button>
  </div>
</div>


          {/* Truck and Trees */}
          <div className="position-relative w-100 overflow-hidden mb-5" style={{ height: "230px", zIndex: 2, marginTop: "20px" }}>
            {/* Trees Layer */}
            <div className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-between px-4" style={{ zIndex: 1 }}>
              {[...Array(4)].map((_, i) => (
                <img
                  key={i}
                  src={require("../assets/tree.png")}
                  alt="Tree"
                  className="img-fluid"
                  style={{ width: "120px", height: "auto" }}
                />
              ))}
            </div>

            {/* Road Line */}
            <div
              className="position-absolute bottom-0 start-0 w-100 bg-secondary"
              style={{ height: "6px", borderRadius: "3px", zIndex: 2 }}
            ></div>

            {/* Truck */}
            <img
              src={require("../assets/truck.png")}
              alt="TrashAlign Truck"
              className="truck-img position-absolute bottom-0 end-0 img-fluid"
              style={{ width: "180px", zIndex: 3, transition: "transform 0.1s ease-out" }}
            />
          </div>

          {/* Features */}
<div className="row mt-5 position-relative" style={{ zIndex: 2 }}>
  {[
    { title: "♻️ Smart Recycling", text: "Intelligent sorting and recycling management.", color: "text-success" },
    { title: "👥 Community Focused", text: "Connect with your community for sustainability.", color: "text-primary" },
    { title: "🛡️ Secure & Reliable", text: "Trust our secure platform with 24/7 monitoring.", color: "text-warning" },
  ].map((feature, index) => (
    <div className="col-md-4 mb-4" key={index}>
      <div className="card shadow border-0 h-100 bg-white floating-feature">
        <div className="card-line"></div>
        <div className="card-body text-center">
          <h5 className={`fw-bold ${feature.color}`}>{feature.title}</h5>
          <p className="text-muted">{feature.text}</p>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="fw-bold text-success mb-4">About TrashAlign</h2>
          <p className="text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
            TrashAlign is an innovative waste management platform designed to
            streamline the process of collection, segregation, and recycling.
            Our mission is to empower communities with smart tools and real-time
            insights to promote sustainability and reduce environmental impact.
          </p>

          <div className="row justify-content-center">
            {[
              { icon: "bi bi-recycle", title: "Eco-Friendly System", text: "We promote zero-waste initiatives and smart recycling habits." },
              { icon: "bi bi-globe2", title: "Community Impact", text: "Connecting citizens, waste collectors, and organizations for cleaner environment." },
              { icon: "bi bi-cpu", title: "Technology Driven", text: "Leveraging data and automation to improve waste tracking and efficiency." },
            ].map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 shadow border-0 floating-feature">
                  <div className="card-line"></div>
                  <div className="card-body text-center">
                    <i className={`${item.icon} text-success fs-1 mb-3`}></i>
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-muted">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-5 bg-white text-center">
        <div className="container">
          <h2 className="fw-bold text-success mb-4">Why TrashAlign Matters</h2>
          <p className="text-muted mb-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
            TrashAlign helps communities reduce waste, recycle efficiently, and create a cleaner, greener environment. Our platform connects people, technology, and sustainability efforts for maximum impact.
          </p>

          <div className="row justify-content-center">
            {[
              { icon: "bi bi-tree", title: "Cleaner Communities", text: "Promoting eco-friendly habits and reducing litter in your neighborhood." },
              { icon: "bi bi-lightning-charge", title: "Efficient Recycling", text: "Smart tools that save time and improve recycling efficiency." },
              { icon: "bi bi-people", title: "Community Engagement", text: "Empowering citizens to actively participate in sustainability efforts." },
            ].map((item, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 shadow border-0 floating-feature">
                  <div className="card-line"></div>
                  <div className="card-body text-center">
                    <i className={`${item.icon} text-success fs-1 mb-3`}></i>
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-muted">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-center text-white py-4">
        <span className="fw-bold text-success d-block mb-2">♻️ TrashAlign</span>
        <p className="mb-0">© 2025 TrashAlign. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <LoginModal open={openLogin} handleClose={() => setOpenLogin(false)} />
      <SignUpModal open={openSignUp} handleClose={() => setOpenSignUp(false)} />
        {/* Add this inside your style tag or CSS file */}
<style>
  {`
    .floating-feature {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .floating-feature:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .card-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0%;
  height: 4px;
  background-color: #28a745; /* green line */
  border-radius: 2px;
  transition: all 0.4s ease;
}

.floating-feature:hover .card-line {
  left: 0;
  width: 100%;
}

/* Floating button */
          .floating-btn {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .floating-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }

          .lift {
            transition: all 0.3s ease;
          }
          .lift:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          }
  `}
</style>
    </div>
  );
}

export default LandingPage;
