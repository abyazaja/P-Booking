import React, { useEffect, useState } from "react";
import { Bell, User, Menu } from "lucide-react";
import { supabase } from "../../constants/supabase"; // Sesuaikan path ke supabase client

const UserHeader = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState("Loading..."); // Default state

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // 1. Dapatkan session user yang sedang login dari Supabase
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 2. Ambil data lengkap user dari tabel `users` berdasarkan ID
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          // 3. Set nama user (asumsi struktur: `name` atau `first_name + last_name`)
          const fullName = 
            userData.name || 
            `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
          
          setUserName(fullName || "User"); // Fallback jika nama kosong
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUserName("User"); // Fallback jika error
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors -ml-2"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-auto lg:mx-0 lg:ml-8">
            
          </div>

          {/* User Actions (Notifications & Profile) */}
          <div className="flex items-center gap-3 sm:gap-4 ml-4">
            

            {/* User Profile Info */}
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 shadow-sm text-sm sm:text-base">
              <span className="font-semibold text-gray-700">Hello,</span>
              <span className="font-bold text-green-600">{userName}</span>
              <User className="w-6 h-6 text-green-500 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;