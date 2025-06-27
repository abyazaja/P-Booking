import { useState } from "react";
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
} from "lucide-react";

const initialBookings = [
  {
    id: 1,
    user: "Alice Johnson",
    email: "alice@example.com",
    date: "2024-06-10",
    time: "10:00",
    court: "Court 1",
    status: "Pending",
    duration: "2 hours",
    price: "$50",
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    user: "Bob Smith",
    email: "bob@example.com",
    date: "2024-06-12",
    time: "14:00",
    court: "Court 2",
    status: "Accepted",
    duration: "1.5 hours",
    price: "$40",
    phone: "+1 (555) 987-6543",
  },
  {
    id: 3,
    user: "Carol Davis",
    email: "carol@example.com",
    date: "2024-06-15",
    time: "09:00",
    court: "Court 1",
    status: "Rejected",
    duration: "3 hours",
    price: "$75",
    phone: "+1 (555) 456-7890",
  },
  {
    id: 4,
    user: "David Wilson",
    email: "david@example.com",
    date: "2024-06-18",
    time: "16:00",
    court: "Court 3",
    status: "Pending",
    duration: "2 hours",
    price: "$50",
    phone: "+1 (555) 234-5678",
  },
];

const ManageBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState({ date: "", court: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");

  const handleAccept = (id) => {
    setBookings((bookings) =>
      bookings.map((b) => (b.id === id ? { ...b, status: "Accepted" } : b))
    );
  };

  const handleReject = (id) => {
    setBookings((bookings) =>
      bookings.map((b) => (b.id === id ? { ...b, status: "Rejected" } : b))
    );
  };

  const filtered = bookings.filter(
    (b) =>
      (!filter.date || b.date === filter.date) &&
      (!filter.court ||
        b.court.toLowerCase().includes(filter.court.toLowerCase())) &&
      (!filter.status || b.status === filter.status) &&
      (!searchTerm ||
        b.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.court.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Booking Management
          </h1>
          <p className="text-gray-600">Manage and track all court bookings</p>
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
                  {bookings.filter((b) => b.status === "Pending").length}
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
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {bookings.filter((b) => b.status === "Accepted").length}
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
                  {bookings.filter((b) => b.status === "Rejected").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or court..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filter.date}
                      onChange={(e) =>
                        setFilter((f) => ({ ...f, date: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Court
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by court..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filter.court}
                      onChange={(e) =>
                        setFilter((f) => ({ ...f, court: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filter.status}
                      onChange={(e) =>
                        setFilter((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Court
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {booking.date}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.court}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {booking.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button
                                className="text-emerald-600 hover:text-emerald-900 transition-colors"
                                onClick={() => handleAccept(booking.id)}
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 transition-colors"
                                onClick={() => handleReject(booking.id)}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                              <Eye className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No bookings found</p>
                <p className="text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
