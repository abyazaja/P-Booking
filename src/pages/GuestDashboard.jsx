import React from 'react';
import HomePage from './Homepage';
import About from './About';
import Contact from './Contact';
import Court from './Courts';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
//import CekMember from './cekmembers';

export default function LandingPage() {
  return (
    <>

      {/* Home Section */}
      <section className="bg-gradient-to-r from-green-100 to-white py-10">
        <HomePage />
      </section>

      {/* About Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <About />
        </div>
      </section>

      {/* Court Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Court />
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-6xl mx-auto px-4">
          <Contact />
        </div>
      </section>
      
      
    </>
  );
}