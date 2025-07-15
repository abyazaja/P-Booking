// src/components/DashboardContent.jsx
import React from "react";
import HomePage from "./Homepage";
import About from "./About";
import Contact from "./Contact";
import Court from "../../features/courts/pages/Courts";
// import Footer from "../components/Footer"; // Footer akan dikelola di UserDashboardLayout
// import Navbar from "../components/Navbar"; // Navbar akan dikelola di UserDashboardLayout

export default function LandingPage() {
  return (
    <>
      {/* Home Section */}
      <section id="dashboard-section" className="bg-gradient-to-r from-green-100 to-white py-10 min-h-screen flex items-center justify-center">
        <HomePage />
      </section>

      {/* About Section */}
      <section id="about-section" className="bg-gradient-to-r from-green-100 to-white py-10 min-h-screen flex items-center justify-center">
        <div className="w-full mx-auto px-4">
          <About />
        </div>
      </section>

      {/* Court Section */}
      <section id="court-section" className="bg-gradient-to-r from-green-100 to-white py-10 min-h-screen flex items-center justify-center">
        <div className="w-full mx-auto px-4 text-center">
          <Court />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="bg-gradient-to-r from-green-100 to-white py-10 min-h-screen flex items-center justify-center">
        <div className="w-full mx-auto px-4">
          <Contact />
        </div>
      </section>
    </>
  );
}