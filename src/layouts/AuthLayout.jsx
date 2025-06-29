import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import BallLogo from '../components/BallLogo';

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-green-300/20 rounded-full blur-xl animate-pulse"></div>
    <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
    <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-pulse delay-500"></div>
  </div>
);

const AnimatedBackground = () => (
  <div className="absolute inset-0 opacity-20">
    <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-transparent to-orange-100"></div>
    <div className="absolute inset-0 animate-float" style={{
      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                       radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)`
    }}>
    </div>
  </div>
);

export default function AuthLayout() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white via-gray-100 to-white w-full relative overflow-hidden">
      <AnimatedBackground />

      {/* Mouse tracker glow */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-green-300/10 to-orange-300/10 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      ></div>

      {/* Kiri - Branding */}
      <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center p-12 relative">
        <FloatingShapes />
        <div className="max-w-lg text-center relative z-10">
          <div className="mb-8 relative">
            <BallLogo size={140} className="mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-green-400/30 rounded-full animate-spin-slow"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 border border-orange-400/20 rounded-full animate-spin-slow-reverse"></div>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-orange-400 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome to     
            </h1>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600   via-orange-400 to-green-600 bg-clip-text text-transparent mb-6 leading-tight">     
              P-Booking
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed font-light">
              Experience the next generation of 
              <span className="text-green-500 font-medium"> sports management</span> and 
              <span className="text-orange-500 font-medium"> analytics</span>
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-300/40">
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Smart Booking</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Real Analytics</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Easy Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanan - Form */}
      <div className="flex-1 lg:flex-none lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 relative">
        <div className="flex justify-center mb-8 lg:hidden">
          <BallLogo size={64} />
        </div>
        <div className="w-full max-w-md relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-orange-400/10 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-3xl"></div>
            <div className="relative z-10">
              <Outlet />
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-300 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-300 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
