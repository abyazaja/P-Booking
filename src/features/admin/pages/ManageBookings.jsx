import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Check,
  X,
  Eye,
  MoreVertical,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Activity,
  Settings,
  Crown,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Building
} from "lucide-react";
import { bookingAPI } from "../../../shared/services/bookingAPI";
import { useNotifications } from "../../../shared/hooks/NotificationContext";
import { BOOKING_STATUS } from "../../../shared/constants/supabase";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ date: "", court: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [actionLoading, setActionLoading] = useState(null);

  const { createNotification } = useNotifications();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await bookingAPI.getAllBookings();
      
      if (error) throw error;
      
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Gagal memuat data booking');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId, userName, userEmail) => {
    try {
      setActionLoading(bookingId);
      
      // Get booking details first
      const { data: bookingData, error: fetchError } = await bookingAPI.getBookingById(bookingId);
      if (fetchError) {
        toast.error('Gagal mengambil data booking: ' + fetchError.message);
        throw fetchError;
      }
      
      // Update booking status
      const { data, error } = await bookingAPI.updateBookingStatus(bookingId, BOOKING_STATUS.APPROVED);
      if (error) {
        toast.error('Gagal update status: ' + error.message);
        throw error;
      }
      
      // Create comprehensive notification with payment instructions
      const courtName = bookingData.courts?.name || 'lapangan';
      const bookingDate = new Date(bookingData.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const startTime = bookingData.start_time;
      const endTime = bookingData.end_time;
      
      const notificationMessage = `🎉 BOOKING DISETUJUI!\n\n` +
        `Booking Anda telah disetujui:\n` +
        `📍 Lapangan: ${courtName}\n` +
        `📅 Tanggal: ${bookingDate}\n` +
        `⏰ Waktu: ${startTime} - ${endTime}\n\n` +
        `Langkah selanjutnya:\n` +
        `1. Lakukan pembayaran sesuai tarif yang berlaku\n` +
        `2. Simpan bukti pembayaran\n` +
        `3. Datang 15 menit sebelum waktu main\n` +
        `4. Tunjukkan booking confirmation ini\n\n` +
        `Terima kasih! 🏆`;
      
      await createNotification(
        bookingData.user_id, 
        notificationMessage,
        'success'
      );
      
      toast.success(`Booking untuk ${userName || 'pengguna'} berhasil disetujui`);
      await fetchBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Gagal menyetujui booking: ' + (error.message || error));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId, userName, userEmail) => {
    try {
      setActionLoading(bookingId);
      
      // Get booking details first
      const { data: bookingData, error: fetchError } = await bookingAPI.getBookingById(bookingId);
      if (fetchError) {
        toast.error('Gagal mengambil data booking: ' + fetchError.message);
        throw fetchError;
      }
      
      // Update booking status
      const { data, error } = await bookingAPI.updateBookingStatus(bookingId, BOOKING_STATUS.REJECTED);
      if (error) {
        toast.error('Gagal update status: ' + error.message);
        throw error;
      }
      
      // Create notification with explanation
      const courtName = bookingData.courts?.name || 'lapangan';
      const bookingDate = new Date(bookingData.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const startTime = bookingData.start_time;
      const endTime = bookingData.end_time;
      
      const notificationMessage = `❌ BOOKING DITOLAK\n\n` +
        `Maaf, booking Anda ditolak:\n` +
        `📍 Lapangan: ${courtName}\n` +
        `📅 Tanggal: ${bookingDate}\n` +
        `⏰ Waktu: ${startTime} - ${endTime}\n\n` +
        `Kemungkinan alasan:\n` +
        `• Lapangan sudah dipesan\n` +
        `• Waktu tidak tersedia\n` +
        `• Maintenance lapangan\n\n` +
        `Silakan coba booking waktu lain. 🙏`;
      
      await createNotification(
        bookingData.user_id, 
        notificationMessage,
        'error'
      );
      
      toast.success(`Booking untuk ${userName || 'pengguna'} berhasil ditolak`);
      await fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Gagal menolak booking: ' + (error.message || error));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.courts?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !filter.date || booking.date === filter.date;
    const matchesCourt = !filter.court || 
      booking.courts?.name?.toLowerCase().includes(filter.court.toLowerCase());
    const matchesStatus = !filter.status || booking.status === filter.status;

    return matchesSearch && matchesDate && matchesCourt && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.APPROVED:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case BOOKING_STATUS.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case BOOKING_STATUS.CANCELLED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Memuat data booking..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ballgreen rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Booking</h1>
                <p className="text-gray-600">Kelola dan pantau semua booking lapangan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
                <div className="text-gray-600">Total Booking</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length}
                </div>
                <div className="text-gray-600">Menunggu Persetujuan</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED).length}
                </div>
                <div className="text-gray-600">Disetujui</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === BOOKING_STATUS.REJECTED).length}
                </div>
                <div className="text-gray-600">Ditolak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, email, atau lapangan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ballgreen focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                    value={filter.date}
                    onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lapangan
                  </label>
                  <input
                    type="text"
                    placeholder="Filter berdasarkan lapangan"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                    value={filter.court}
                    onChange={(e) => setFilter({ ...filter, court: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  >
                    <option value="">Semua Status</option>
                    <option value={BOOKING_STATUS.PENDING}>Menunggu</option>
                    <option value={BOOKING_STATUS.APPROVED}>Disetujui</option>
                    <option value={BOOKING_STATUS.REJECTED}>Ditolak</option>
                    <option value={BOOKING_STATUS.CANCELLED}>Dibatalkan</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Booking ({filteredBookings.length})
            </h3>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || filter.date || filter.court || filter.status ? 'Tidak ada booking yang ditemukan' : 'Belum ada booking'}
              </h4>
              <p className="text-gray-600">
                {searchTerm || filter.date || filter.court || filter.status ? 'Coba ubah kata kunci pencarian atau filter' : 'Booking yang dibuat akan muncul di sini'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pengguna
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lapangan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal & Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.users?.name || 'Pengguna Tidak Diketahui'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.users?.email || 'Tidak ada email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.courts?.name || 'Lapangan Tidak Diketahui'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.courts?.location || 'Tidak ada lokasi'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                          {booking.status === BOOKING_STATUS.PENDING ? 'Menunggu' :
                           booking.status === BOOKING_STATUS.APPROVED ? 'Disetujui' :
                           booking.status === BOOKING_STATUS.REJECTED ? 'Ditolak' :
                           booking.status === BOOKING_STATUS.CANCELLED ? 'Dibatalkan' : booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {booking.status === BOOKING_STATUS.PENDING && (
                            <>
                              <button
                                onClick={() => handleAccept(booking.id, booking.users?.name, booking.users?.email)}
                                disabled={actionLoading === booking.id}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-xl text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                              >
                                {actionLoading === booking.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                ) : (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                )}
                                Setujui
                              </button>
                              <button
                                onClick={() => handleReject(booking.id, booking.users?.name, booking.users?.email)}
                                disabled={actionLoading === booking.id}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-xl text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Tolak
                              </button>
                            </>
                          )}
                          {booking.status !== BOOKING_STATUS.PENDING && (
                            <span className={`text-xs ${
                              booking.status === BOOKING_STATUS.APPROVED ? 'text-green-600' : 
                              booking.status === BOOKING_STATUS.REJECTED ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {booking.status === BOOKING_STATUS.APPROVED ? 'Disetujui' : 
                               booking.status === BOOKING_STATUS.REJECTED ? 'Ditolak' : 
                               booking.status === BOOKING_STATUS.CANCELLED ? 'Dibatalkan' : booking.status}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
