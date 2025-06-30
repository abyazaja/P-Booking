import React, { useState, useEffect } from 'react';
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
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MessageSquare,
  Loader2,
  Settings,
  Check,
  UserX,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Import your API services
import { bookingAPI } from '../services/bookingAPI';
import { courtAPI } from '../services/courtAPI';
import { authAPI } from '../services/authAPI';
import { messagesAPI } from '../services/messageAPI';
import { BOOKING_STATUS } from '../config/supabase';
import { COURT_STATUS } from '../config/supabase';
import toast from 'react-hot-toast';
import RecentActivity from '../components/RecentActivity';

// Enhanced StatsCard Component
const StatsCard = ({ title, value, change, icon: Icon, color, trend, subtitle }) => {
  const colorClasses = {
    green: {
      bg: 'from-green-50 to-green-100',
      icon: 'text-green-600',
      value: 'text-green-700',
      change: 'text-green-600 bg-green-100'
    },
    orange: {
      bg: 'from-orange-50 to-orange-100',
      icon: 'text-orange-600',
      value: 'text-orange-700',
      change: 'text-orange-600 bg-orange-100'
    },
    lightGreen: {
      bg: 'from-green-100 to-green-200',
      icon: 'text-green-700',
      value: 'text-green-800',
      change: 'text-green-700 bg-green-200'
    },
    lightOrange: {
      bg: 'from-orange-100 to-amber-100',
      icon: 'text-orange-700',
      value: 'text-orange-800',
      change: 'text-orange-700 bg-orange-200'
    },
    blue: {
      bg: 'from-blue-50 to-blue-100',
      icon: 'text-blue-600',
      value: 'text-blue-700',
      change: 'text-blue-600 bg-blue-100'
    },
    purple: {
      bg: 'from-purple-50 to-purple-100',
      icon: 'text-purple-600',
      value: 'text-purple-700',
      change: 'text-purple-600 bg-purple-100'
    },
    red: {
      bg: 'from-red-50 to-red-100',
      icon: 'text-red-600',
      value: 'text-red-700',
      change: 'text-red-600 bg-red-100'
    },
    yellow: {
      bg: 'from-yellow-50 to-yellow-100',
      icon: 'text-yellow-600',
      value: 'text-yellow-700',
      change: 'text-yellow-600 bg-yellow-100'
    }
  };

  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const currentColors = colorClasses[color] || colorClasses.green;

  return (
    <div className={`bg-gradient-to-br ${currentColors.bg} rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/60 ${currentColors.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${currentColors.change}`}>
            <TrendIcon className="w-3 h-3" />
            {change}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${currentColors.value}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, icon: Icon, description, color = "green" }) => {
  const colorClasses = {
    green: "from-green-600 to-green-700",
    blue: "from-blue-600 to-blue-700",
    purple: "from-purple-600 to-purple-700",
    orange: "from-orange-600 to-orange-700"
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-gray-600 ml-10">{description}</p>
      )}
    </div>
  );
};

// Utility functions
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = ((current - previous) / previous) * 100;
  return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
};

const calculateRevenue = (bookings) => {
  // Assuming each booking has a 'price' or 'amount' field
  const todayRevenue = bookings
    .filter(booking => {
      const bookingDate = new Date(booking.created_at);
      const today = new Date();
      return bookingDate.toDateString() === today.toDateString() && 
             booking.status === BOOKING_STATUS.APPROVED;
    })
    .reduce((total, booking) => total + (booking.price || booking.amount || 0), 0);
  
  return `$${todayRevenue.toLocaleString()}`;
};

const calculateCourtUtilization = (bookings, courts) => {
  if (!courts.length) return '0%';
  
  const today = new Date();
  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date || booking.date);
    return bookingDate.toDateString() === today.toDateString() && 
           booking.status === BOOKING_STATUS.APPROVED;
  });

  const totalSlots = courts.length * 24; // Assuming 24 hours per day per court
  const bookedSlots = todayBookings.length;
  const utilization = (bookedSlots / totalSlots) * 100;
  
  return `${Math.min(100, utilization).toFixed(1)}%`;
};

