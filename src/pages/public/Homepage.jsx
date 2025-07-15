import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Trophy, Calendar, Star, Play, Award, Target, ChevronRight } from 'lucide-react';

const BallLogo = ({ size = 48, className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`}>
    <div 
      className="rounded-full bg-gradient-to-br from-ballgreen to-ballorange shadow-lg animate-bounce"
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
        <div className="w-3/4 h-3/4 rounded-full border-2 border-white/40"></div>
      </div>
    </div>
  </div>
);

const GlowingCard = ({ children, className = "", glowColor = "ballgreen" }) => (
  <div className={`relative group ${className}`}>
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor} to-ballorange rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}></div>
    <div className="relative bg-white rounded-2xl p-6 shadow-xl">
      {children}
    </div>
  </div>
);

const Homepage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const hour = new Date().getHours();
      setIsOpen(hour >= 8 && hour < 23);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: Calendar, title: "Easy Booking", desc: "Book courts in seconds" },
    { icon: Users, title: "Team Management", desc: "Organize your squad" },
    { icon: Trophy, title: "Tournaments", desc: "Join competitions" },
    { icon: Star, title: "Premium Courts", desc: "Top-quality facilities" }
  ];

  const stats = [
    { number: "500+", label: "Happy Players" },
    { number: "50+", label: "Tournaments" },
    { number: "24/7", label: "Support" },
    { number: "5★", label: "Rating" }
  ];

  return (
    <div className="">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/5 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-7xl font-black mb-4 bg-gradient-to-r from-ballgreen via-green-500 to-ballorange bg-clip-text text-transparent animate-pulse">
              Planet Futsal
            </h1>
            
            <p className="text-lg md:text-2xl mb-8 text-gray-700 font-light">
              Book your futsal court online with ease and style!
            </p>

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-md rounded-full px-6 py-3 mb-8">
              <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-black font-medium">
                {isOpen ? 'Open Now' : 'Closed'} • {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <GlowingCard glowColor="ballgreen">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-8 h-8 text-ballgreen" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Our Location</h3>
                  <p className="text-gray-600">Find us easily</p>
                </div>
              </div>
              <p className="text-gray-700 font-medium">Jl. Sport Center No. 123, Cityville</p>
            </GlowingCard>

            <GlowingCard glowColor="ballorange">
              <div className="flex items-center gap-4 mb-4">
                <Clock className="w-8 h-8 text-ballorange" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Business Hours</h3>
                  <p className="text-gray-600">We're here when you need us</p>
                </div>
              </div>
              <p className="text-gray-700 font-medium">Monday - Sunday: 08:00 - 23:00</p>
            </GlowingCard>
          </div>

          {/* Stats Section */}
          <div className="bg-black/5 backdrop-blur-md rounded-3xl p-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-ballgreen mb-2">{stat.number}</div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
            <a 
              href="/login" 
              className="group relative overflow-hidden px-12 py-4 bg-gradient-to-r from-ballgreen to-emerald-600 text-white rounded-full text-xl font-bold shadow-2xl hover:shadow-ballgreen/25 transition-all duration-300 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Login & Play
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-ballgreen transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </a>
            
            <a 
              href="/register" 
              className="group relative overflow-hidden px-12 py-4 bg-gradient-to-r from-ballorange to-orange-600 text-white rounded-full text-xl font-bold shadow-2xl hover:shadow-ballorange/25 transition-all duration-300 text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                Join Planet
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-ballorange transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </a>
          </div>
        </div>
      </div>

      {/* Removed the style jsx tag and moved to CSS module or global CSS */}
    </div>
  );
};

export default Homepage;