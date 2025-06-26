// ===== src/layouts/MainLayout.jsx =====
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Cek jika children adalah AdminDashboard
  const isAdminDashboard = children && children.type && children.type.name === 'AdminDashboard';

  if (isAdminDashboard) {
    // Fullscreen layout tanpa header, tanpa padding
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <div className="flex flex-row flex-1">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 lg:ml-0">
          <Header toggleSidebar={toggleSidebar} />
          <main className="px-6 pb-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
