import { Calendar, X, DollarSign, User, Activity } from 'lucide-react';

const RecentActivity = () => {
    const activities = [
      { id: 1, user: "John Doe", action: "booked Court A", time: "2 minutes ago", type: "booking" },
      { id: 2, user: "Jane Smith", action: "cancelled booking", time: "15 minutes ago", type: "cancel" },
      { id: 3, user: "Mike Johnson", action: "completed payment", time: "1 hour ago", type: "payment" },
      { id: 4, user: "Sarah Wilson", action: "registered account", time: "2 hours ago", type: "register" },
    ];
  
    const getActivityIcon = (type) => {
      switch (type) {
        case 'booking': return <Calendar className="w-4 h-4 text-green-600" />;
        case 'cancel': return <X className="w-4 h-4 text-red-600" />;
        case 'payment': return <DollarSign className="w-4 h-4 text-blue-600" />;
        case 'register': return <User className="w-4 h-4 text-purple-600" />;
        default: return <Activity className="w-4 h-4 text-gray-600" />;
      }
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default RecentActivity;
