import { supabase } from '../config/supabase';

// Versi sederhana dan ringkas dari ManageCourts dengan UI tetap bagus + Edit & Delete
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Image as ImageIcon
} from "lucide-react";
import { courtAPI } from "../services/courtAPI";
import { COURT_STATUS } from "../config/supabase";
import toast from "react-hot-toast";

const ManageCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [form, setForm] = useState({
    id: null,
    name: "",
    type: "Synthetic",
    location: "",
    capacity: "",
    status: COURT_STATUS.ACTIVE,
    image: null,
    price: ""
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const { data, error } = await courtAPI.getAllCourts();

      if (error) throw error;

      setCourts(data || []);
    } catch (error) {
      console.error('Error fetching courts:', error);
      toast.error('Failed to fetch courts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.name || !form.location || !form.capacity || !form.price) {
      toast.error('Please fill in all required fields');
      return;
    }
  
    try {
      setActionLoading('submit');
  
      // ✅ Ambil user login dari Supabase Auth
      const { data: userData, error: authError } = await supabase.auth.getUser();
  
      if (authError || !userData?.user?.id) {
        console.error("User not authenticated:", authError);
        throw new Error("User not authenticated");
      }
  
      const userId = userData.user.id;
  
      // ✅ Log untuk memastikan user ID valid
      console.log("🧑‍💻 Logged in user ID (auth.uid()):", userId);
  
      let imageUrl = form.image;
  
      // ✅ Upload gambar jika ada file
      if (imageFile && imageFile instanceof File) {
        const { publicUrl, error: uploadError } = await courtAPI.uploadCourtImage(
          imageFile,
          form.id || Date.now()
        );
        if (uploadError) {
          console.error("❌ Upload image failed:", uploadError);
          throw uploadError;
        }
        imageUrl = publicUrl;
        console.log("✅ Image uploaded. URL:", imageUrl);
      }
  
      // ✅ Siapkan data untuk dikirim ke database
      const courtData = {
        name: form.name,
        type: form.type,
        location: form.location,
        capacity: parseInt(form.capacity),
        status: form.status,
        image: imageUrl,
        price: parseInt(form.price),
        user_id: userId
      };
  
      // ✅ Log isi data sebelum dikirim ke database
      console.log("📦 courtData to be inserted/updated:", courtData);
  
      if (form.id) {
        // Update data court
        const { data, error } = await courtAPI.updateCourt(form.id, courtData);
        if (error) {
          console.error("❌ Error updating court:", error);
          throw error;
        }
        setCourts(prev => prev.map(c => c.id === form.id ? data : c));
        toast.success('Court updated successfully');
      } else {
        // Insert court baru
        const { data, error } = await courtAPI.createCourt(courtData);
        if (error) {
          console.error("❌ Error creating court:", error);
          throw error;
        }
        setCourts(prev => [data, ...prev]);
        toast.success('Court created successfully');
      }
  
      resetForm();
      setImageFile(null);
    } catch (error) {
      console.error('🚨 Error saving court:', error);
      toast.error('Failed to save court');
    } finally {
      setActionLoading(null);
    }
  };
  

  const handleDelete = async (courtId, courtName) => {
    if (!confirm(`Are you sure you want to delete ${courtName}?`)) {
      return;
    }

    try {
      setActionLoading(courtId);
      const { error } = await courtAPI.deleteCourt(courtId);

      if (error) throw error;

      setCourts(prev => prev.filter(c => c.id !== courtId));
      toast.success('Court deleted successfully');
    } catch (error) {
      console.error('Error deleting court:', error);
      toast.error('Failed to delete court');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (court) => {
    setForm({
      id: court.id,
      name: court.name,
      type: court.type,
      location: court.location,
      capacity: court.capacity.toString(),
      status: court.status,
      image: court.image,
      price: court.price?.toString() || ""
    });
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      type: "Synthetic",
      location: "",
      capacity: "",
      status: COURT_STATUS.ACTIVE,
      image: null,
      price: ""
    });
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case COURT_STATUS.ACTIVE:
        return "bg-green-100 text-green-800 border-green-200";
      case COURT_STATUS.INACTIVE:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case COURT_STATUS.MAINTENANCE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(search.toLowerCase()) ||
      court.location.toLowerCase().includes(search.toLowerCase()) ||
      court.type.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || court.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading courts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Court Management
              </h1>
              <p className="text-gray-600">
                Manage and monitor all sports courts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{courts.length} total courts</span>
              </div>
              <button
                onClick={fetchCourts}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Court
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courts by name, location, or type..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value={COURT_STATUS.ACTIVE}>Active</option>
                <option value={COURT_STATUS.INACTIVE}>Inactive</option>
                <option value={COURT_STATUS.MAINTENANCE}>Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <div
              key={court.id}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gray-100">
                {court.image ? (
                  <img
                    src={court.image}
                    alt={court.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full flex items-center justify-center ${
                    court.image ? 'hidden' : 'flex'
                  }`}
                >
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No Image</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(court.status)}`}>
                    {court.status}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded-full">
                    Rp {court.price?.toLocaleString('id-ID') || '0'}/jam
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {court.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    📍 {court.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    🏟️ {court.type} • 👥 {court.capacity} people
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(court)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(court.id, court.name)}
                    disabled={actionLoading === court.id}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === court.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
            <p className="text-gray-500">
              {search || statusFilter
                ? "Try adjusting your search or filter criteria."
                : "No courts have been added yet."}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {form.id ? "Edit Court" : "Add New Court"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Court Name *
                </label>
                <input
                  required
                  placeholder="Enter court name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  required
                  placeholder="Enter court location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Synthetic">Synthetic</option>
                    <option value="Vinyl">Vinyl</option>
                    <option value="Hardwood">Hardwood</option>
                    <option value="Concrete">Concrete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="Capacity"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={COURT_STATUS.ACTIVE}>Active</option>
                  <option value={COURT_STATUS.INACTIVE}>Inactive</option>
                  <option value={COURT_STATUS.MAINTENANCE}>Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Sewa per Jam (Rp) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Masukkan harga sewa"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar Lapangan
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {form.image && !imageFile && (
                  <div className="mt-2">
                    <img src={form.image} alt="Current" className="h-24 w-24 rounded object-cover border" />
                    <p className="text-xs text-gray-500 mt-1">Current image</p>
                  </div>
                )}
                {imageFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-24 w-24 rounded object-cover border" />
                    <p className="text-xs text-gray-500 mt-1">New image preview</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'submit'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading === 'submit' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {form.id ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourts;