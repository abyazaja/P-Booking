import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
} from "lucide-react";

const initialUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@email.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    status: "Active",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-25",
    avatar: "AJ",
    bookings: 12,
    totalSpent: "$450",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@email.com",
    phone: "+1 (555) 987-6543",
    role: "User",
    status: "Active",
    joinDate: "2024-02-20",
    lastLogin: "2024-06-26",
    avatar: "BS",
    bookings: 8,
    totalSpent: "$320",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@email.com",
    phone: "+1 (555) 456-7890",
    role: "User",
    status: "Inactive",
    joinDate: "2024-03-10",
    lastLogin: "2024-05-15",
    avatar: "CD",
    bookings: 3,
    totalSpent: "$120",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@email.com",
    phone: "+1 (555) 234-5678",
    role: "User",
    status: "Suspended",
    joinDate: "2024-04-05",
    lastLogin: "2024-06-20",
    avatar: "DW",
    bookings: 15,
    totalSpent: "$675",
  },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ role: "", status: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id) => {
    setUsers((users) => users.filter((u) => u.id !== id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleBulkDelete = () => {
    setUsers((users) => users.filter((u) => !selectedUsers.includes(u.id)));
    setSelectedUsers([]);
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers((users) =>
      users.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = !filter.role || user.role === filter.role;
    const matchesStatus = !filter.status || user.status === filter.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "User":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Deletion
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {userToDelete?.name}? This action
          cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => handleDelete(userToDelete.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                Manage and monitor all system users
              </p>
            </div>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {users.filter((u) => u.status === "Active").length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Inactive/Suspended
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter((u) => u.status !== "Active").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter((u) => u.role === "Admin").length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <button
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-5 h-5" />
                  Delete ({selectedUsers.length})
                </button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filter.role}
                      onChange={(e) =>
                        setFilter((f) => ({ ...f, role: e.target.value }))
                      }
                    >
                      <option value="">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filter.status}
                      onChange={(e) =>
                        setFilter((f) => ({ ...f, status: e.target.value }))
                      }
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-4">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined {user.joinDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 mb-1">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent cursor-pointer ${getStatusColor(
                          user.status
                        )}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="mb-1">{user.bookings} bookings</div>
                      <div className="text-gray-500">
                        {user.totalSpent} spent
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors p-1">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors p-1">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Pagination could be added here for large datasets */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <DeleteConfirmModal />}
    </div>
  );
};

export default ManageUsers;
