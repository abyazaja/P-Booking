import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  Trophy,
  Activity,
  AlertCircle,
  Plus,
  TrendingUp,
  MapPin,
  Timer,
  Zap,
  Users,
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Star,
  Target,
  Medal,
  Crown,
  Flame,
  Sparkles
} from "lucide-react";
import { bookingAPI } from "../../../shared/services/bookingAPI";
import { useAuth } from "../../../shared/hooks/AuthContext";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Statistics
  const [totalBookings, setTotalBookings] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await bookingAPI.getUserBookings(user.id);
      if (!error && data) {
        setBookings(data);

        // Calculate statistics
        setTotalBookings(data.length);
        setActiveBookings(data.filter(b => b.status === "pending").length);
        setCompletedBookings(data.filter(b => b.status === "approved").length);

        // Calculate total hours
        const totalHours = data.reduce((sum, b) => {
          const start = parseInt(b.start_time?.split(":")[0] || 0);
          const end = parseInt(b.end_time?.split(":")[0] || 0);
          const duration = end - start;
          return sum + (duration > 0 ? duration : 0);
        }, 0);
        setTotalHours(totalHours);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

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
    return <LoadingSpinner size="lg" text="Memuat dashboard..." />;
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
                    Selamat datang, <span className="text-ballgreen">{user?.name || 'Pemain'}</span>!
                  </h1>
                  <p className="text-gray-600 mt-1">Siap menguasai lapangan hari ini?</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Hari ini: {new Date().toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Anggota sejak {user?.created_at ? new Date(user.created_at).getFullYear() : '2024'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/booking"
                className="flex items-center gap-2 bg-ballgreen hover:bg-ballgreen/90 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Booking Sekarang
              </Link>
              <Link
                to="/BookingHistory"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Lihat Riwayat
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
              <div className="text-3xl font-bold text-gray-900">{totalBookings}</div>
              <div className="text-gray-600 font-medium">Total Booking</div>
              <div className="text-sm text-gray-500">Bulan ini</div>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                +8%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{activeBookings}</div>
              <div className="text-gray-600 font-medium">Booking Aktif</div>
              <div className="text-sm text-gray-500">Menunggu konfirmasi</div>
            </div>
          </div>

          {/* Completed Games */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                +15%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{completedBookings}</div>
              <div className="text-gray-600 font-medium">Permainan Selesai</div>
              <div className="text-sm text-gray-500">Berhasil dimainkan</div>
            </div>
          </div>

          {/* Playing Hours */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                +5h
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">{totalHours}j</div>
              <div className="text-gray-600 font-medium">Jam Bermain</div>
              <div className="text-sm text-gray-500">Total waktu bermain</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ballgreen rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Aktivitas Terkini</h3>
                    <p className="text-gray-500 text-sm">Update booking terbaru Anda</p>
                  </div>
                </div>
                <Link 
                  to="/BookingHistory"
                  className="flex items-center gap-1 text-ballgreen hover:text-ballgreen/80 font-medium text-sm"
                >
                  Lihat Semua
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Siap Mulai Bermain?</h4>
                  <p className="text-gray-600 mb-6">Booking lapangan pertama Anda dan mulai perjalanan futsal!</p>
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 bg-ballgreen text-white px-6 py-3 rounded-xl font-semibold hover:bg-ballgreen/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Booking Lapangan Pertama
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking, index) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            Booking Lapangan #{booking.id?.slice(-4) || 'BARU'}
                          </h4>
                          <span className="text-sm text-gray-500">{booking.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {booking.status === "approved" ? "✓ Disetujui" : 
                             booking.status === "pending" ? "⏳ Menunggu" : "✕ Dibatalkan"}
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

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-ballgreen rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Aksi Cepat</h3>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/booking"
                  className="flex items-center gap-3 p-4 rounded-xl bg-ballgreen/5 hover:bg-ballgreen/10 border border-ballgreen/20 transition-colors group"
                >
                  <div className="w-10 h-10 bg-ballgreen rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-ballgreen">Booking Baru</div>
                    <div className="text-sm text-gray-600">Reservasi lapangan Anda</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ballgreen group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/BookingHistory"
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Riwayat Booking</div>
                    <div className="text-sm text-gray-600">Lihat booking sebelumnya</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Pemain Berkembang</h4>
                  <p className="text-sm text-gray-600">
                    Kemajuan yang bagus! Terus bermain untuk membuka lebih banyak pencapaian.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-ballgreen to-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">65% ke level berikutnya</p>
                  
                  <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-orange-900">Target Berikutnya</span>
                    </div>
                    <p className="text-xs text-orange-700">Selesaikan 3 permainan lagi untuk membuka badge "Pemain Pro"!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;