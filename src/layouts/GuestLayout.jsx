// src/layouts/UserDashboardLayout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Pastikan ini mengacu ke komponen Navbar Anda
import Footer from "../components/Footer";
// TIDAK ADA LAGI import DashboardContent di sini

export default function GuestLayout() {
  return (
    <div id="app-container" className="bg-gradient-to-br from-ballwhite to-ballgray min-h-screen w-full flex">
      <div id="layout-wrapper" className="flex flex-col flex-1 w-full">
        <Navbar /> {/* Ini adalah Navbar yang Anda buat (UserHeader) */}

        <main className="flex-1 overflow-y-auto"> {/* Tambahkan main dan overflow-y-auto untuk scrolling */}
          <Outlet /> {/* Outlet akan merender komponen yang sesuai dengan rute */}
        </main>

        <Footer />
      </div>
    </div>
  );
}