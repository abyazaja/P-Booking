// ===== src/components/BallLogo.jsx =====
import React from 'react';

const BallLogo = ({ size = 32, className = "" }) => (
  <div className={`inline-flex items-center ${className}`}>
    <div className="relative">
      <div 
        className="rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-1 rounded-full bg-white/30 border border-white/50">
          <div className="absolute inset-1 rounded-full bg-orange-400"></div>
        </div>
      </div>
    </div>
  </div>
);

export default BallLogo;