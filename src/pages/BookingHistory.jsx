  import React, { useEffect, useState } from "react";
  import { bookingAPI } from "../services/bookingAPI";
  import { courtAPI } from "../services/courtAPI";
  import { useAuth } from "../context/AuthContext";
  import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    Calendar,
    CreditCard,
  } from "lucide-react";

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const BookingHistory = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courts, setCourts] = useState({});

    useEffect(() => {
      const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        // Get bookings with court info
        const { data, error } = await bookingAPI.getUserBookings(user.id);
        if (error) {
          setBookings([]);
        } else {
          setBookings(data);
        }
        setLoading(false);
      };
      fetchData();
    }, [user]);

    const viewPaymentProof = (proofUrl) => {
      window.open(proofUrl, "_blank");
    };

    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="rounded-2xl border bg-white p-6 shadow space-y-6">
          {/* Judul */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Riwayat Booking</h2>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Belum ada riwayat booking.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Lapangan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal & Jam
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Harga
                    </th>
                    
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.courts ? booking.courts.name : booking.court_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-gray-500" />
                          {booking.start_time} - {booking.end_time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* Durasi dalam jam */}
                        {(() => {
                          const start = booking.start_time?.split(":");
                          const end = booking.end_time?.split(":");
                          if (start && end) {
                            const dur = parseInt(end[0]) - parseInt(start[0]);
                            return dur > 0 ? `${dur} jam` : "-";
                          }
                          return "-";
                        })()}
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
                          {booking.status === "approved" && "Diterima"}
                          {booking.status === "pending" && "Menunggu"}
                          {booking.status === "rejected" && "Ditolak"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default BookingHistory;
