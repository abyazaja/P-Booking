import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import {
  Home,
  Calendar,
  Users,
  BarChart3,
  Settings,
  MapPin,
  X,
  User,
  LogOut,
  Mail, // Added Mail icon for messages
} from "lucide-react";
import BallLogo from "../ui/BallLogo";
import { useAuth } from '../../hooks/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const { logout } = useAuth(); // Get logout function from AuthContext

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", to: "/admin/dashboard" },
    {
      id: "bookings",
      icon: Calendar,
      label: "Bookings",
      to: "/admin/bookings"
    },
    { id: "users", icon: Users, label: "Users", to: "/admin/users" },
    { id: "courts", icon: MapPin, label: "Courts", to: "/admin/courts" },
    // New Messages menu item
    {
      id: "messages",
      icon: Mail,
      label: "Messages",
      to: "/admin/messages",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static left-0 top-0 h-screen z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <BallLogo size={40} />
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                  P-Booking
                </h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    onClick={() => setActiveMenu(item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                      ${
                        activeMenu === item.id
                          ? "bg-gradient-to-r from-green-50 to-orange-50 text-green-700 shadow-sm border border-green-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon
                        className={`w-5 h-5 ${
                          activeMenu === item.id ? "text-green-600" : ""
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          
        </div>
      </div>
    </>
  );
};

export default Sidebar;