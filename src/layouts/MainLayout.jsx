// ===== src/layouts/MainLayout.jsx =====
import React, { useState } from 'react';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
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