const generateWeeklyData = (bookings) => {
  const weeklyData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dayBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.created_at);
      return bookingDate.toDateString() === date.toDateString();
    });

    const approvedBookings = dayBookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length;
    const pendingBookings = dayBookings.filter(b => b.status === BOOKING_STATUS.PENDING).length;
    const rejectedBookings = dayBookings.filter(b => b.status === BOOKING_STATUS.REJECTED).length;
    
    weeklyData.push({
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      date: date.toLocaleDateString(),
      approved: approvedBookings,
      pending: pendingBookings,
      rejected: rejectedBookings,
      total: dayBookings.length
    });
  }
  
  return weeklyData;
};

// Weekly Performance Chart Component
const WeeklyPerformanceChart = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-green-600" />
        Weekly Booking Performance
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return `${label} - ${payload[0].payload.date}`;
                }
                return label;
              }}
            />
            <Bar dataKey="approved" fill="#10b981" stackId="a" />
            <Bar dataKey="pending" fill="#f59e0b" stackId="a" />
            <Bar dataKey="rejected" fill="#ef4444" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Rejected</span>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    totalCourts: 0,
    activeCourts: 0,
    maintenanceCourts: 0,
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    pendingUsers: 0,
    totalMessages: 0,
    unreadMessages: 0,
    revenueToday: '$0',
    courtUtilization: '0%',
    // Previous week data for comparison
    previousWeek: {
      totalBookings: 0,
      pendingBookings: 0,
      approvedBookings: 0,
      rejectedBookings: 0,
      totalUsers: 0,
      totalMessages: 0
    }
  });
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingStats(true);
      try {
        const [bookingsRes, courtsRes, usersRes, messagesRes] = await Promise.all([
          bookingAPI.getAllBookings(),
          courtAPI.getAllCourts(),
          authAPI.getAllUsers(),
          messagesAPI.fetchMessages(),
        ]);

        // Handle Bookings Data
        const allBookings = bookingsRes.data || [];
        const totalB = allBookings.length;
        const pendingB = allBookings.filter(b => b.status === BOOKING_STATUS.PENDING).length;
        const approvedB = allBookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length;
        const rejectedB = allBookings.filter(b => b.status === BOOKING_STATUS.REJECTED).length;

        // Handle Courts Data
        const allCourts = courtsRes.data || [];
        const totalC = allCourts.length;
        const activeC = allCourts.filter(c => c.status === COURT_STATUS.ACTIVE).length;
        const maintenanceC = allCourts.filter(c => c.status === COURT_STATUS.MAINTENANCE).length;

        // Handle Users Data
        const allUsers = usersRes.data || [];
        const totalU = allUsers.length;
        const activeU = allUsers.filter(u => u.status === 'active' || u.email_confirmed_at).length;
        const pendingU = allUsers.filter(u => u.status === 'pending' || !u.email_confirmed_at).length;
        const inactiveU = allUsers.filter(u => u.status === 'inactive' || u.status === 'suspended').length;

        // Handle Messages Data
        const allMessages = messagesRes || [];
        const totalM = allMessages.length;
        const unreadM = allMessages.filter(m => !m.read || m.status === 'unread').length;

        // Calculate revenue and utilization
        const revenue = calculateRevenue(allBookings);
        const utilization = calculateCourtUtilization(allBookings, allCourts);

        // Calculate previous week data for comparison
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const previousWeekBookings = allBookings.filter(booking => {
          const bookingDate = new Date(booking.created_at);
          return bookingDate <= oneWeekAgo;
        });

        const previousWeekUsers = allUsers.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate <= oneWeekAgo;
        });

        const previousWeekMessages = allMessages.filter(msg => {
          const msgDate = new Date(msg.created_at);
          return msgDate <= oneWeekAgo;
        });

        // Generate weekly performance data
        const weeklyChartData = generateWeeklyData(allBookings);

        setStats({
          totalBookings: totalB,
          pendingBookings: pendingB,
          approvedBookings: approvedB,
          rejectedBookings: rejectedB,
          totalCourts: totalC,
          activeCourts: activeC,
          maintenanceCourts: maintenanceC,
          totalUsers: totalU,
          activeUsers: activeU,
          inactiveUsers: inactiveU,
          pendingUsers: pendingU,
          totalMessages: totalM,
          unreadMessages: unreadM,
          revenueToday: revenue,
          courtUtilization: utilization,
          previousWeek: {
            totalBookings: previousWeekBookings.length,
            pendingBookings: previousWeekBookings.filter(b => b.status === BOOKING_STATUS.PENDING).length,
            approvedBookings: previousWeekBookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length,
            rejectedBookings: previousWeekBookings.filter(b => b.status === BOOKING_STATUS.REJECTED).length,
            totalUsers: previousWeekUsers.length,
            totalMessages: previousWeekMessages.length
          }
        });

        setWeeklyData(weeklyChartData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate percentage changes
  const bookingChange = calculatePercentageChange(stats.totalBookings, stats.previousWeek.totalBookings);
  const userChange = calculatePercentageChange(stats.totalUsers, stats.previousWeek.totalUsers);
  const messageChange = calculatePercentageChange(stats.totalMessages, stats.previousWeek.totalMessages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
         
        </div>

        {loadingStats && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            <span className="text-lg text-gray-600 ml-4">Loading real-time data...</span>
          </div>
        )}

        {!loadingStats && (
          <>
            {/* BOOKING MANAGEMENT SECTION */}
            <div className="space-y-6">
              <SectionHeader 
                title="Booking Management" 
                icon={Calendar}
                description="Real-time booking statistics from your database"
                color="green"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatsCard
                  title="Total Bookings"
                  value={stats.totalBookings}
                  change={bookingChange}
                  icon={Calendar}
                  color="green"
                  trend={stats.totalBookings > stats.previousWeek.totalBookings ? "up" : "down"}
                  subtitle="All time bookings"
                />
                <StatsCard
                  title="Pending Approval"
                  value={stats.pendingBookings}
                  change={calculatePercentageChange(stats.pendingBookings, stats.previousWeek.pendingBookings)}
                  icon={Clock}
                  color="yellow"
                  trend={stats.pendingBookings > stats.previousWeek.pendingBookings ? "up" : "down"}
                  subtitle="Awaiting review"
                />
                <StatsCard
                  title="Approved Bookings"
                  value={stats.approvedBookings}
                  change={calculatePercentageChange(stats.approvedBookings, stats.previousWeek.approvedBookings)}
                  icon={CheckCircle}
                  color="green"
                  trend={stats.approvedBookings > stats.previousWeek.approvedBookings ? "up" : "down"}
                  subtitle="Confirmed bookings"
                />
                <StatsCard
                  title="Rejected Bookings"
                  value={stats.rejectedBookings}
                  change={calculatePercentageChange(stats.rejectedBookings, stats.previousWeek.rejectedBookings)}
                  icon={XCircle}
                  color="red"
                  trend={stats.rejectedBookings > stats.previousWeek.rejectedBookings ? "up" : "down"}
                  subtitle="Declined requests"
                />
              </div>
            </div>

            {/* USER MANAGEMENT SECTION */}
            <div className="space-y-6">
              <SectionHeader 
                title="User Management" 
                icon={Users}
                description="User registration and account status tracking"
                color="blue"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatsCard
                  title="Total Users"
                  value={stats.totalUsers}
                  change={userChange}
                  icon={Users}
                  color="blue"
                  trend={stats.totalUsers > stats.previousWeek.totalUsers ? "up" : "down"}
                  subtitle="Registered users"
                />
                <StatsCard
                  title="Active Users"
                  value={stats.activeUsers}
                  change={calculatePercentageChange(stats.activeUsers, stats.previousWeek.totalUsers)}
                  icon={UserCheck}
                  color="green"
                  trend="up"
                  subtitle="Verified accounts"
                />
                <StatsCard
                  title="Pending Approval"
                  value={stats.pendingUsers}
                  icon={UserX}
                  color="orange"
                  subtitle="Awaiting verification"
                />
                <StatsCard
                  title="Inactive Users"
                  value={stats.inactiveUsers}
                  icon={AlertCircle}
                  color="red"
                  subtitle="Suspended/inactive"
                />
              </div>
            </div>

            {/* COURT MANAGEMENT SECTION */}
            <div className="space-y-6">
              <SectionHeader 
                title="Court Management" 
                icon={MapPin}
                description="Court availability and maintenance status"
                color="orange"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <StatsCard
                  title="Total Courts"
                  value={stats.totalCourts}
                  icon={MapPin}
                  color="orange"
                  subtitle="Available facilities"
                />
                <StatsCard
                  title="Active Courts"
                  value={stats.activeCourts}
                  icon={CheckCircle}
                  color="green"
                  subtitle="Ready for booking"
                />
                <StatsCard
                  title="Under Maintenance"
                  value={stats.maintenanceCourts}
                  icon={Settings}
                  color="yellow"
                  subtitle="Temporarily unavailable"
                />
              </div>
            </div>

            {/* MESSAGES & COMMUNICATION SECTION */}
            <div className="space-y-6">
              <SectionHeader 
                title="Messages & Communication" 
                icon={MessageSquare}
                description="User inquiries and support messages"
                color="purple"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <StatsCard
                  title="Total Messages"
                  value={stats.totalMessages}
                  change={messageChange}
                  icon={MessageSquare}
                  color="purple"
                  trend={stats.totalMessages > stats.previousWeek.totalMessages ? "up" : "down"}
                  subtitle="All conversations"
                />
                <StatsCard
                  title="Unread Messages"
                  value={stats.unreadMessages}
                  icon={AlertCircle}
                  color="red"
                  subtitle="Require attention"
                />
                <StatsCard
                  title="Response Rate"
                  value={stats.totalMessages > 0 ? `${Math.round(((stats.totalMessages - stats.unreadMessages) / stats.totalMessages) * 100)}%` : "0%"}
                  icon={TrendingUp}
                  color="green"
                  subtitle="Messages responded"
                />
              </div>
            </div>

            {/* PERFORMANCE OVERVIEW */}
            <div className="space-y-6">
              <SectionHeader 
                title="Performance Overview" 
                icon={BarChart3}
                description="Revenue and utilization metrics"
                color="green"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <StatsCard
                  title="Today's Revenue"
                  value={stats.revenueToday}
                  icon={DollarSign}
                  color="green"
                  subtitle="From approved bookings"
                />
                <StatsCard
                  title="Court Utilization"
                  value={stats.courtUtilization}
                  icon={Activity}
                  color="blue"
                  subtitle="Today's usage rate"
                />
                <StatsCard
                  title="Avg. Bookings/Day"
                  value={Math.round(stats.totalBookings / 30)}
                  icon={TrendingUp}
                  color="purple"
                  subtitle="Last 30 days average"
                />
              </div>
            </div>

            {/* WEEKLY PERFORMANCE CHART */}
            <WeeklyPerformanceChart data={weeklyData} />

            {/* RECENT ACTIVITY */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RecentActivity />
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-semibold text-green-600">
                      {stats.totalBookings > 0 ? Math.round((stats.approvedBookings / stats.totalBookings) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Court Ratio</span>
                    <span className="font-semibold text-blue-600">
                      {stats.totalCourts > 0 ? Math.round((stats.activeCourts / stats.totalCourts) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">User Activity Rate</span>
                    <span className="font-semibold text-purple-600">
                      {stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;