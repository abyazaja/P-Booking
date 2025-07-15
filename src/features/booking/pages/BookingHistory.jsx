import React, { useEffect, useState } from "react";
import { bookingAPI } from "../../../shared/services/bookingAPI";
import { courtAPI } from "../../../shared/services/courtAPI";
import { useAuth } from "../../../shared/hooks/AuthContext";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Calendar,
  CreditCard,
  Filter,
  Search,
  MapPin,
  Trophy,
  History,
  PlayCircle,
  Timer,
  FileText
} from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-ballgreen/20 text-ballgreen border-ballgreen/30";
    case "pending":
      return "bg-ballorange/20 text-ballorange border-ballorange/30";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "rejected":
      return <XCircle className="w-4 h-4" />;
    default:
      return <History className="w-4 h-4" />;
  }
};

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await bookingAPI.getUserBookings(user.id);
        if (error) {
          setBookings([]);
          setFilteredBookings([]);
        } else {
          setBookings(data || []);
          setFilteredBookings(data || []);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Filter and search logic
  useEffect(() => {
    let filtered = bookings;

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        (booking.courts?.name || booking.court_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.date.includes(searchTerm) ||
        booking.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchTerm]);

  // Calculate stats
  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter(b => b.status === "approved").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const totalHours = bookings.reduce((sum, booking) => {
    const start = booking.start_time?.split(":");
    const end = booking.end_time?.split(":");
    if (start && end) {
      const duration = parseInt(end[0]) - parseInt(start[0]);
      return sum + (duration > 0 ? duration : 0);
    }
    return sum;
  }, 0);

  const formatPrice = (price) => {
    if (!price) return "Not specified";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your booking history..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ballwhite to-ballgray relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ballgreen/5 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-ballorange/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-ballgreen/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-ballgreen via-green-500 to-ballorange bg-clip-text text-transparent">
                Booking History
              </h1>
              <p className="text-lg text-gray-700">Track all your futsal court bookings and manage your game schedule</p>
            </div>
            
            <div className="flex items-center gap-2 text-ballgreen">
              <History className="w-8 h-8" />
              <div className="text-right">
                <div className="text-2xl font-bold">{totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Bookings", value: totalBookings, icon: FileText, color: "ballgreen", bgColor: "from-ballgreen/20 to-emerald-100" },
            { title: "Completed", value: approvedBookings, icon: CheckCircle, color: "ballgreen", bgColor: "from-green-100 to-emerald-50" },
            { title: "Pending", value: pendingBookings, icon: Clock, color: "ballorange", bgColor: "from-ballorange/20 to-orange-100" },
            { title: "Total Hours", value: `${totalHours}h`, icon: Timer, color: "ballorange", bgColor: "from-orange-100 to-yellow-50" }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`group relative bg-gradient-to-br ${stat.bgColor} rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className={`text-3xl font-black text-${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-ballblack">
                    {stat.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-ballgreen focus:outline-none transition-colors w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border-2 border-gray-200 rounded-full focus:border-ballgreen focus:outline-none transition-colors appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {totalBookings} bookings
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-ballgreen/20 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlayCircle className="w-10 h-10 text-ballgreen" />
              </div>
              <h3 className="text-2xl font-bold text-ballblack mb-4">
                {totalBookings === 0 ? "No bookings yet" : "No matching bookings"}
              </h3>
              <p className="text-gray-600 mb-6">
                {totalBookings === 0 
                  ? "Start your futsal journey by booking your first court!"
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {totalBookings === 0 && (
                <button className="bg-ballgreen text-white px-6 py-3 rounded-full font-semibold hover:bg-ballgreen/90 transition-colors">
                  Book Your First Court
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="p-6 hover:bg-gray-50 transition-all duration-300 animate-in slide-in-from-left-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ballgreen/20 to-emerald-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-ballgreen" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-ballblack">
                              {booking.courts?.name || `Court ${booking.court_id}`}
                            </h3>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              {booking.status === "approved" && "Approved"}
                              {booking.status === "pending" && "Pending"}
                              {booking.status === "rejected" && "Rejected"}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              {formatDate(booking.date)}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {booking.start_time} - {booking.end_time}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Timer className="w-4 h-4" />
                              {(() => {
                                const start = booking.start_time?.split(":");
                                const end = booking.end_time?.split(":");
                                if (start && end) {
                                  const dur = parseInt(end[0]) - parseInt(start[0]);
                                  return dur > 0 ? `${dur} hours` : "-";
                                }
                                return "-";
                              })()}
                            </div>
                            <div className="flex items-center gap-2 text-ballorange font-semibold">
                              <CreditCard className="w-4 h-4" />
                              {formatPrice(booking.price)}
                            </div>
                          </div>
                          
                          {booking.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Notes:</span> {booking.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  export default BookingHistory;
