import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-blue-50 overflow-hidden">
      {/* Sidebar - Tetap di posisi normal document flow */}
      <div 
        className={`fixed lg:relative z-30 w-64 h-full transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out`}
      >
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed position */}
        <div className="fixed top-0 left-0 right-0 z-20 lg:left-64">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content - Padding atas untuk header */}
        <main className="flex-1 overflow-auto pt-16 mt-0 z-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}