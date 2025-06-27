import React from "react";
import { Bell, User, Menu } from "lucide-react"; // Import Menu for the toggle button

const UserHeader = ({ toggleSidebar }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors -ml-2" // Adjusted margin for visual alignment
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-auto lg:mx-0 lg:ml-8"> {/* Centered for smaller screens, then shifted left */}
            <input
              type="text"
              placeholder="Search here..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-sm sm:text-base transition-all duration-200"
            />
          </div>

          {/* User Actions (Notifications & Profile) */}
          <div className="flex items-center gap-3 sm:gap-4 ml-4"> {/* Increased margin and gap */}
            {/* Notification Bell */}
            <button className="relative p-2 rounded-full hover:bg-green-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 shadow-sm text-sm sm:text-base"> {/* Enhanced styling */}
              <span className="font-semibold text-gray-700">Hello,</span>
              <span className="font-bold text-green-600">Budi Santoso</span>
              <User className="w-6 h-6 text-green-500 ml-1" /> {/* Slightly larger icon */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;