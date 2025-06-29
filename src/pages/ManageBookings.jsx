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
} from "lucide-react";
import { bookingAPI } from "../services/bookingAPI";
import { useNotifications } from "../context/NotificationContext";
import { BOOKING_STATUS } from "../config/supabase";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId, userName, userEmail) => {
    try {
      setActionLoading(bookingId);
      const { data, error } = await bookingAPI.updateBookingStatus(bookingId, BOOKING_STATUS.APPROVED);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: BOOKING_STATUS.APPROVED } : booking
      ));
      
      // Create notification for user
      await createNotification(
        data.user_id, 
        `Booking Anda untuk ${data.courts.name} pada ${data.date} telah disetujui!`, 
        'success'
      );
      
      toast.success(`Booking for ${userName} approved successfully`);
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Failed to approve booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (bookingId, userName, userEmail) => {
    try {
      setActionLoading(bookingId);
      const { data, error } = await bookingAPI.updateBookingStatus(bookingId, BOOKING_STATUS.REJECTED);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: BOOKING_STATUS.REJECTED } : booking
      ));
      
      // Create notification for user
      await createNotification(
        data.user_id, 
        `Maaf, booking Anda untuk ${data.courts.name} pada ${data.date} telah ditolak.`, 
        'error'
      );
      
      toast.success(`Booking for ${userName} rejected successfully`);
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Booking Management
              </h1>
              <p className="text-gray-600">Manage and track all court bookings</p>
            </div>
            <button
              onClick={fetchBookings}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  {bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED).length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter((b) => b.status === BOOKING_STATUS.REJECTED).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or court..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filter.date}
                    onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Court
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by court"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filter.court}
                    onChange={(e) => setFilter({ ...filter, court: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  >
                    <option value="">All Status</option>
                    <option value={BOOKING_STATUS.PENDING}>Pending</option>
                    <option value={BOOKING_STATUS.APPROVED}>Approved</option>
                    <option value={BOOKING_STATUS.REJECTED}>Rejected</option>
                    <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Court
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                            {booking.users?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.users?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.courts?.name || 'Unknown Court'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.courts?.location || 'No location'}
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
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {booking.status === BOOKING_STATUS.PENDING && (
                          <>
                            <button
                              onClick={() => handleAccept(booking.id, booking.users?.name, booking.users?.email)}
                              disabled={actionLoading === booking.id}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                              {actionLoading === booking.id ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(booking.id, booking.users?.name, booking.users?.email)}
                              disabled={actionLoading === booking.id}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status !== BOOKING_STATUS.PENDING && (
                          <span className={`text-xs ${
                            booking.status === BOOKING_STATUS.APPROVED ? 'text-green-600' : 
                            booking.status === BOOKING_STATUS.REJECTED ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {booking.status === BOOKING_STATUS.APPROVED ? 'Approved' : 
                             booking.status === BOOKING_STATUS.REJECTED ? 'Rejected' : booking.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filter.date || filter.court || filter.status 
                  ? "Try adjusting your search or filter criteria."
                  : "No bookings have been made yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
