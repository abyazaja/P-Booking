// ===== src/components/Header.jsx =====
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

const Header = ({ toggleSidebar }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate(); // ← gunakan useNavigate
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@planetfutsal.com"
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('name, email')
            .eq('id', user.id)
            .single();

          if (data) {
            setAdminData({
              name: data.name || "Admin User",
              email: data.email || "admin@planetfutsal.com"
            });
          }

          if (error) {
            console.error("Error fetching user data from Supabase:", error);
          }
        }
      } catch (error) {
        console.error("Error in fetchAdminData:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    await logout();           // pastikan logout selesai
    navigate('/admin/login'); // arahkan ke halaman login
  };

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
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {adminData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-gray-700 font-medium hidden lg:block">
                  {adminData.name}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    <p className="font-semibold">{adminData.name}</p>
                    <p className="text-gray-500 truncate">{adminData.email}</p>
                  </div>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
