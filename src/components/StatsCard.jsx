import { TrendingUp } from 'lucide-react';

// Stats Card Component
const StatsCard = ({ title, value, change, icon: Icon, color = "blue", trend = "up" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      orange: "from-orange-500 to-orange-600",
      purple: "from-purple-500 to-purple-600",
      red: "from-red-500 to-red-600"
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
              trend === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
            }`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {change}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    );
  };

  export default StatsCard;
