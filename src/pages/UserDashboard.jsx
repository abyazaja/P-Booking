import { useAuth } from '../context/AuthContext';

const mockBookings = [
  { id: 1, date: '2024-06-10', time: '10:00', court: 'Court 1', status: 'Pending' },
  { id: 2, date: '2024-06-12', time: '14:00', court: 'Court 2', status: 'Accepted' },
];

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h2>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
        </div>
        <h3 className="text-lg font-semibold mb-4">Booking History</h3>
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b">Date</th>
              <th className="py-2 px-2 border-b">Time</th>
              <th className="py-2 px-2 border-b">Court</th>
              <th className="py-2 px-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map(b => (
              <tr key={b.id}>
                <td className="py-2 px-2 border-b">{b.date}</td>
                <td className="py-2 px-2 border-b">{b.time}</td>
                <td className="py-2 px-2 border-b">{b.court}</td>
                <td className="py-2 px-2 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${b.status === 'Accepted' ? 'bg-green-100 text-green-700' : b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard; 