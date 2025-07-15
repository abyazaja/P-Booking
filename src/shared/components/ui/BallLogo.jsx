import React from 'react';
import Logo from '../../../assets/logo.png'; // IMPOR LOGO DARI PATH YANG BENAR

const BallLogo = ({ size = 32, className = "" }) => {
  // Ukuran dasar untuk div container
  const containerStyle = {
    width: size,
    height: size,
  };

  // Gaya untuk gambar di dalamnya (agar pas dan tidak terdistorsi)
  const imageStyle = {
    width: '100%', // Ambil 100% lebar dari container
    height: '100%', // Ambil 100% tinggi dari container
    objectFit: 'contain', // Pastikan gambar pas tanpa terdistorsi
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Ini adalah div yang akan mendapatkan gaya "bola" dari sebelumnya */}
      <div 
        className="relative rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg flex items-center justify-center overflow-hidden"
        style={containerStyle} // Terapkan ukuran ke div container ini
      >
       
       
        <div className="absolute inset-1 rounded-full bg-white/30 border border-white/50 flex items-center justify-center">
          <div className="absolute inset-1 rounded-full bg-orange-400"></div>
        </div>

        <img
          src={Logo} 
          alt="Aplikasi Futsal"
          style={imageStyle}
          className="z-10" 
        />
      </div>
    </div>
  );
};

export default BallLogo;