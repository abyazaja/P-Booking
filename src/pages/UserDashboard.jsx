import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  ListChecks,
  Star,
  HelpCircle,
  Trophy,
  User,
  Activity,
  AlertCircle
} from "lucide-react";
import { bookingAPI } from "../services/bookingAPI";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data statistik
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

        // Hitung statistik
        setTotalBookings(data.length);
        setActiveBookings(data.filter(b => b.status === "pending").length);
        setCompletedBookings(data.filter(b => b.status === "approved").length);

        // Hitung total jam
        const totalJam = data.reduce((sum, b) => {
          const start = parseInt(b.start_time?.split(":")[0] || 0);
          const end = parseInt(b.end_time?.split(":")[0] || 0);
          const durasi = end - start;
          return sum + (durasi > 0 ? durasi : 0);
        }, 0);
        setTotalHours(totalJam);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

  const summaryData = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: <Calendar className="w-7 h-7 text-blue-500" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Active Bookings",
      value: activeBookings,
      icon: <Clock className="w-7 h-7 text-green-500" />,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Completed",
      value: completedBookings,
      icon: <CheckCircle className="w-7 h-7 text-purple-500" />,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Total Hours",
      value: totalHours,
      icon: <ListChecks className="w-7 h-7 text-orange-500" />,
      color: "bg-orange-100 text-orange-700",
    },
  ];

 
  const formatTime = (time24) => {
  if (!time24) return "-";
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // jam 0 jadi 12
  return `${hour}:${minute} ${ampm}`;
  };  

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item) => (
          <div
            key={item.title}
            className={`rounded-2xl shadow-sm p-5 flex flex-col items-center ${item.color}`}
          >
            <div className="mb-2">{item.icon}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm font-medium">{item.title}</div>
          </div>
        ))}
      </div>

      {/* Aktivitas Terbaru */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" /> Aktivitas Terbaru
        </h3>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">Belum ada aktivitas booking.</p>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">Booking Lapangan</p>
                    <p className="text-sm text-gray-500">{b.date}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatTime(b.start_time)} - {formatTime(b.end_time)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    b.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {b.status === "approved" ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Promo Section */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <AlertCircle className="w-5 h-5 text-orange-500" /> Promo
    </h3>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <h5 className="font-medium text-gray-900">Promo Check-in</h5>
        <p className="text-sm text-gray-600 mt-1">
          Pengguna yang sering datang bisa dapat badge atau bonus. Main 5 kali dalam 1 bulan, dapat free 1 jam!
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Berlaku untuk semua jenis lapangan. Reset tiap awal bulan.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <h5 className="font-medium text-gray-900">Event Edukatif / Pelatihan</h5>
        <p className="text-sm text-gray-600 mt-1">
          Pelatihan dasar futsal bersama pelatih profesional. Cocok untuk pemula, anak-anak, maupun calon coach.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Jadwal pelatihan dapat dilihat di bagian Event Mendatang.
        </p>
      </div>
    </div>
  </div>

  {/* Event Section */}
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <Calendar className="w-5 h-5 text-green-500" /> Event Mendatang
    </h3>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <h5 className="font-medium text-gray-900">Turnamen Futsal Kota</h5>
        <p className="text-sm text-gray-600 mt-1">Turnamen bulanan untuk komunitas futsal</p>
        <div className="text-xs text-gray-500 mt-3">
          <div><strong>Tanggal:</strong> 15 Juli 2025</div>
          <div><strong>Waktu:</strong> 08:00 - 17:00</div>
          <div><strong>Lokasi:</strong> Lapangan Utama</div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <h5 className="font-medium text-gray-900">Pelatihan Futsal Gratis</h5>
        <p className="text-sm text-gray-600 mt-1">Pelatihan dasar futsal bersama pelatih profesional</p>
        <div className="text-xs text-gray-500 mt-3">
          <div><strong>Tanggal:</strong> 20 Juli 2025</div>
          <div><strong>Waktu:</strong> 16:00 - 18:00</div>
          <div><strong>Lokasi:</strong> Lapangan 2</div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default UserDashboard;
