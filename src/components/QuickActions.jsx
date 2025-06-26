import { Calendar, Users, BarChart3, MapPin } from 'lucide-react';

const QuickActions = () => {
    const actions = [
      { id: 1, label: "New Booking", icon: Calendar, color: "green" },
      { id: 2, label: "Add User", icon: Users, color: "blue" },
      { id: 3, label: "View Reports", icon: BarChart3, color: "purple" },
      { id: 4, label: "Manage Courts", icon: MapPin, color: "orange" },
    ];
  
    const colorClasses = {
      green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-r ${colorClasses[action.color]} text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default QuickActions;
