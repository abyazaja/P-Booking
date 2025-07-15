import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  Activity,
  TrendingUp,
  Clock,
  Trophy,
  Eye,
  Settings,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowUpRight,
  Plus,
  BookOpen,
  MessageSquare,
  Crown,
  Target,
  Zap,
  User,
  Building
} from 'lucide-react';

// Import your API services
import { bookingAPI } from '../../../shared/services/bookingAPI';
import { courtAPI } from '../../../shared/services/courtAPI';
import { authAPI } from '../../../shared/services/authAPI';
import { messagesAPI } from '../../../shared/services/messageAPI';
import { BOOKING_STATUS } from '../../../shared/constants/supabase';
import { COURT_STATUS } from '../../../shared/constants/supabase';
import { useAuth } from '../../../shared/hooks/AuthContext';
import LoadingSpinner from '../../../shared/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Statistics
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    totalCourts: 0,
    activeCourts: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [bookingsRes, courtsRes, usersRes, messagesRes] = await Promise.all([
          bookingAPI.getAllBookings(),
          courtAPI.getAllCourts(),
          authAPI.getAllUsers(),
          messagesAPI.fetchMessages(),
        ]);

        // Calculate booking statistics
        const bookings = bookingsRes.data || [];
        const courts = courtsRes.data || [];
        const users = usersRes.data || [];
        const messages = messagesRes.data || [];

        const pendingBookings = bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length;
        const approvedBookings = bookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length;
        const rejectedBookings = bookings.filter(b => b.status === BOOKING_STATUS.REJECTED).length;
        const activeCourts = courts.filter(c => c.status === COURT_STATUS.ACTIVE).length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        const unreadMessages = messages.filter(m => !m.read).length;

        setStats({
          totalBookings: bookings.length,
          pendingBookings,
          approvedBookings,
          rejectedBookings,
          totalCourts: courts.length,
          activeCourts,
          totalUsers: users.length,
          activeUsers,
          totalMessages: messages.length,
          unreadMessages,
        });

        // Set recent data
        setRecentBookings(bookings.slice(0, 5));
        setRecentUsers(users.slice(0, 5));

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const formatTime = (time24) => {
    if (!time24) return "-";
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Memuat dashboard admin..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-ballgreen rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Admin, <span className="text-ballgreen">{user?.name || 'Admin'}</span>!
                  </h1>
                  <p className="text-gray-600 mt-1">Kelola sistem booking futsal dengan mudah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Hari ini: {new Date().toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Panel Administrator</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/admin/bookings"
                className="flex items-center gap-2 bg-ballgreen hover:bg-ballgreen/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
              >
                <Eye className="w-5 h-5" />
                Kelola Booking
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <Users className="w-5 h-5" />
                Kelola Pengguna
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
              <div className="text-gray-600 font-medium">Total Booking</div>
              <div className="text-sm text-gray-500">Semua waktu</div>
            </div>
          </div>

          {/* Pending Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-sm font-medium">
                <AlertCircle className="w-3 h-3" />
                Perlu Aksi
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</div>
              <div className="text-gray-600 font-medium">Menunggu Persetujuan</div>
              <div className="text-sm text-gray-500">Butuh review</div>
            </div>
          </div>

          {/* Active Courts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm font-medium">
                <CheckCircle className="w-3 h-3" />
                Aktif
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{stats.activeCourts}</div>
              <div className="text-gray-600 font-medium">Lapangan Aktif</div>
              <div className="text-sm text-gray-500">Dari {stats.totalCourts} total</div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                +8%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
              <div className="text-gray-600 font-medium">Total Pengguna</div>
              <div className="text-sm text-gray-500">{stats.activeUsers} aktif</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ballgreen rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Booking Terbaru</h3>
                    <p className="text-gray-500 text-sm">Aktivitas booking terkini</p>
                  </div>
                </div>
                <Link 
                  to="/admin/bookings"
                  className="flex items-center gap-1 text-ballgreen hover:text-ballgreen/80 font-medium text-sm"
                >
                  Lihat Semua
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Booking</h4>
                  <p className="text-gray-600">Booking baru akan muncul di sini</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        booking.status === 'approved' ? 'bg-green-100' :
                        booking.status === 'pending' ? 'bg-yellow-100' :
                        'bg-red-100'
                      }`}>
                        {booking.status === 'approved' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : booking.status === 'pending' ? (
                          <Clock className="w-6 h-6 text-yellow-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            Booking #{booking.id?.slice(-4) || 'BARU'}
                          </h4>
                          <span className="text-sm text-gray-500">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Pengguna ID: {booking.user_id?.slice(-4) || 'Unknown'}</span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {booking.status === "approved" ? "✓ Disetujui" : 
                             booking.status === "pending" ? "⏳ Menunggu" : "✕ Ditolak"}
                          </span>
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-ballgreen rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Aksi Admin</h3>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/admin/bookings"
                  className="flex items-center gap-3 p-4 rounded-xl bg-ballgreen/5 hover:bg-ballgreen/10 border border-ballgreen/20 transition-colors group"
                >
                  <div className="w-10 h-10 bg-ballgreen rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-ballgreen">Kelola Booking</div>
                    <div className="text-sm text-gray-600">Setujui & tolak booking</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ballgreen group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/admin/courts"
                  className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-600">Kelola Lapangan</div>
                    <div className="text-sm text-gray-600">Tambah & edit lapangan</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/admin/users"
                  className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-purple-600">Kelola Pengguna</div>
                    <div className="text-sm text-gray-600">Atur akun pengguna</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Status Sistem</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Database</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">Normal</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">Server</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-700">Total Pengguna</span>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold">{stats.totalUsers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-700">Booking Pending</span>
                  </div>
                  <span className="text-xs text-yellow-600 font-semibold">{stats.pendingBookings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;