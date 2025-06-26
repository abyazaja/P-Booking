import React from 'react';
import { MapPin, Clock, Users, Trophy, Calendar, Star } from 'lucide-react';
import GuestLayout from '../layouts/GuestLayout';
import BallLogo from '../components/BallLogo';

// Mock BallLogo component
const BallLogoComponent = ({ size = 64, className = "" }) => (
  <div className={`inline-flex items-center ${className}`}>
    <div className="relative">
      <div 
        className="rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-2 rounded-full bg-white/30 border-2 border-white/50">
          <div className="absolute inset-2 rounded-full bg-orange-400"></div>
        </div>
      </div>
    </div>
  </div>
);

const Homepage = () => (
    <div className="w-full max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-6 md:p-10 text-center relative overflow-hidden">
      <BallLogo size={64} className="justify-center mb-4 mx-auto" />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-ballblack">Planet Futsal</h1>
      <p className="text-base md:text-lg mb-6 text-ballblack/80">Book your futsal court online with ease and style!</p>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-ballgreen/10 rounded-full p-4 flex flex-col items-center">
          <p className="font-semibold text-ballgreen">Location</p>
          <p className="text-ballblack text-sm md:text-base">Jl. Sport Center No. 123, Cityville</p>
        </div>
        <div className="bg-ballorange/10 rounded-full p-4 flex flex-col items-center">
          <p className="font-semibold text-ballorange">Business Hours</p>
          <p className="text-ballblack text-sm md:text-base">Mon-Sun: 08:00 - 23:00</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mt-8">
        <a href="/login" className="flex-1 px-8 py-3 bg-ballgreen text-white rounded-full text-lg font-semibold shadow-lg hover:bg-ballgreen/90 transition text-center">Login</a>
        <a href="/register" className="flex-1 px-8 py-3 bg-ballorange text-white rounded-full text-lg font-semibold shadow-lg hover:bg-ballorange/90 transition text-center">Register</a>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <a href="/about" className="px-6 py-2 rounded-full bg-ballgreen/10 text-ballgreen font-semibold hover:bg-ballgreen/20 transition">About</a>
        <a href="/courts" className="px-6 py-2 rounded-full bg-ballorange/10 text-ballorange font-semibold hover:bg-ballorange/20 transition">Courts</a>
        <a href="/contact" className="px-6 py-2 rounded-full bg-ballblack/10 text-ballblack font-semibold hover:bg-ballblack/20 transition">Contact</a>
      </div>
    </div>
);

export default Homepage;