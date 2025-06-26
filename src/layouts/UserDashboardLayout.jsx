import React from "react";
import { Calendar, User, Bell, List, Home, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const sidebarMenu = [
  { label: "Dashboard", icon: Home, to: "/dashboard" },
  { label: "Bookings", icon: Calendar, to: "/dashboard/bookings" },
  { label: "My Schedule", icon: List, to: "/dashboard/schedule" },
  { label: "Profile", icon: User, to: "/dashboard/profile" },
];

const UserDashboardLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar */}
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="flex items-center gap-2 px-6 py-6 border-b">
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <span className="text-2xl font-bold text-gray-800">
          P- <span className="text-green-500">Booking</span>
        </span>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {sidebarMenu.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-700 font-medium hover:bg-green-50 transition"
              >
                <item.icon className="w-5 h-5 text-green-500" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 pb-6 mt-auto">
        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
    {/* Header & Main */}
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-8 py-4 border-b shadow-sm">
        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />
        </div>
        <div className="flex items-center gap-4 ml-8">
          <button className="relative p-2 rounded-full hover:bg-green-50">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg">
            <span className="text-sm font-semibold text-gray-700">Hello,</span>
            <span className="font-bold text-green-600">Budi Santoso</span>
            <User className="w-7 h-7 text-green-500 ml-2" />
          </div>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);

export default UserDashboardLayout; 