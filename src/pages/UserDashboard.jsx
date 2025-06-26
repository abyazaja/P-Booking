import React from "react";
import { Calendar, Clock, CheckCircle, ListChecks, Star, HelpCircle, Trophy, User, Activity } from "lucide-react";
import UserDashboardLayout from "../layouts/UserDashboardLayout";

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

const UserDashboard = () => {
  const user = { name: "Budi Santoso", loyalty: 120, rating: 4.7 };
  return (
    <UserDashboardLayout>
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
          <div className="lg:col-span-2">
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
          </div>
          {/* Quick Actions */}
          <div>
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
    </UserDashboardLayout>
  );
};

export default UserDashboard;