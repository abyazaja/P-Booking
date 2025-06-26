// ===== src/pages/AdminDashboard.jsx =====
import React from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Activity,
  TrendingUp,
  Clock,
  DollarSign,
  Trophy,
  Eye,
  User,
  X,
  BarChart3
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';

const AdminDashboard = () => {
  const mockStats = {
    bookingsToday: 8,
    totalCourts: 2,
    users: 24,
    ongoing: 3,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Bookings Today"
            value={mockStats.bookingsToday}
            change="+12%"
            icon={Calendar}
            color="green"
            trend="up"
          />
          <StatsCard
            title="Total Courts"
            value={mockStats.totalCourts}
            change="0%"
            icon={MapPin}
            color="blue"
            trend="up"
          />
          <StatsCard
            title="Active Users"
            value={mockStats.users}
            change="+8%"
            icon={Users}
            color="purple"
            trend="up"
          />
          <StatsCard
            title="Ongoing Bookings"
            value={mockStats.ongoing}
            change="+25%"
            icon={Activity}
            color="orange"
            trend="up"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Revenue Today</h4>
            <p className="text-2xl font-bold text-green-600">$1,240</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Peak Hours</h4>
            <p className="text-2xl font-bold text-blue-600">7-9 PM</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <Eye className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Court Utilization</h4>
            <p className="text-2xl font-bold text-purple-600">85%</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;