import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GuestLayout() {
  return (
    <div id="app-container" className="bg-gradient-to-br from-ballwhite to-ballgray min-h-screen w-full flex">
      <div id="layout-wrapper" className="flex flex-col flex-1 w-full">
        <Navbar />
        
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
          <Footer />
    
      </div>
    </div>
  );
}