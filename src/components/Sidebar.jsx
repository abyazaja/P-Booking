// ===== src/components/Sidebar.jsx =====
import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  MapPin,
  X,
  User,
  LogOut
} from 'lucide-react';
import BallLogo from './BallLogo';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', active: true },
    { id: 'bookings', icon: Calendar, label: 'Bookings', badge: '8' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'courts', icon: MapPin, label: 'Courts' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
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
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <BallLogo size={40} />
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                  Planet Futsal
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
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                      ${activeMenu === item.id 
                        ? 'bg-gradient-to-r from-green-50 to-orange-50 text-green-700 shadow-sm border border-green-100' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${activeMenu === item.id ? 'text-green-600' : ''}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@planetfutsal.com</p>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;