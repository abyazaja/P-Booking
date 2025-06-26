import React, { useState } from "react";
import { Calendar, CheckCircle, Clock, Star, User, BookOpen, HelpCircle, ListChecks } from "lucide-react";
import UserDashboardNavbar from "../components/UserDashboardNavbar";
import UserDashboardLayout from "../layouts/UserDashboardLayout";

const summaryData = [
  {
    title: "Total Bookings",
    value: 12,
    icon: <BookOpen className="w-7 h-7 text-blue-500" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Active Bookings",
    value: 2,
    icon: <Clock className="w-7 h-7 text-green-500" />,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Completed",
    value: 10,
    icon: <CheckCircle className="w-7 h-7 text-purple-500" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Total Hours",
    value: 24,
    icon: <ListChecks className="w-7 h-7 text-orange-500" />,
    color: "bg-orange-100 text-orange-700",
  },
];

const bookings = [
  {
    id: 1,
    date: "2024-06-12 17:00",
    court: "Lapangan 1",
    duration: "2 jam",
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-06-15 19:00",
    court: "Lapangan 2",
    duration: "1 jam",
    status: "Active",
  },
];

const upcoming = [
  {
    id: 3,
    date: "2024-06-20 18:00",
    court: "Lapangan 3",
    duration: "2 jam",
    status: "Upcoming",
  },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("history");
  const user = { name: "Budi Santoso", loyalty: 120, rating: 4.7 };

  return (
    <UserDashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-ballgreen mb-1">
          Selamat datang kembali, {user.name}!
        </h2>
        <div className="flex items-center gap-4 mt-2">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Star className="w-4 h-4" /> Poin Loyalti: <b>{user.loyalty}</b>
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Star className="w-4 h-4" /> Rating: <b>{user.rating}</b>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      <UserDashboardNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white rounded-2xl shadow p-4 mt-4 mb-8 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2 px-3">Tanggal & Waktu</th>
              <th className="py-2 px-3">Lapangan</th>
              <th className="py-2 px-3">Durasi</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === "history" ? bookings : upcoming).map((b) => (
              <tr key={b.id} className="border-t">
                <td className="py-2 px-3">{b.date}</td>
                <td className="py-2 px-3">{b.court}</td>
                <td className="py-2 px-3">{b.duration}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      b.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "Active"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <button className="bg-ballgreen text-white px-3 py-1 rounded hover:bg-green-700 transition">
                    {activeTab === "history" ? "Lihat Detail" : "Batalkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg flex flex-col items-center">
          <Calendar className="w-7 h-7 mb-2" />
          Book a Court
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl shadow-lg flex flex-col items-center">
          <Clock className="w-7 h-7 mb-2" />
          View Schedule
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg flex flex-col items-center">
          <ListChecks className="w-7 h-7 mb-2" />
          Manage My Bookings
        </button>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg flex flex-col items-center">
          <HelpCircle className="w-7 h-7 mb-2" />
          Get Support
        </button>
      </div>

      <div className="bg-blue-100 border-l-4 border-blue-400 rounded-xl p-4 mb-8 flex items-center gap-3">
        <User className="w-6 h-6 text-blue-500" />
        <span className="text-blue-800 font-medium">
          Lapangan 3 kosong jam 17.00 - 19.00 hari ini. <b>Ayo booking sekarang!</b>
        </span>
      </div>
    </UserDashboardLayout>
  );
};

export default UserDashboard; 