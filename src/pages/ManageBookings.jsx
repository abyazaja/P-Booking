import { useState } from 'react';

const initialBookings = [
  { id: 1, user: 'alice', date: '2024-06-10', time: '10:00', court: 'Court 1', status: 'Pending' },
  { id: 2, user: 'bob', date: '2024-06-12', time: '14:00', court: 'Court 2', status: 'Accepted' },
];

const ManageBookings = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState({ date: '', court: '' });

  const handleAccept = (id) => {
    setBookings(bookings => bookings.map(b => b.id === id ? { ...b, status: 'Accepted' } : b));
  };
  const handleReject = (id) => {
    setBookings(bookings => bookings.map(b => b.id === id ? { ...b, status: 'Rejected' } : b));
  };

  const filtered = bookings.filter(b =>
    (!filter.date || b.date === filter.date) &&
    (!filter.court || b.court === filter.court)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Bookings</h2>
        <div className="flex gap-4 mb-4">
          <input type="date" className="border rounded px-3 py-2" value={filter.date} onChange={e => setFilter(f => ({ ...f, date: e.target.value }))} />
          <input type="text" placeholder="Court" className="border rounded px-3 py-2" value={filter.court} onChange={e => setFilter(f => ({ ...f, court: e.target.value }))} />
        </div>
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b">User</th>
              <th className="py-2 px-2 border-b">Date</th>
              <th className="py-2 px-2 border-b">Time</th>
              <th className="py-2 px-2 border-b">Court</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td className="py-2 px-2 border-b">{b.user}</td>
                <td className="py-2 px-2 border-b">{b.date}</td>
                <td className="py-2 px-2 border-b">{b.time}</td>
                <td className="py-2 px-2 border-b">{b.court}</td>
                <td className="py-2 px-2 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${b.status === 'Accepted' ? 'bg-green-100 text-green-700' : b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                </td>
                <td className="py-2 px-2 border-b">
                  {b.status === 'Pending' && (
                    <>
                      <button className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => handleAccept(b.id)}>Accept</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleReject(b.id)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings; 