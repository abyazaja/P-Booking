import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/UserSidebar"; // Adjust path as per your project structure
import Header from "../components/UserHeader"; // Adjust path as per your project structure

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" // Consistent with UserSidebar's lg:hidden
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar (Fixed position) */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      {/* This div needs to account for the fixed sidebar's width on large screens */}
      <div className="flex flex-col flex-1 lg:ml-64 overflow-y-auto"> {/* KEY CHANGE HERE */}
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6"> {/* Remove overflow-auto from here as parent now handles scroll */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;