import React from "react";
import { Calendar, Clock, CheckCircle, ListChecks, Star, HelpCircle, Trophy, User, Activity, AlertCircle } from "lucide-react";
import UserDashboardLayout from "../layouts/UserLayout";

const summaryData = [
  {
    title: "Total Bookings",
    value: 12,
    icon: <Calendar className="w-7 h-7 text-blue-500" />,
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

const recentActivity = [
  { id: 1, action: "Booking Lapangan 1", time: "Hari ini, 10:00", status: "Completed" },
  { id: 2, action: "Booking Lapangan 2", time: "Kemarin, 19:00", status: "Active" },
  { id: 3, action: "Booking Lapangan 3", time: "2 hari lalu, 17:00", status: "Completed" },
];

const quickActions = [
  { label: "Book a Court", icon: Calendar, color: "from-blue-500 to-blue-600" },
  { label: "View Schedule", icon: Clock, color: "from-green-500 to-green-600" },
  { label: "My Bookings", icon: ListChecks, color: "from-purple-500 to-purple-600" },
  { label: "Get Support", icon: HelpCircle, color: "from-orange-500 to-orange-600" },
];

const promotions = [
  {
    id: 1,
    title: "Weekend Special",
    description: "Diskon 20% untuk booking hari Sabtu & Minggu",
    period: "1 Juni - 30 Juni 2023",
    code: "WEEKEND20",
    isNew: true
  },
  {
    id: 2,
    title: "Member Loyalty",
    description: "Dapatkan poin 2x untuk setiap booking di bulan ini",
    period: "1 Juni - 30 Juni 2023",
    code: "LOYAL2X"
  },
  {
    id: 3,
    title: "Early Bird",
    description: "Booking sebelum jam 10 pagi dapat diskon 15%",
    period: "1 Juni - 30 Juni 2023",
    code: "EARLY15"
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Turnamen Futsal Kota",
    description: "Turnamen bulanan untuk komunitas futsal",
    date: "15 Juni 2023",
    time: "08:00 - 17:00",
    location: "Lapangan Utama"
  },
  {
    id: 2,
    title: "Pelatihan Futsal Gratis",
    description: "Pelatihan dasar futsal dengan pelatih profesional",
    date: "20 Juni 2023",
    time: "16:00 - 18:00",
    location: "Lapangan 2"
  }
];

const UserDashboard = () => {
  const user = { name: "Budi Santoso", loyalty: 120, rating: 4.7 };
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item) => (
          <div key={item.title} className={`rounded-2xl shadow-sm p-5 flex flex-col items-center ${item.color}`}>
            <div className="mb-2">{item.icon}</div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm font-medium">{item.title}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" /> Aktivitas Terbaru
            </h3>
            <div className="space-y-4">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <User className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {act.action}
                    </p>
                    <p className="text-xs text-gray-500">{act.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${act.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{act.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promotions Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" /> Promo & Event
            </h3>
            
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 mb-4">Promo Aktif</h4>
              <div className="space-y-4">
                {promotions.map(promo => (
                  <div key={promo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium text-gray-900">{promo.title}</h5>
                          {promo.isNew && <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">BARU</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Periode: {promo.period}</p>
                      </div>
                      <div className="bg-yellow-50 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                        Kode: {promo.code}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Event Mendatang</h4>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h5 className="font-medium text-gray-900">{event.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="text-xs text-gray-500">
                        <div className="font-medium">Tanggal</div>
                        <div>{event.date}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div className="font-medium">Waktu</div>
                        <div>{event.time}</div>
                      </div>
                      <div className="text-xs text-gray-500 col-span-2">
                        <div className="font-medium">Lokasi</div>
                        <div>{event.location}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  <action.icon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Statistik Anda</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm">Poin Loyalty</span>
                </div>
                <span className="font-medium">{user.loyalty} pts</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-medium">{user.rating}/5</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Booking Sukses</span>
                </div>
                <span className="font-medium">10x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Poin Loyalti</h4>
          <p className="text-2xl font-bold text-yellow-600">{user.loyalty}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Rating Pengalaman</h4>
          <p className="text-2xl font-bold text-purple-600">{user.rating}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <HelpCircle className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Butuh Bantuan?</h4>
          <p className="text-base text-blue-600">Hubungi support kami kapan saja!</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;