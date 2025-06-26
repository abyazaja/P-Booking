import { useState } from 'react';

const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@email.com' },
  { id: 2, name: 'Bob', email: 'bob@email.com' },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (id) => {
    setUsers(users => users.filter(u => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="py-2 px-2 border-b">Name</th>
              <th className="py-2 px-2 border-b">Email</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="py-2 px-2 border-b">{u.name}</td>
                <td className="py-2 px-2 border-b">{u.email}</td>
                <td className="py-2 px-2 border-b">
                  <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers; 