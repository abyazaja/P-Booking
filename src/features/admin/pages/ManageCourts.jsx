import { supabase } from '../../../shared/constants/supabase';

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
  Image as ImageIcon,
  Building,
  Activity,
  Eye,
  Settings,
  MapPin,
  Users,
  Trophy,
  TrendingUp,
  Crown,
  ChevronRight,
  Calendar,
  DollarSign,
  Target,
  Zap
} from "lucide-react";
import { courtAPI } from "../../../shared/services/courtAPI";
import { COURT_STATUS } from "../../../shared/constants/supabase";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../shared/components/ui/LoadingSpinner";

const ManageCourts = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);
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
      toast.error('Gagal memuat data lapangan');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.name || !form.location || !form.capacity || !form.price) {
      toast.error('Harap isi semua bidang yang diperlukan');
      return;
    }
  
    try {
      setActionLoading('submit');
  
      // ✅ Ambil user login dari Supabase Auth
      const { data: userData, error: authError } = await supabase.auth.getUser();
  
      if (authError || !userData?.user?.id) {
        console.error("User not authenticated:", authError);
        throw new Error("Pengguna tidak terautentikasi");
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
        toast.success('Lapangan berhasil diperbarui');
      } else {
        // Insert court baru
        const { data, error } = await courtAPI.createCourt(courtData);
        if (error) {
          console.error("❌ Error creating court:", error);
          throw error;
        }
        setCourts(prev => [data, ...prev]);
        toast.success('Lapangan berhasil dibuat');
      }
  
      resetForm();
      setImageFile(null);
    } catch (error) {
      console.error('🚨 Error saving court:', error);
      toast.error('Gagal menyimpan lapangan');
    } finally {
      setActionLoading(null);
    }
  };
  

  const handleDelete = async (courtId, courtName) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lapangan ${courtName}?`)) {
      return;
    }

    try {
      setActionLoading(courtId);
      const { error } = await courtAPI.deleteCourt(courtId);

      if (error) throw error;

      setCourts(prev => prev.filter(c => c.id !== courtId));
      toast.success('Lapangan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting court:', error);
      toast.error('Gagal menghapus lapangan');
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
    return <LoadingSpinner size="lg" text="Memuat data lapangan..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ballgreen rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Lapangan</h1>
                <p className="text-gray-600">Atur dan kelola semua lapangan futsal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchCourts}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-ballgreen hover:bg-ballgreen/90 text-white rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Lapangan
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{courts.length}</div>
                <div className="text-gray-600">Total Lapangan</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {courts.filter(c => c.status === COURT_STATUS.ACTIVE).length}
                </div>
                <div className="text-gray-600">Lapangan Aktif</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {courts.filter(c => c.status === COURT_STATUS.MAINTENANCE).length}
                </div>
                <div className="text-gray-600">Dalam Perawatan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari lapangan berdasarkan nama, lokasi, atau jenis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ballgreen focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ballgreen focus:border-transparent"
              >
                <option value="">Semua Status</option>
                <option value={COURT_STATUS.ACTIVE}>Aktif</option>
                <option value={COURT_STATUS.INACTIVE}>Tidak Aktif</option>
                <option value={COURT_STATUS.MAINTENANCE}>Perawatan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courts Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Lapangan ({filteredCourts.length})
            </h3>
          </div>
          
          {filteredCourts.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {search || statusFilter ? 'Tidak ada lapangan yang ditemukan' : 'Belum ada lapangan'}
              </h4>
              <p className="text-gray-600">
                {search || statusFilter ? 'Coba ubah kata kunci pencarian' : 'Lapangan yang ditambahkan akan muncul di sini'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredCourts.map((court) => (
                <div
                  key={court.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
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
                        <p className="text-sm text-gray-500">Tidak ada gambar</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(court.status)}`}>
                        {court.status === COURT_STATUS.ACTIVE ? 'Aktif' : 
                         court.status === COURT_STATUS.INACTIVE ? 'Tidak Aktif' : 'Perawatan'}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-ballgreen text-white px-2 py-1 text-xs font-semibold rounded-full">
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
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{court.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{court.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{court.capacity} orang</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(court)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(court.id, court.name)}
                        disabled={actionLoading === court.id}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === court.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {form.id ? "Edit Lapangan" : "Tambah Lapangan Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lapangan *
                </label>
                <input
                  required
                  placeholder="Masukkan nama lapangan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi *
                </label>
                <input
                  required
                  placeholder="Masukkan lokasi lapangan"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Lapangan
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                  >
                    <option value="Synthetic">Sintetis</option>
                    <option value="Vinyl">Vinyl</option>
                    <option value="Hardwood">Kayu Keras</option>
                    <option value="Concrete">Beton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kapasitas *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="Kapasitas"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ballgreen focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                >
                  <option value={COURT_STATUS.ACTIVE}>Aktif</option>
                  <option value={COURT_STATUS.INACTIVE}>Tidak Aktif</option>
                  <option value={COURT_STATUS.MAINTENANCE}>Perawatan</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ballgreen focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ballgreen focus:border-transparent"
                />
                {form.image && !imageFile && (
                  <div className="mt-2">
                    <img src={form.image} alt="Current" className="h-24 w-24 rounded object-cover border" />
                    <p className="text-xs text-gray-500 mt-1">Gambar saat ini</p>
                  </div>
                )}
                {imageFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-24 w-24 rounded object-cover border" />
                    <p className="text-xs text-gray-500 mt-1">Pratinjau gambar baru</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'submit'}
                  className="px-4 py-2 bg-ballgreen text-white rounded-xl hover:bg-ballgreen/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading === 'submit' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {form.id ? "Perbarui" : "Buat"}
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