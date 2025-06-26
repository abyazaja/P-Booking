import { useState } from 'react';

const initialCourts = [
  { id: 1, name: 'Court 1', type: 'Synthetic', status: 'Active' },
  { id: 2, name: 'Court 2', type: 'Vinyl', status: 'Inactive' },
];

const ManageCourts = () => {
  const [courts, setCourts] = useState(initialCourts);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Courts</h2>
        <table className="w-full text-left border mb-6">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b">Name</th>
              <th className="py-2 px-2 border-b">Type</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courts.map(court => (
              <tr key={court.id}>
                <td className="py-2 px-2 border-b">{court.name}</td>
                <td className="py-2 px-2 border-b">{court.type}</td>
                <td className="py-2 px-2 border-b">{court.status}</td>
                <td className="py-2 px-2 border-b">
                  <button className="mr-2 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Court</button>
      </div>
    </div>
  );
};

export default ManageCourts; 