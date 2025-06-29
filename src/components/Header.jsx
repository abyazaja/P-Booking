// ===== src/components/Header.jsx =====
import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  ChevronDown,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, manage your futsal business
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </a>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    logout();
                    setShowProfile(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;