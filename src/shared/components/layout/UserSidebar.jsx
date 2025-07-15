import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  List,
  LogOut,
  X,
} from "lucide-react";
import BallLogo from '../ui/BallLogo';
import { useAuth } from '../../hooks/AuthContext';

const UserSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getActiveMenuId = (path) => {
    if (path.startsWith("/BookingHistory")) return "BookHis";
    if (path.startsWith("/booking")) return "bookings";
    return "dashboard";
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenuId(location.pathname));

  React.useEffect(() => {
    setActiveMenu(getActiveMenuId(location.pathname));
  }, [location.pathname]);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", to: "/dashboard" },
    { id: "bookings", icon: Calendar, label: "Bookings", to: "/booking" },
    { id: "BookHis", icon: List, label: "Booking History", to: "/BookingHistory" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/guestdashboard'); // Redirect user to guest dashboard
    toggleSidebar(); // Close sidebar for mobile after logout
  };

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
          fixed top-0 h-screen z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <BallLogo size={40} />
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                  P-Booking
                </h2>
                <p className="text-xs text-gray-500">User Panel</p>
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
                    onClick={() => {
                      setActiveMenu(item.id);
                      toggleSidebar();
                    }}
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

          {/* User Profile / Logout Section */}
          <div className="px-4 pb-6 mt-auto">
            <button
              onClick={handleLogout} // Corrected: Removed the inline comment
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;